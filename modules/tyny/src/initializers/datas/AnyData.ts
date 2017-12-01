import Data, { DataOptions } from '../Data';
import View from '../../View';

export interface AnyDataOptions extends DataOptions<any> {
  type: 'any';
}

export default class AnyData extends Data<any, AnyDataOptions> {}
