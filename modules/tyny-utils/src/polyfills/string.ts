import defineProperties from './utils/defineProperties';

defineProperties(String.prototype, {
  /**
   * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
   */
  trim: function(this: string): string {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  },
});
