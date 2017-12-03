let styleSheet: CSSStyleSheet | undefined;

function findStylesheet(rule: string): CSSStyleSheet | undefined {
  if (!document.styleSheets) {
    return undefined;
  }

  for (let index = 0; index < document.styleSheets.length; index++) {
    const stylesheet = <CSSStyleSheet>document.styleSheets[index];
    try {
      stylesheet.insertRule(rule);
      return stylesheet;
    } catch (error) {}
  }

  return undefined;
}

export default function insertRule(rule: string) {
  if (!styleSheet) {
    styleSheet = findStylesheet(rule);
  }

  if (!styleSheet) {
    const style = document.createElement('style');
    style.innerHTML = rule;
    document.head.appendChild(style);
  }
}
