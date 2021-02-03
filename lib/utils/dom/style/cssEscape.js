import { inBrowser } from '../../env';
import { isString } from '../../lang/string/isString';
const escapeFn = (inBrowser && window.CSS && CSS.escape) ||
    function (css) {
        return css.replace(/([^\x7f-\uFFFF\w-])/g, (match) => `\\${match}`);
    };
export function cssEscape(value) {
    return isString(value) ? escapeFn.call(null, value) : '';
}
