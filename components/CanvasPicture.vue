<template>
  <canvas class="canvas-picture" ref="canvas" />
</template>

<script setup>
import { image } from "~/static/images/image.json";

const canvas = ref(null);

const canvasState = reactive({
  ctx: null,
  picture: null,
});

const drawImage = (image64) => {
  const imageElement = document.createElement("img");
  imageElement.setAttribute("src", image64);

  const ctx = canvasState.ctx;
  canvasState.picture = new pictureUtils.Picture(window, imageElement, 30);
  canvasState.picture.init(ctx);
  animateImage();
};
const animateImage = () => {
  const ctx = canvasState.ctx;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  canvasState.picture.draw(ctx);
  canvasState.picture.update();
  requestAnimationFrame(animateImage);
};

onMounted(() => {
  canvasState.ctx = canvas.value.getContext("2d");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  drawImage(image);
});
</script>

<style lang="scss" scoped>
.canvas-picture {
  border: 1px solid grey;
}
</style>
