<template>
  <canvas class="canvas-gradient" ref="canvas" width="1000" height="500" @mousemove="mouseMoveHandler" />
</template>

<script setup>
const canvas = ref(null);

const drowingData = reactive({
  ctx: null,
});

onMounted(() => {
  drowingData.ctx = canvas.value.getContext("2d");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
});

const mouseMoveHandler = (e) => {
  rerenderGradient(e.offsetX, e.offsetY);
};
const rerenderGradient = (x, y) => {
  const ctx = drowingData.ctx;
  const width = window.innerWidth * 1.2;

  ctx.fillStyle = `rgb(256,256,256)`;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  drawCircle(x, y, width);
};
const drawCircle = (x, y, r) => {
  const ctx = drowingData.ctx;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, "rgb(188,156,255)");
  gradient.addColorStop(0.03, "rgb(144,131,227)");
  gradient.addColorStop(0.08, "rgb(132,124,219)");
  gradient.addColorStop(0.18, "rgb(110,112,205)");
  gradient.addColorStop(0.48, "rgb(51,78,168)");
  ctx.fillStyle = gradient;

  ctx.fill();
};
</script>

<style lang="scss" scoped>
.canvas-gradient {
  border: 1px solid grey;
}
</style>
