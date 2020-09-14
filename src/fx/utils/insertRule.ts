let styleSheet: CSSStyleSheet | undefined;

export function insertRule(rule: string) {
  if (!styleSheet) {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    style.innerHTML = rule;
    (document.head || document.body).appendChild(style);
    styleSheet = <CSSStyleSheet>style.sheet;
  }

  styleSheet.insertRule(rule, 0);
}
