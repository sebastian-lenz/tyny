import { Accessor } from '../index';

interface UnitValue {
  unit: string;
  value: number;
}

const unitRegexp = /^(\d+)\s*(%|ch|cm|em|ex|mm|in|pc|pt|px|rem|vh|vmax|vmin|vw)$/;

function parse(value: any): UnitValue | undefined {
  if (typeof value === 'string') {
    const matches = unitRegexp.exec(value);
    if (matches) {
      return {
        unit: matches[2],
        value: parseFloat(matches[1]),
      };
    }
  }

  return undefined;
}

export default function unitConverter(accessor: Accessor): Accessor<number> {
  const initialValue = accessor.getValue();
  const unitValue = parse(initialValue);
  if (!unitValue) {
    return accessor;
  }

  const { unit } = unitValue;

  function convert(value: any): number {
    if (typeof value === 'number') {
      return value;
    }

    const parsed = parse(value);
    if (!parsed) {
      throw new Error(`Not a valid unit value: '${value}'.`);
    } else if (parsed.unit !== unit) {
      console.warn(
        `Unit mismatch: Expected '${unit}' but got '${parsed.unit}'.`
      );
    }

    return parsed.value;
  }

  return {
    ...accessor,
    convert,
    getValue: (): number => convert(accessor.getValue()),
    setValue: (value: number) => accessor.setValue(`${value}${unit}`),
  };
}
