import fs from 'fs';
import path from 'path';

import type { Connect, PluginOption } from 'vite';
import ViteRestart from 'vite-plugin-restart';

const DEFAULT_GODOT_CONFIG_TOKEN = 'const GODOT_CONFIG = ';

export interface VitePluginGodotConfig {
  /**
   * The exported project name (eg. example2d)
   */
  projectName: string;
  /**
   * The token to search for $GODOT_CONFIG in the exported js file (you may need to set this if you use a Custom HTML Shell)
   * 
   * @default const GODOT_CONFIG = 
   */
  configToken?: string;
  /**
   * Array of files to watch, changes to those file will trigger a server restart
   */
  restart?: string[];
  /**
   * Array of files to watch, changes to those file will trigger a client full page reload
   */
  reload?: string[];
}

const tokenReplacePlugin = (token: string, replacement: string) => ({
  name: 'token-replace',
  transformIndexHtml(html: string) {
    return html.replace(token, replacement);
  },
});

const godotPlugin = (config: VitePluginGodotConfig): PluginOption[] => {
  const configToken = config.configToken ?? DEFAULT_GODOT_CONFIG_TOKEN;

  const htmlFile = `${config.projectName}.html`;
  const jsFile = `${config.projectName}.js`;

  const godotHtml = fs.readFileSync(`public/${htmlFile}`, { encoding: 'utf8' });
  const godotConfigLine = godotHtml.split(/\r?\n/).find((line) => line.startsWith(configToken)) ?? '{}';
  const godotConfig = godotConfigLine.replace(configToken, '').replace(';', '');

  const setHeaders: Connect.NextHandleFunction = (_req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  };

  return [
    ViteRestart({
      restart: config.restart ?? ['index.html'],
      reload: config.reload ?? [],
    }),
    tokenReplacePlugin('$GODOT_CONFIG', godotConfig),
    tokenReplacePlugin('$GODOT_JS_FILE', jsFile),
    {
      name: 'remove-godot-html',
      generateBundle(outputOptions) {
        const distDir = outputOptions.dir ?? path.dirname(outputOptions.file ?? '');
        const testHtmlPath = path.join(distDir, htmlFile);

        if (fs.existsSync(testHtmlPath)) {
          fs.unlinkSync(testHtmlPath);
        }
      },
    },
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use(setHeaders);
      },
    },
    {
      name: 'configure-preview-server',
      configurePreviewServer(server) {
        server.middlewares.use(setHeaders);
      },
    },
  ];
};

export default godotPlugin;

