import { getStyles } from './getStyles';
export function getStyle(element, property, pseudoElt) {
    var styles = getStyles(element, pseudoElt);
    return styles && property in styles ? styles[property] : null;
}
