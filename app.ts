import RouteState from 'route-state';
import handleError from 'handle-error-web';
import { version } from './package.json';
import RandomId from '@jimkang/randomid';
import { renderTriangle } from './renderers/render-triangle';
import { renderTexture } from './renderers/render-texture';

var routeState;
var textureImages: TexImageSource[] = [];

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
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
