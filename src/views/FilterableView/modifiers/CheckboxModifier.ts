import { event, property } from '../../../core';
import { SyncOptions } from '../Modifier';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';
import { FilterableViewParams } from '..';

export interface CheckboxModifierOptions extends ViewModifierOptions {
  defaultValue?: boolean;
  paramName?: string;
  triggerSoftReset?: boolean;
}

export class CheckboxModifier extends ViewModifier {
  el!: HTMLInputElement;
  value: string = '';

  @property({ param: { type: 'bool', defaultValue: false } })
  defaultValue!: boolean;

  @property({ param: { defaultValue: false, type: 'bool' } })
  triggerSoftReset!: boolean;

  @property({ param: { type: 'string' } })
  get paramName(): string {
    return this.el.name;
  }

  constructor(options: CheckboxModifierOptions = {}) {
    super(options);
  }

  getValue(): boolean {
    return this.el.checked;
  }

  getParams(): FilterableViewParams {
    const paramValue = this.getParamValue();
    if (!this.getValue() || !paramValue) {
      return {};
    }

    return {
      [this.paramName]: paramValue,
    };
  }

  getParamValue() {
    return this.el.value;
  }

  setValue(value: boolean, silent?: boolean) {
    this.el.checked = value;

    if (!silent) {
      this.onChange();
    }
  }

  sync({ url }: SyncOptions): boolean {
    const value = url.getParam(this.paramName, '') === this.getParamValue();
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
      if (triggerSoftReset) {
        target.softReset();
      }

      target.commit();
    }
  }
}
