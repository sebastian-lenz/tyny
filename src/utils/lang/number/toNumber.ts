export function toNumber(value: any): number | false {
  const number = Number(value);
  return !isNaN(number) ? number : false;
}
