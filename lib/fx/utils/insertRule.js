let styleSheet;
export function insertRule(rule) {
    if (!styleSheet) {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        style.innerHTML = rule;
        (document.head || document.body).appendChild(style);
        styleSheet = style.sheet;
    }
    styleSheet.insertRule(rule, 0);
}
