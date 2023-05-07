import './style.css';

document.querySelector('#app').innerHTML = `
  <div id="loading" class="lds-dual-ring center-screen"></div>
  <canvas id="canvas" />
`;

// Start the game
window.engine.startGame()
  .then(() => {
    document.getElementById('loading')?.remove();
  });
