# Events

## Delegates

{{#example source="examples-views/EventsDelegate.ts"}}
<div class="tynyViewsEventsDelegate">
  <div class="display">0</div>
  <button>Plus one</button>
</div>
{{/example}}


## Resize event

{{#example source="examples-views/EventsResize.ts"}}
<div class="tynyViewsEventsResize"></div>
{{/example}}


## Pointer events

{{#example source="examples-views/EventsPointers.ts"}}
<style>
  .tynyViewsEventsPointers {
    height: 80vh;
  }

  .tynyViewsEventsPointers > .pointer {
    position: fixed;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    background: #f00;
    border-radius: 10px;
    pointer-events: none;
  }
</style>
<div class="tynyViewsEventsPointers"></div>
{{/example}}
