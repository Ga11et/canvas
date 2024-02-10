<template>
  <canvas
    class="canvas-draw"
    ref="canvas"
    width="1000"
    height="300"
    @mousemove="mouseDownHandler"
    @mousedown="drowingData.draw = true"
    @mouseup="drowingData.draw = false"
  />
</template>

<script setup>
const canvas = ref(null);

const drowingData = reactive({
  ctx: null,
  x: 0,
  y: 0,
  draw: false,
});

onMounted(() => {
  drowingData.ctx = canvas.value.getContext("2d");
});

const mouseDownHandler = (e) => {
  if (drowingData.draw) {
    drawLine(drowingData.x, drowingData.y, e.offsetX, e.offsetY);
  }
  drowingData.x = e.offsetX;
  drowingData.y = e.offsetY;
};
const drawLine = (x1, y1, x2, y2) => {
  const ctx = drowingData.ctx;
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
};
</script>

<style lang="scss" scoped>
.canvas-draw {
  border: 1px solid grey;
}
</style>
