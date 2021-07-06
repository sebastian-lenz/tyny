import { __decorate } from "tslib";
import { Crop } from '../ImageCrop/Crop';
import { data } from '../../utils/dom/attr';
import { once } from '../../utils/dom/event';
import { property, update, View } from '../../core';
import { Source } from './Source';
import { SourceSetMode } from '../Image/SourceSet';
import { tween } from '../../fx/tween';
import { visibility } from '../../services/visibility';
function renderImage(ctx, { image, source }, maskWidth, maskHeight) {
    const crop = source.getCrop(maskWidth, maskHeight);
    ctx.drawImage(image, crop.left, crop.top, crop.width, crop.height);
}
export class Picture extends View {
    constructor(options = {}) {
        super(options);
        this.currentImage = null;
        this.displayHeight = 0;
        this.displayWidth = 0;
        this.images = {};
        this.isVisible = false;
        this.loadMode = 2 /* Visibility */;
        this.nextImage = null;
        this.progress = 0;
        const crop = Crop.create(this, options).toOptions();
        this.sources = this.findAll('source').map((source) => new Source(Object.assign(Object.assign({}, crop), { height: parseInt(data(source, 'height') || '0'), sourceSet: data(source, 'srcset') || '', width: parseInt(data(source, 'width') || '0') })));
    }
    load() {
        this.loadMode = 0 /* Always */;
        const result = this.updateImage();
        if (!result) {
            return Promise.resolve();
        }
        return result.then(() => {
            const { currentImage } = this;
            if (!currentImage || currentImage.isLoaded) {
                return;
            }
            return new Promise((resolve) => once(currentImage.image, 'load', resolve));
        });
    }
    setLoadMode(value) {
        if (this.loadMode === value)
            return;
        this.loadMode = value;
        if (value === 2 /* Visibility */) {
            this.updateImage();
        }
    }
    setVisible(value) {
        if (this.isVisible === value)
            return;
        this.isVisible = value;
        if (value && !this.displayWidth) {
            this.triggerUpdate('resize');
        }
        else {
            this.updateImage();
        }
    }
    allowLoad() {
        if (this.loadMode === 2 /* Visibility */) {
            return this.isVisible;
        }
        return this.loadMode === 0 /* Always */;
    }
    findSource(width = this.displayWidth, height = this.displayHeight) {
        const { sources } = this;
        const aspect = height / width;
        let bestSource = null;
        let bestScore = Number.MAX_VALUE;
        for (let index = 0; index < sources.length; index++) {
            const source = sources[index];
            const sourceAspect = source.height / source.width;
            const aspectDif = Math.abs(aspect - sourceAspect);
            const crop = source.getCrop(width, height);
            const src = source.sourceSet.getSourceSync(crop.width);
            const scale = src && src.mode === SourceSetMode.Width ? crop.width / src.bias : 1;
            const score = aspectDif + Math.pow(1 - Math.max(1, scale), 2);
            if (score < bestScore) {
                bestSource = source;
                bestScore = score;
            }
        }
        return bestSource;
    }
    getImage(source, url) {
        const { images } = this;
        if (!(url in images)) {
            const image = document.createElement('img');
            const item = (images[url] = {
                image,
                isLoaded: false,
                source,
                url,
            });
            image.src = url;
            item.isLoaded = !!image.complete;
            image.addEventListener('load', () => {
                item.isLoaded = true;
                this.tryTransist();
            });
        }
        return images[url];
    }
    onConnected() {
        super.onConnected();
        visibility.observe(this);
    }
    onDisconnected() {
        super.onDisconnected();
        visibility.unobserve(this);
    }
    onMeasure() {
        const { displayHeight, displayWidth, el } = this;
        const ratio = window.devicePixelRatio ? window.devicePixelRatio : 1;
        const height = el.clientHeight * ratio;
        const width = el.clientWidth * ratio;
        if (height !== displayHeight || width !== displayWidth) {
            this.displayHeight = height;
            this.displayWidth = width;
            this.updateImage();
            return this.onSizeChanged;
        }
    }
    onSizeChanged() {
        const { canvas, displayHeight, displayWidth } = this;
        if (canvas) {
            canvas.height = displayHeight;
            canvas.width = displayWidth;
        }
        this.render();
    }
    onTransitionEnd() {
        this.currentImage = this.nextImage;
        this.nextImage = null;
        this.progress = 0;
        this.updateImage();
        this.render();
    }
    render() {
        const { canvas, currentImage, nextImage, progress } = this;
        const ctx = canvas ? canvas.getContext('2d') : null;
        if (!ctx) {
            return;
        }
        const height = this.displayHeight;
        const width = this.displayWidth;
        ctx.clearRect(0, 0, width, height);
        if (currentImage) {
            ctx.globalAlpha = 1;
            renderImage(ctx, currentImage, width, height);
        }
        if (nextImage && progress) {
            ctx.globalAlpha = progress;
            renderImage(ctx, nextImage, width, height);
        }
    }
    setProgress(value) {
        this.progress = value;
        this.render();
    }
    tryTransist() {
        const { nextImage, progress } = this;
        if (!nextImage || !nextImage.isLoaded || progress) {
            return;
        }
        tween(this, { progress: 1 }, { duration: 100 }).then(() => {
            this.onTransitionEnd();
        });
    }
    updateImage() {
        if (!this.allowLoad()) {
            return null;
        }
        const { currentImage, nextImage, progress } = this;
        const source = this.findSource();
        if (!source || (nextImage && progress)) {
            return null;
        }
        return source.sourceSet.get(this.displayWidth).then((url) => {
            const image = this.getImage(source, url);
            if ((currentImage === image && !nextImage) || nextImage === image) {
                return;
            }
            this.nextImage = image;
            this.tryTransist();
        });
    }
}
__decorate([
    property({
        immutable: true,
        param: { defaultValue: 'canvas', tagName: 'canvas', type: 'element' },
    })
], Picture.prototype, "canvas", void 0);
__decorate([
    update({ events: 'resize', mode: 'read' })
], Picture.prototype, "onMeasure", null);
