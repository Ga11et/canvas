<template>
  <div ref="block" class="base-observer-block">
    <slot v-if="intersecting"></slot>
    <div v-else class="base-skeleton-block"></div>
  </div>
</template>

<script setup>
const block = ref(null);
const intersecting = ref(false);
const observer = ref(null);

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          intersecting.value = true;
        } else {
          intersecting.value = false;
        }
      });
    },
    { root: null, rootMargin: "0px", threshold: 0.05 }
  );

  if (block.value) {
    observer.value.observe(block.value);
  }
});
onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.unobserve(block.value);
  }
});
</script>

<style lang="scss" scoped>
.base-skeleton-block {
  width: 100vw;
  height: 100dvh;
}
</style>
