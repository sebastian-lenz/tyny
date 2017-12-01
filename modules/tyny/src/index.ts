import 'tyny-polyfills';

import * as $ from './decorators';
import isLoadableView, { LoadableView } from './utils/isLoadableView';
import isSelectableView, { SelectableView } from './utils/isSelectableView';
import whenViewLoaded from './utils/whenViewLoaded';

import View, { ViewClass, ViewOptions } from './View';

export {
  LoadableView,
  SelectableView,
  View,
  ViewClass,
  ViewOptions,
  $,
  isLoadableView,
  isSelectableView,
  whenViewLoaded,
};
