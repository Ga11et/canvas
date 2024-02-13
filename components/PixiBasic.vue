<template>
  <Application :width="width" :height="height" @mousemove="mouseMoveHandler">
    <particle-container ref="containerRef" @render="updateStars" />
  </Application>
</template>

<script setup>
import { Sprite, Texture } from "pixi.js";
import { onTick, Application } from "vue3-pixi";

const width = window.innerWidth;
const height = window.innerHeight;
const speed = 1;

const fov = 20;
const starSize = 0.005;

const amount = ref(4000);
const containerRef = ref();

let camera = 0;
let stars = [];

const mouseData = reactive({
  x: 0,
  y: 0,
  fixedStars: [],
});

const mouseMoveHandler = (e) => {
  mouseData.x = e.offsetX;
  mouseData.y = e.offsetY;
};

function updateStars() {
  stars.forEach((star) => star.destroy());

  if (!containerRef.value) return;

  stars = new Array(+amount.value).fill(null).map(() => {
    const star = new Sprite(Texture.from("/png/star.png"));
    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 1;

    star.initX = Math.cos(deg) * distance;
    star.initY = Math.sin(deg) * distance;
    star.initZ = Math.random() * 1e3 - 1e3;

    star.x = star.initX;
    star.y = star.initY;
    star.z = star.initZ;

    updateStar(star);

    return star;
  });

  console.log(stars.length);

  containerRef.value.addChild(...stars);
}

function updateStar(star) {
  const z = star.z - camera;
  const distance = Math.max(0, (2e3 - z) / 2e3);

  star.scale.set(distance * starSize);
  star.anchor.set(0.5, 0.7);

  star.x = star.initX * (fov / z) * width + width / 2;
  star.y = star.initY * (fov / z) * width + height / 2;
}

const correctStarByMouse = (star, ind) => {
  const distance = Math.sqrt(Math.pow(star.x - mouseData.x, 2) + Math.pow(star.y - mouseData.y, 2));
  const isNearly = distance <= 80;
  if (isNearly) {
    star.x += sign(star.x - mouseData.x) * ((80 - distance) / 8);
    star.y += sign(star.y - mouseData.y) * ((80 - distance) / 8);
  } else {
    const notCorrectPosition = Math.sqrt(
      Math.pow(star.x - mouseData.fixedStars[ind].x, 2) + Math.pow(star.y - mouseData.fixedStars[ind].y, 2)
    );
    star.x += sign(mouseData.fixedStars[ind].x - star.x) * (notCorrectPosition / 8);
    star.y += sign(mouseData.fixedStars[ind].y - star.y) * (notCorrectPosition / 8);
  }
};
const sign = (x) => (x >> 31) | 1;

onTick((delta) => {
  if (camera >= 1900) {
    if (!mouseData.fixedStars.length) {
      mouseData.fixedStars = stars.map((star) => ({ x: star.x, y: star.y }));
    }
    stars.forEach(correctStarByMouse);
  } else {
    const multy = (2100 - camera) / 200;

    camera += delta * multy * speed;
    stars.forEach(updateStar);
  }
});

onUnmounted(() => stars.forEach((star) => star.destroy()));
</script>

<style lang="scss" scoped></style>
