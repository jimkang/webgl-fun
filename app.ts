import RouteState from 'route-state';
import handleError from 'handle-error-web';
import { version } from './package.json';
import RandomId from '@jimkang/randomid';
import { renderTriangle } from './renderers/render-triangle';
import { renderTexture } from './renderers/render-texture';
import { renderTransforms } from './renderers/render-tranforms';
import { renderRotation } from './renderers/render-rotation';
import { Pt3 } from './types';

var routeState;
var textureImages: TexImageSource[] = [];
var currentRotation: Pt3 = { x: 0, y: 0, z: 0 };

(async function go() {
  window.onerror = reportTopLevelError;
  renderVersion();

  routeState = RouteState({
    followRoute,
    windowObject: window,
    propsToCoerceToBool: [],
  });
  routeState.routeFromHash();
})();

async function followRoute({ seed }) {
  var randomId;
  if (!seed) {
    randomId = RandomId();
    routeState.addToRoute({ seed: randomId(8) });
    return;
  }

  renderTriangle({ canvasSel: '#triangle-canvas' });

  var image = new Image();
  // image.crossOrigin = 'credentials';
  image.src = 'static/test-images/airhorn.png';
  // image.src = 'static/test-images/leaves.jpg';
  image.onload = collectTexture;

  // Going to hope image qualifies as a TexImageSource.
  function collectTexture() {
    textureImages.push(image);
    renderTexture({ canvasSel: '#texture-canvas', textureImages });
    renderTransforms({ canvasSel: '#transforms-canvas', textureImages });
    scheduleRenderRotation();
    wireControls();
  }
}

function scheduleRenderRotation() {
  requestAnimationFrame(() =>
    renderRotation({
      canvasSel: '#rotation-canvas',
      textureImages,
      rotation: currentRotation, //{ x: Math.PI, y: -1, z: Math.PI / 4 },
    })
  );
}

function wireControls() {
  // Change the rotation when the mouse is clicked inside the rotation canvas
  // then dragged.
  var rotationCanvas = document.getElementById('rotation-canvas');
  rotationCanvas.addEventListener('mousedown', onRotationMouseDown);

  function onRotationMouseDown() {
    document.body.addEventListener('mouseup', onBodyMouseUp, { once: true });
    document.body.addEventListener('mousemove', onBodyMouseMove);
  }

  function onBodyMouseUp() {
    document.body.removeEventListener('mousemove', onBodyMouseMove);
  }

  function onBodyMouseMove(event) {
    // TODO: Find out what the movement units actually are.
    currentRotation.y += event.movementX;
    currentRotation.x += event.movementY;
    scheduleRenderRotation();
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
