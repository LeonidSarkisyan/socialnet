<template>
  <div class="image">
    <img
        src="@/assets/images/ui/arrow-slide.png"
        class="left" @click="moveSlider(-1)"
        v-if="!isFirst"
    >
    <img ref="image" :src="image.blobUrl" class="image">
    <img src="@/assets/images/ui/arrow-slide.png" class="arrow" @click="moveSlider(1)" v-if="!isLast">
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ImageItem",
  props: {
    image: {},
    countPost: {
      type: Number,
      required: false
    },
    isFirst: {
      type: Boolean,
      required: true
    },
    isLast: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    moveSlider(value) {
      this.$emit('moveSlider', value)
    }
  }
}
</script>

<style scoped>
.arrow {
  cursor: pointer;
  width: 35px;
  position: absolute;
  top: 42.5%;
  right: 7px;
  display: block;
}

.left {
  cursor: pointer;
  width: 35px;
  transform: rotate(180deg);
  position: absolute;
  top: 42.5%;
  left: 5px;
  display: block;
  z-index: 100;
}

.image {
  width: 550px;
  margin-bottom: 10px;
  position: relative;
}
</style>