# Events

## Delegates

{{#example source="examples-views/EventsDelegate.ts"}}
<div class="tynyCoreEventsDelegate">
  <div class="display">0</div>
  <button>Plus one</button>
</div>
{{/example}}


## Resize event

{{#example source="examples-views/EventsResize.ts"}}
<div class="tynyCoreEventsResize"></div>
{{/example}}


## Pointer events

{{#example source="examples-views/EventsPointers.ts"}}
<style>
  .tynyCoreEventsPointers {
    height: 80vh;
  }

  .tynyCoreEventsPointers > .pointer {
    position: fixed;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    background: #f00;
    border-radius: 10px;
    pointer-events: none;
  }
</style>
<div class="tynyCoreEventsPointers"></div>
{{/example}}
