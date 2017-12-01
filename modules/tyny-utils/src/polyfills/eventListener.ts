import defineProperties from './utils/defineProperties';

// EventListener Polyfill
// https://gist.githubusercontent.com/jonathantneal/3748027/raw/d262ccf278902705d61658a2fc5cd60409846b98/eventListener.polyfill.js

interface RegistryItem {
  callback: Function;
  listener: Function;
  target: any;
  type: string;
}

function polyfill() {
  const registry: RegistryItem[] = [];
  const props = {
    addEventListener: function(this: any, type: string, listener: Function) {
      const target = this;
      const callback = (event: any) => {
        event.currentTarget = target;
        event.target = event.srcElement || target;
        event.preventDefault = function() {
          event.returnValue = false;
        };
        event.stopPropagation = function() {
          event.cancelBubble = true;
        };

        listener.call(target, event);
      };

      registry.push({
        target,
        type,
        listener,
        callback,
      });

      this.attachEvent(`on${type}`, callback);
    },
    dispatchEvent: function(this: any, eventObject: any) {
      return this.fireEvent(`on${eventObject.type}`, eventObject);
    },
    removeEventListener: function(
      this: any,
      type: string,
      listener: Function
    ): any {
      for (let index = 0; index < registry.length; ++index) {
        const item = registry[index];
        if (
          item.target === this &&
          item.type === type &&
          item.listener === listener
        ) {
          registry.splice(index, 1);
          return this.detachEvent(`on${type}`, item.callback);
        }
      }
    },
  };

  const protos = [Window.prototype, HTMLDocument.prototype, Element.prototype];
  for (let index = 0; index < protos.length; index++) {
    defineProperties(protos[index], props);
  }
}

if (!window.addEventListener) {
  polyfill();
}
