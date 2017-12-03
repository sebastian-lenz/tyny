# Data decorator

## Basic value types

{{#example source="examples-views/DataBasic.ts"}}
<div
  class="tynyViewsDataBasic"
  data-any-value="100.25"
  data-bool-value="true"
  data-enum-value="Bottom"
  data-int-value="100.25"
  data-number-value="100.25"
  data-object-value="{&quot;key&quot;:&quot;Hello world!&quot;}"
  data-string-value="Hello world!"
></div>
{{/example}}


## Data class

{{#example source="examples-views/DataClass.ts"}}
<div
  class="tynyViewsDataClass"
  data-movie="John Doe,Frank Capra,1941"
></div>
{{/example}}


## DOM elements

{{#example source="examples-views/DataElement.ts"}}
<div
  class="tynyViewsDataElement"
  data-single-element=".singleElement"
  data-multiple-elements="li"
>
  <p class="singleElement"></p>
  <ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</div>
{{/example}}



## Owner

{{#example source="examples-views/DataOwner.ts"}}
<div class="tynyViewsDataOwner">
  <div class="childComponent"></div>
</div>
{{/example}}
