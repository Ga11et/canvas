<template>
  <div
    class="vfx-gradient"
    ref="container"
    style="width: 100%; height: 100%; overflow: hidden; background-color: black; position: relative"
    @mousemove="onMouseMove"
  >
    <canvas ref="canvas" style="position: absolute; width: 100%; height: 100%; z-index: 0" />
    <div
      style="position: absolute; z-index: 2"
      :style="`left: ${x + imgXOffset}px; top: ${y + imgYOffset}px; background: green; width: 40px; height: 40px;`"
    />
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import GradientFilter from "~/assets/gradient-filter";

const props = {
  /** Задержка на изменение мыши */
  mouseDelay: { type: Number, default: 10 },

  /** x-смещенение левого улгла картинки относительно курсора */
  imgXOffset: { type: Number, default: 0 },

  /** y-смещенение левого улгла картинки относительно курсора */
  imgYOffset: { type: Number, default: 0 },

  // флаг отключения анимации по мыши и включения автоматической
  disableMouse: { type: Boolean, default: false },
};

const data = () => ({
  pixiApp: null,
  gradientFilter: null,
  noiseFilter: null,
  x: 0,
  y: 0,
  gX: 0,
  gY: 0,

  interval: 0,
  yStep: 3,
  xStep: 3,
});

const methods = {
  update(updateSprite) {
    const container = this.$refs.container;
    const w = Math.round(container.clientWidth);
    const h = Math.round(container.clientHeight);
    if (!this.pixiApp) {
      this.pixiApp = new PIXI.Application({
        view: this.$refs.canvas,
        width: w,
        height: h,
        resizeTo: container,
        antialias: true,
        autoResize: true,
      });
    }
    const { stage } = this.pixiApp;
    let sprite = stage.children.length ? stage.children[0] : this.createVfxSprite(w, h, this.colors);
    if (!stage.children.length) {
      stage.addChild(sprite);
    }
    if (sprite.width !== w || sprite.height !== h || updateSprite) {
      stage.removeChild(sprite);
      sprite = this.createVfxSprite(w, h, this.colors);
      stage.addChild(sprite);
    }
  },

  /** Создаёт спрайт с эффектами */
  createVfxSprite(w, h) {
    const sprite = new PIXI.Sprite();
    sprite.width = w;
    sprite.height = h;
    this.gradientFilter = new GradientFilter(w, h, {});
    this.noiseFilter = new PIXI.filters.NoiseFilter(this.noise, this.noiseSeed);
    // sprite.filters = [this.gradientFilter, this.noiseFilter];
    sprite.filters = [this.gradientFilter];
    sprite.filterArea = this.pixiApp.screen;
    sprite.pivot.x = w / 2;
    sprite.pivot.y = h / 2;
    sprite.position = new PIXI.Point(w / 2, h / 2);
    return sprite;
  },

  /** Обработчик шага анимации */
  onAnimationFrame() {
    const container = this.$refs.container;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const x = this.x / w;
    const y = this.y / h;
    if (Math.abs(this.gX - x) > 0.001) {
      this.gX += (x - this.gX) / this.mouseDelay;
    } else {
      this.gX = x;
    }
    if (Math.abs(this.gY - y) > 0.001) {
      this.gY += (y - this.gY) / this.mouseDelay;
    } else {
      this.gY = y;
    }
    this.gradientFilter.mouse = new PIXI.Point(this.gX, this.gY);
  },

  onMouseMove(event) {
    const container = this.$refs.container;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const e = event.changedTouches ? event.changedTouches[0] : event;
    const x = e.clientX;
    const y = e.clientY;
    this.x = x;
    this.y = y;
    if (this.gradientFilter) {
      this.gradientFilter.mouse = new PIXI.Point(x / w, y / h);
    }
  },

  intervalAnimation() {
    if (!this.disableMouse) return;
    const container = this.$refs.container;
    const w = container.clientWidth;
    const h = container.clientHeight;

    if ((this.x > w) | (this.x < 0)) this.xStep = this.xStep * -1;
    if ((this.y > h) | (this.y < 0)) this.yStep = this.yStep * -1;

    this.y += this.yStep;
    this.x += this.xStep;
  },
};

const watch = {};

export default {
  props,
  data,
  watch,
  mounted() {
    this.update();
    window.addEventListener("resize", this.update);
    this.pixiApp.ticker.add(this.onAnimationFrame);

    this.interval = setInterval(() => {
      this.intervalAnimation();
    }, 20);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.update);
    this.pixiApp.ticker.remove(this.onAnimationFrame);

    clearInterval(this.interval);
  },
  methods,
};
</script>
<style lang="scss" scoped>
.vfx-gradient {
  pointer-events: none;
  @media screen and (min-width: 1024px) {
    pointer-events: unset;
  }
}
</style>
