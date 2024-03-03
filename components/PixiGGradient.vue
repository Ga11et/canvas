<template>
  <div class="vfx-gradient" ref="container" @mousemove="onMouseMove">
    <canvas ref="canvas" style="position: absolute; width: 100%; height: 100%; z-index: 0" />

    <div class="vfx-gradient__mouse-rect" :style="`--left: ${mx}px; --top: ${my}px`" />
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import GradientFilter from "~/assets/gradient-filter";

const props = {};

const data = () => ({
  pixiApp: null,
  gradientFilter: null,

  mx: 0,
  my: 0,
  mdelay: 20,

  interval: 0,
  yStep: 3,
  xStep: 3,
});

const methods = {
  /** Создаёт спрайт с эффектами */
  createVfxSprite() {
    const sprite = new PIXI.Sprite();

    const { width, height } = this.pixiApp.screen;
    sprite.width = width;
    sprite.height = height;
    sprite.position = new PIXI.Point(width / 2, height / 2);

    this.gradientFilter = new GradientFilter(width, height, {});
    sprite.filters = [this.gradientFilter];
    sprite.filterArea = this.pixiApp.screen;

    return sprite;
  },

  /** Создаёт экземпляр pixi */
  createPixi() {
    const container = this.$refs.container;
    if (!container) return;

    this.pixiApp = new PIXI.Application({
      view: this.$refs.canvas,
      resizeTo: container,
    });

    const sprite = this.createVfxSprite();
    this.pixiApp.stage.addChild(sprite);
  },

  /** Обработчик шага анимации */
  onAnimationFrame() {
    const { width, height } = this.pixiApp.screen;

    const x = this.mx / width;
    const y = this.my / height;

    let gx = x;
    let gy = y;

    if (Math.abs(gx - x) > 0.001) {
      gx += (x - gx) / this.mDelay;
    }
    if (Math.abs(gy - y) > 0.001) {
      gy += (y - gy) / this.mDelay;
    }

    this.gradientFilter.mouse = new PIXI.Point(gx, gy);
  },

  /** Обработчик движения мыши */
  onMouseMove(event) {
    if (event.changedTouches?.length) return;
    this.mx = event.clientX;
    this.my = event.clientY;
  },

  // Анимация при бездействии
  intervalAnimation() {
    const { width, height } = this.pixiApp.screen;

    if ((this.mx > width) | (this.mx < 0)) this.xStep = this.xStep * -1;
    if ((this.my > height) | (this.my < 0)) this.yStep = this.yStep * -1;

    this.my += this.yStep;
    this.mx += this.xStep;
  },
};

const watch = {};

export default {
  props,
  data,
  watch,
  mounted() {
    this.createPixi();
    window.addEventListener("resize", this.createPixi);

    this.pixiApp.ticker.add(this.onAnimationFrame);

    this.interval = setInterval(() => {
      this.intervalAnimation();
    }, 20);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.createPixi);

    this.pixiApp.ticker.remove(this.onAnimationFrame);

    clearInterval(this.interval);
  },
  methods,
};
</script>
<style lang="scss" scoped>
.vfx-gradient {
  pointer-events: none;

  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  @media screen and (min-width: 1024px) {
    pointer-events: unset;
  }

  &__mouse-rect {
    position: absolute;
    z-index: 1;

    background: green;
    width: 40px;
    height: 40px;

    left: var(--left);
    top: var(--top);
  }
}
</style>
