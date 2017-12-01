export default (function(has: Function) {
  const supportsDescriptors =
    Object.defineProperty &&
    (function() {
      try {
        const obj: any = {};
        Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        for (const _ in obj) return false;
        return obj.x === obj;
      } catch (e) {
        return false;
      }
    })();

  // Define configurable, writable, and non-enumerable props
  // if they don't exist.
  let defineProperty: Function;
  if (supportsDescriptors) {
    defineProperty = function(
      object: any,
      name: string,
      method: Function,
      forceAssign: boolean
    ) {
      if (!forceAssign && name in object) {
        return;
      }

      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: method,
      });
    };
  } else {
    defineProperty = function(
      object: any,
      name: string,
      method: Function,
      forceAssign: boolean
    ) {
      if (!forceAssign && name in object) {
        return;
      }

      object[name] = method;
    };
  }

  return function defineProperties(
    object: any,
    map: any,
    forceAssign?: boolean
  ) {
    for (const name in map) {
      if (has.call(map, name)) {
        defineProperty(object, name, map[name], forceAssign);
      }
    }
  };
})(Object.prototype.hasOwnProperty);
