Date.now =
  Date.now ||
  function() {
    return new Date().getTime();
  };

(function(scope: any) {
  const vendors = ['webkit', 'moz'];
  for (let i = 0; i < vendors.length && !scope.requestAnimationFrame; ++i) {
    const vendor = vendors[i];
    scope.requestAnimationFrame = scope[`${vendor}RequestAnimationFrame`];
    scope.cancelAnimationFrame =
      scope[`${vendor}CancelAnimationFrame`] ||
      scope[`${vendor}CancelRequestAnimationFrame`];
  }

  if (!('requestAnimationFrame' in scope)) {
    let lastTime = 0;
    scope.requestAnimationFrame = function(callback: Function): number {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = scope.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);

      lastTime = currTime + timeToCall;
      return id;
    };

    scope.cancelAnimationFrame = function(id: number) {
      clearTimeout(id);
    };
  }

  if (!('performance' in scope)) {
    scope.performance = {};
  }

  if (!('now' in scope.performance)) {
    let nowOffset = Date.now();
    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    }

    scope.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
})(window);
