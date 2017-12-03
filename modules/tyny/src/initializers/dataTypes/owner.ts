import { DataType, DefaultDataTypeOptions } from './index';
import View, { MaybeView, ViewOptions } from '../../View';

export interface OwnerDataTypeOptions extends DefaultDataTypeOptions<any> {
  type: 'owner';
}

function toOwner(view: View, options: ViewOptions): View | undefined {
  return options.owner;
}

export default function ownerDataType(
  options: OwnerDataTypeOptions
): DataType<View | undefined> {
  return toOwner;
}
