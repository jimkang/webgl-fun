import RouteState from 'route-state';
import handleError from 'handle-error-web';
import { version } from './package.json';
import RandomId from '@jimkang/randomid';
import { renderTriangle } from './renderers/render-triangle';

var routeState;

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
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
