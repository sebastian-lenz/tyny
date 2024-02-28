import { event, property } from '../../../core';
import { SyncOptions } from '../Modifier';
import { Url } from '../../../utils/types/Url';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';
import { FilterableViewParams } from '..';

const selector = 'input[type=checkbox],input[type=radio]';

export interface CheckboxesModifierOptions extends ViewModifierOptions {
  checkboxSelector?: string;
  glue?: string;
  paramName?: string;
  triggerSoftReset?: boolean;
}

export class CheckboxesModifier extends ViewModifier {
  @property({ param: { defaultValue: selector, type: 'string' } })
  checkboxSelector!: string;

  @property({ param: { defaultValue: ',', type: 'string' } })
  glue!: string;

  @property({ param: { defaultValue: 'unknown', type: 'string' } })
  paramName!: string;

  @property({ param: { defaultValue: false, type: 'bool' } })
  triggerSoftReset!: boolean;

  constructor(options: CheckboxesModifierOptions = {}) {
    super(options);
  }

  getCheckboxes() {
    return this.findAll<HTMLInputElement>(this.checkboxSelector);
  }

  getParams(): FilterableViewParams {
    const paramValue = this.getValues().map(encodeURIComponent).join(this.glue);

    return {
      [this.paramName]: Url.safeParam(paramValue),
    };
  }

  getValues(): Array<string> {
    return this.getCheckboxes()
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value)
      .sort();
  }

  setValues(values: Array<string>, silent?: boolean) {
    for (const checkbox of this.getCheckboxes()) {
      if (!checkbox.value) {
        checkbox.checked = !values.length;
      } else {
        checkbox.checked = values.indexOf(checkbox.value) !== -1;
      }
    }

    if (!silent) {
      this.onChange();
    }
  }

  sync({ url }: SyncOptions): boolean {
    const current = this.getValues();
    const values = `${url.getParam(this.paramName, '')}`
      .split(this.glue)
      .filter((value) => !!value)
      .sort();

    if (
      current.length === values.length &&
      current.every((value) => values.indexOf(value) !== -1)
    ) {
      return false;
    }

    this.setValues(values, true);
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
