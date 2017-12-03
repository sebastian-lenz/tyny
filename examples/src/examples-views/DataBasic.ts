import { $, View, ViewOptions } from 'tyny';

import propertyTable from './utils/propertyTable';

enum EnumData {
  Top,
  Right,
  Bottom,
  Left,
}

@$.component('.tynyViewsDataBasic')
export default class DataBasic extends View {
  [name: string]: any;

  @$.data({ type: 'any' })
  anyValue: any;

  @$.data({ type: 'bool' })
  boolValue: boolean;

  @$.data({ type: 'enum', values: EnumData })
  enumValue: EnumData;

  @$.data({ type: 'int' })
  intValue: number;

  @$.data({ type: 'number' })
  numberValue: number;

  @$.data({ type: 'object' })
  objectValue: object;

  @$.data({ type: 'string' })
  stringValue: string;

  constructor(options: ViewOptions) {
    super(options);
    this.element.innerHTML = propertyTable(this, [
      'anyValue',
      'boolValue',
      'enumValue',
      'intValue',
      'numberValue',
      'objectValue',
      'stringValue',
    ]);
  }
}
