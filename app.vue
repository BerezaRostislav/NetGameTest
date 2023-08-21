<template>
  <div class="wrapper" @mouseup="endDragging()">
    <div
      :style="{
        width: `${dividerPosition}%`
      }"
    >
      <Sidebar />
    </div>
    <div
      class="divider"
      :style="{
        left: `${dividerPosition}%`
      }"
      @mousedown="startDragging()"
    >
    </div>
    <div
      class="center"
      :style="{
        width: `${100 - dividerPosition}%`
      }"
    >
      <div class="div2"></div>
      <div class="div3"></div>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'

const dividerPosition = ref(25)

function handleDragging (e) {
  const percentage = (e.pageX / window.innerWidth) * 100

  if (percentage >= 10 && percentage <= 50) {
    dividerPosition.value = percentage.toFixed(2)
  }
}

function startDragging () {
  document.addEventListener('mousemove', handleDragging)
}

function endDragging () {
  document.removeEventListener('mousemove', handleDragging)
}

</script>

<style>

.wrapper {
  height: 100vh;
  display: flex;

  .divider {
    height: 100vh;
    width: 2px;
    background: lightgray;
    transform: translateX(-3px);
    position: absolute;
    top: 0;
    z-index: 1;
    cursor: ew-resize;
  }
}

</style>