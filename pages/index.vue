<template>
  <div>
    <BaseObserverBlock>
      <CanvasDraw />
    </BaseObserverBlock>
    <BaseObserverBlock>
      <CanvasGradient />
    </BaseObserverBlock>
    <BaseObserverBlock>
      <CanvasPicture />
    </BaseObserverBlock>
    <client-only>
      <BaseObserverBlock>
        <PixiBasic />
      </BaseObserverBlock>
    </client-only>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
