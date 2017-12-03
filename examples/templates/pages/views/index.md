# Views

## Image

{{#example source="examples-views/Image.ts"}}
<style>
  .tynyImage {
    visibility: hidden;
  }

  .tynyImage.loaded {
    visibility: inherit;
  }

  .tynyImageResizer {
    height: auto;
    padding-bottom: 0;
  }

  .tynyImageResizer img {
    width: 100%;
    height: auto;
  }
</style>

<div class="tynyResizer tynyImageResizer">
  <div class="tynyResizer--handle handleRight"></div>
  <img 
    class="tynyImage" 
    width="1024" 
    height="1024"
    data-srcset="
      {{basePath}}assets/images/dummy-square-256x256.jpg 256w,
      {{basePath}}assets/images/dummy-square-512x512.jpg 512w,
      {{basePath}}assets/images/dummy-square-1024x1024.jpg 1024w" 
    />
</div>
{{/example}}


## ImageCrop

{{#example source="examples-views/ImageCrop.ts"}}
<style>
  .tynyImageCrop {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  
  .tynyImageCrop > img {
    position: absolute;
  }
</style>

<div class="tynyResizer">
  <div class="tynyResizer--handle handleRight"></div>
  <div class="tynyResizer--handle handleBottom"></div>
  <div class="tynyImageCrop">
    <img 
      class="tynyImage" 
      width="1024" 
      height="1024"
      data-srcset="
        {{basePath}}assets/images/dummy-square-256x256.jpg 256w,
        {{basePath}}assets/images/dummy-square-512x512.jpg 512w,
        {{basePath}}assets/images/dummy-square-1024x1024.jpg 1024w" 
      />
  </div>
</div>
{{/example}}


## ImageRatios

{{#example source="examples-views/ImageRatios.ts"}}
<style>
  .tynyImageRatios {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  
  .tynyImageRatios > .tynyImageCrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

<div class="tynyResizer">
  <div class="tynyResizer--handle handleRight"></div>
  <div class="tynyResizer--handle handleBottom"></div>
  <div class="tynyImageRatios"
    data-ratioset="
      width=2048;
      height=1024;
      sourceSet=
        {{basePath}}assets/images/dummy-landscape-512x256.jpg 512w,
        {{basePath}}assets/images/dummy-landscape-1024x512.jpg 1024w,
        {{basePath}}assets/images/dummy-landscape-2048x1024.jpg 2048w
      |
      width=1024;
      height=2048;
      sourceSet=
        {{basePath}}assets/images/dummy-portrait-256x512.jpg 256w,
        {{basePath}}assets/images/dummy-portrait-512x1024.jpg 512w,
        {{basePath}}assets/images/dummy-portrait-1024x2048.jpg 1024w
      |
      width=1024;
      height=1024;
      sourceSet=
        {{basePath}}assets/images/dummy-square-256x256.jpg 256w,
        {{basePath}}assets/images/dummy-square-512x512.jpg 512w,
        {{basePath}}assets/images/dummy-square-1024x1024.jpg 1024w" 
    ></div>
</div>
{{/example}}
