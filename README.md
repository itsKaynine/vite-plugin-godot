# vite-plugin-godot

Embed and bundle [Godot](https://godotengine.org/) 4.x games using [Vite](https://vitejs.dev/).

[![npm][badge-version]][npm]
[![license][badge-license]][license]

The plugin allows you to export your Godot game directly to the `public` folder. The dev server will automatically include the appropriate headers that will make the page cross-origin isolated (required for `SharedArrayBuffer`).

See example in [`examples/vanilla`][examples-vanilla].

## Usage

Install the package:

```bash
npm install vite-plugin-godot -D
```

Add the plugin to `vite.config.js`:

```ts
import { defineConfig } from 'vite';
import godotPlugin from 'vite-plugin-godot';

export default defineConfig({
  plugins: [
    godotPlugin({
      // Set this to your exported name
      projectName: 'example2d',
      // Reload the page when detected changes in main.js
      reload: ['src/main.js'],
    }),
  ],
});
```

Make sure you have a `canvas` element somewhere in your DOM, then add the following to your `index.html`:

```html
<script src="$GODOT_JS_FILE"></script>
<script>
  const GODOT_CONFIG = $GODOT_CONFIG;
  window.engine = new Engine(GODOT_CONFIG);
</script>
```

Now you can start the game in your script:

```js
window.engine.startGame();
```

## Export

Export the game using `Web` preset and set the directory to the `public` folder.

You can read more about exporting HTML in [Godot docs](https://docs.godotengine.org/en/latest/tutorials/platform/web/customizing_html5_shell.html).

## License

This project is licensed under the [MIT License][license].

[badge-version]: https://img.shields.io/npm/v/vite-plugin-godot.svg
[badge-license]: https://img.shields.io/npm/l/vite-plugin-godot.svg

[npm]: https://www.npmjs.com/package/vite-plugin-godot
[license]: https://github.com/itsKaynine/vite-plugin-godot/blob/main/LICENSE

[examples-vanilla]: https://github.com/itsKaynine/vite-plugin-godot/tree/main/examples/vanilla
