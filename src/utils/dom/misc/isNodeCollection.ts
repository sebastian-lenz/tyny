export function isNodeCollection(obj: any): obj is NodeList {
  return !!toString.call(obj).match(/^\[object (NodeList|HTMLCollection)\]$/);
}
