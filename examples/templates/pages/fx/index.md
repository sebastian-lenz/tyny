# Animations

## Transist

{{#example source="examples-fx/Transist.ts"}}
<style>
  .tynyFxTransist {
    position: relative;
    height: 100px;
    background: #ccc;
  }

  .tynyFxTransist > .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    background: #f00;
    border-radius: 10px;
  }
</style>

<div class="tynyFxTransist">
  <div class="circle"></div>
</div>
{{/example}}
