/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/**
 * Most DOMException implementations don't allow calling DOMException's toString()
 * on non-DOMExceptions. Error's toString() is sufficient here.
 *
 * Vendors: please allow content code to instantiate DOMExceptions
 */
class ClassListError extends Error {
  public code: number;

  /**
   * Create a new ClassListError instance.
   */
  constructor(type: string, message: string) {
    super();
    this.name = type;
    this.code = (<any>DOMException)[type];
    this.message = message;
  }
}

/**
 * Class list polyfill.
 */
class ClassList {
  private classes: string[];
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    const attr = (element.getAttribute('class') || '').trim();
    const classes = attr ? attr.split(/\s+/) : [];

    this.element = element;
    this.classes = classes;
  }

  private updateClassName() {
    this.element.setAttribute('class', this.toString());
  }

  private checkTokenAndGetIndex(token: string): number {
    if (token === '') {
      throw new ClassListError(
        'SYNTAX_ERR',
        'An invalid or illegal string was specified'
      );
    }

    if (/\s/.test(token)) {
      throw new ClassListError(
        'INVALID_CHARACTER_ERR',
        'String contains an invalid character'
      );
    }

    return this.classes.indexOf(token);
  }

  item(index: number): string | null {
    return this.classes[index] || null;
  }

  contains(token: string): boolean {
    token += '';
    return this.checkTokenAndGetIndex(token) !== -1;
  }

  add(...classes: string[]): void;
  add(): void {
    let updated = false;

    for (let n = 0, c = arguments.length; n < c; n++) {
      const token = arguments[n] + '';
      if (this.checkTokenAndGetIndex(token) === -1) {
        this.classes.push(token);
        updated = true;
      }
    }

    if (updated) {
      this.updateClassName();
    }
  }

  remove(...classes: string[]): void;
  remove(): void {
    let updated = false;

    for (let n = 0, c = arguments.length; n < c; n++) {
      const token = arguments[n] + '';
      let index = this.checkTokenAndGetIndex(token);

      while (index !== -1) {
        this.classes.splice(index, 1);
        updated = true;
        index = this.checkTokenAndGetIndex(token);
      }
    }

    if (updated) {
      this.updateClassName();
    }
  }

  toggle(token: string, force?: boolean): boolean {
    token += '';

    const result = this.contains(token);
    const method = result
      ? force !== true && 'remove'
      : force !== false && 'add';

    if (method) {
      this[method](token);
    }

    if (force === true || force === false) {
      return force;
    } else {
      return !result;
    }
  }

  toString(): string {
    return this.classes.join(' ');
  }
}

/**
 * Getter callback for the class list property.
 */
function getClassList(this: HTMLElement) {
  return new ClassList(this);
}

/**
 * Full polyfill for browsers with no classList support
 * Including IE < Edge missing SVGElement.classList
 */
function polyfill(scope: any) {
  if (!('Element' in scope)) return;
  var elementPrototype = scope.Element.prototype;

  if (Object.defineProperty) {
    var property = {
      get: getClassList,
      enumerable: true,
      configurable: true,
    };

    try {
      Object.defineProperty(elementPrototype, 'classList', property);
    } catch (ex) {
      // IE 8 doesn't support enumerable:true
      if (ex.number === -0x7ff5ec54) {
        property.enumerable = false;
        Object.defineProperty(elementPrototype, 'classList', property);
      }
    }
  } else if ('__defineGetter__' in Object.prototype) {
    elementPrototype['__defineGetter__']('classList', getClassList);
  }
}

/**
 * There is full or partial native classList support, so just check if we need
 * to normalize the add/remove and toggle APIs.
 */
function normalize() {
  var testElement = document.createElement('_');
  testElement.classList.add('c1', 'c2');

  // Polyfill for IE 10/11 and Firefox <26, where classList.add and
  // classList.remove exist but support only one argument at a time.
  if (!testElement.classList.contains('c2')) {
    const createMethod = function(target: any, method: string) {
      var original = target[method];
      target[method] = function() {
        const len = arguments.length;
        for (let i = 0; i < len; i++) {
          const token = arguments[i];
          original.call(this, token);
        }
      };
    };

    createMethod(DOMTokenList.prototype, 'add');
    createMethod(DOMTokenList.prototype, 'remove');
  }

  testElement.classList.toggle('c3', false);

  // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
  // support the second argument.
  if (testElement.classList.contains('c3')) {
    var _toggle = DOMTokenList.prototype.toggle;
    DOMTokenList.prototype.toggle = function(token, force) {
      if (1 in arguments && !this.contains(token) === !force) {
        return force;
      } else {
        return _toggle.call(this, token);
      }
    };
  }
}

/**
 * Test whether the classList property is supported.
 */
export function isClassListSupported() {
  const el = document.createElement('div');
  return 'classList' in el;
}

/**
 * Initialize the polyfill.
 */
if ('document' in self) {
  if (!isClassListSupported()) {
    polyfill(self);
  } else {
    normalize();
  }
}
