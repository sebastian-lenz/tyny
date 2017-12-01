import { EventEmitter } from 'tyny-events';

import PointerList from '../PointerList';

export default class Behaviour extends EventEmitter {
  list: PointerList;

  constructor(list: PointerList) {
    super();
    this.list = list;
  }
}
