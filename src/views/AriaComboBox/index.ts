import { event, property, View } from '../../index';
import { transistHeight } from '../../fx/transistHeight';
import type { TransistHeightOptions } from '../../fx/transistHeight';
import type { ViewOptions } from '../../index';

export interface AriaComboBoxOptions extends ViewOptions {
  mask?: HTMLElement | string;
  transition?: TransistHeightOptions;
}

class AriaComboBox extends View {
  activeOption: HTMLElement | null = null;
  isExpanded: boolean = false;
  selectedOption: HTMLElement | null = null;

  constructor(options: AriaComboBoxOptions) {
    super(options);
  }

  get activeIndex(): number {
    const { options, activeOption } = this;
    return options.findIndex((option) => option === activeOption);
  }

  set activeIndex(value: number) {
    const { options } = this;
    if (!options.length || value === -1) {
      this.setActiveOption(null);
    } else if (value < 0 || value > options.length) {
      this.setActiveOption(options[options.length - 1]);
    } else {
      this.setActiveOption(options[value]);
    }
  }

  get comboBox(): HTMLElement {
    return this.find('*[role="combobox"]') || this.el;
  }

  @property({ immediate: true })
  get mask(): HTMLElement | null {
    return this.params.element({
      defaultValue: '*[data-combobox-mask]',
      name: 'mask',
    });
  }

  @property()
  get options(): Array<HTMLElement> {
    return this.findAll('*[role="option"]');
  }

  get selectedIndex(): number {
    const { options, selectedOption } = this;
    return options.findIndex((option) => option === selectedOption);
  }

  set selectedIndex(value: number) {
    const { options } = this;
    if (value < 0 || value > options.length) {
      this.setSelectedOption(null);
    } else {
      this.setSelectedOption(options[value]);
    }
  }

  handleChange(option: HTMLElement | null) {
    this.setSelectedOption(option);
    this.setExpanded(false);
  }

  @event({ name: 'focusout' })
  onFocusOut(event: FocusEvent) {
    let target = event.relatedTarget as HTMLElement | null;
    while (target) {
      if (target === this.el) return;
      target = target.parentElement;
    }

    this.setExpanded(false);
  }

  @event({ name: 'click', selector: '*[role="combobox"]' })
  onComboBoxClick() {
    this.setExpanded(!this.isExpanded);
  }

  @event({ name: 'keydown' })
  onKeyDown(event: KeyboardEvent) {
    if (
      this.isExpanded
        ? this.processKeyExpanded(event.key)
        : this.processKeyClosed(event.key)
    ) {
      event.preventDefault();
    }
  }

  @event({ name: 'click', selector: '*[role="option"]' })
  onOptionClick(event: tyny.DelegateEvent) {
    this.handleChange(event.current);
    event.preventDefault();
  }

  @event({ name: 'mouseover', selector: '*[role="option"]' })
  onOptionMouseOver(event: tyny.DelegateEvent) {
    this.setActiveOption(event.current);
  }

  processKeyClosed(key: string) {
    switch (key) {
      case 'Home':
        this.setExpanded(true, 0);
        return true;

      case 'End':
        this.setExpanded(true, -2);
        return true;

      case ' ':
      case 'Enter':
      case 'ArrowUp':
      case 'ArrowDown':
        this.setExpanded(true);
        return true;

      default:
        return false;
    }
  }

  processKeyExpanded(key: string) {
    const { activeIndex, activeOption, options } = this;

    switch (key) {
      case 'ArrowUp':
        this.activeIndex = Math.max(0, activeIndex - 1);
        return true;

      case 'ArrowDown':
        this.activeIndex = Math.min(options.length - 1, activeIndex + 1);
        return true;

      case 'Home':
        this.activeIndex = 0;
        return true;

      case 'End':
        this.activeIndex = -2;
        return true;

      case ' ':
      case 'Enter':
        this.handleChange(activeOption);
        return true;

      case 'Escape':
        this.setExpanded(false);
        return true;

      default:
        return false;
    }
  }

  setExpanded(
    value: boolean,
    initialActiveIndex: number = Math.max(0, this.selectedIndex)
  ) {
    if (this.isExpanded === value) return;
    this.isExpanded = value;

    const { mask } = this;
    const apply = () => {
      this.toggleClass('expanded', value);
      this.comboBox.setAttribute('aria-expanded', value ? 'true' : 'false');
      this.activeIndex = value ? initialActiveIndex : -1;
    };

    if (mask) {
      transistHeight(mask, apply, this.params.options.transition);
    } else {
      apply();
    }
  }

  setActiveOption(value: HTMLElement | null) {
    const { activeOption } = this;
    if (activeOption === value) return;

    this.activeOption = value;
    this.comboBox.setAttribute('aria-activedescendant', value ? value.id : '');

    if (activeOption) {
      activeOption.classList.remove('active');
    }

    if (value) {
      value.classList.add('active');
    }
  }

  setSelectedOption(value: HTMLElement | null) {
    const { selectedOption } = this;
    if (selectedOption === value) return;

    this.selectedOption = value;

    if (selectedOption) {
      selectedOption.setAttribute('aria-selected', 'false');
    }

    if (value) {
      value.setAttribute('aria-selected', 'true');
    }
  }
}
