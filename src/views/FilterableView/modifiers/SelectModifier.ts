import { event, property } from '../../../core';
import { SyncOptions } from '../Modifier';
import { UrlParamValue } from '../../../utils/types/Url';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';

export interface SelectModifierOptions extends ViewModifierOptions {
  defaultValue?: string;
  paramName?: string;
  triggerSoftReset?: boolean;
}

export class SelectModifier extends ViewModifier {
  el!: HTMLSelectElement;
  value: string = '';

  @property({ param: { type: 'string' } })
  defaultValue!: string | null;

  @property({ param: { defaultValue: true, type: 'bool' } })
  triggerSoftReset!: boolean;

  @property({ param: { type: 'string' } })
  get paramName(): string {
    return this.el.name;
  }

  constructor(options: SelectModifierOptions = {}) {
    super(options);
  }

  getValue(): string | null {
    const { selectedOptions } = this.el;
    const result: string[] = [];

    for (let index = 0; index < selectedOptions.length; index++) {
      const option = selectedOptions[index];
      if (option.value) {
        result.push(option.value);
      }
    }

    return result.length ? result.sort().join(',') : null;
  }

  getParams(): tyny.Map<UrlParamValue> {
    return {
      [this.paramName]: this.getValue(),
    };
  }

  setValue(value: string | null, silent?: boolean) {
    const values = value ? value.split(',').sort() : [];
    if (values.join(',') === this.getValue()) {
      return;
    }

    const { options } = this.el;
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      option.selected = values.indexOf(option.value) !== -1;
    }

    if (!silent) {
      this.onChange();
    }
  }

  sync({ url }: SyncOptions): boolean {
    const value = url.getParam(this.paramName);
    if (this.getValue() === value) {
      return false;
    }

    this.setValue(value, true);
    return true;
  }

  @event({ name: 'change' })
  onChange() {
    const { triggerSoftReset, target } = this;
    if (target) {
      if (triggerSoftReset) target.softReset();
      target.commit();
    }
  }
}
