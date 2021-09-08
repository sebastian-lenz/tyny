import { event, property } from '../../../core';
import { debounce } from '../../../utils/lang/function';
import { SyncOptions } from '../Modifier';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';

export interface InputModifierOptions extends ViewModifierOptions {
  defaultValue?: string;
  paramName?: string;
  triggerSoftReset?: boolean;
}

export class InputModifier extends ViewModifier {
  el!: HTMLInputElement;
  onChangeDebounced: Function | null = null;
  value: string = '';

  @property({ param: { type: 'number', defaultValue: 500 } })
  changeDelay!: number;

  @property({ param: { type: 'string', defaultValue: '' } })
  defaultValue!: string;

  @property({ param: { defaultValue: false, type: 'bool' } })
  triggerSoftReset!: boolean;

  @property({ param: { type: 'string' } })
  get paramName(): string {
    return this.el.name;
  }

  constructor(options: InputModifierOptions = {}) {
    super(options);
  }

  getValue(): string {
    return this.el.value;
  }

  getParams(): tyny.Map<string | null> {
    return {
      [this.paramName]: this.getValue(),
    };
  }

  setValue(value: string, silent?: boolean) {
    this.el.value = value;

    if (!silent) {
      this.onChange();
    }
  }

  sync({ url }: SyncOptions): boolean {
    const value = url.getParam(this.paramName, '');
    if (this.getValue() === value) {
      return false;
    }

    this.setValue(value, true);
    return true;
  }

  @event({ name: 'input change' })
  onChange() {
    let { onChangeDebounced } = this;
    if (!onChangeDebounced) {
      onChangeDebounced = this.onChangeDebounced = debounce(() => {
        const { triggerSoftReset, target } = this;
        if (target) {
          if (triggerSoftReset) {
            target.softReset();
          }

          target.commit();
        }
      }, this.changeDelay);
    }

    onChangeDebounced();
  }
}
