<template>
 <div class="list-images">
   <div class="slider">
     <div class="slider__inner" :style="{'margin-left': move * index + 'px'}">
       <ImageItem
           @moveSlider="moveSlider"
           v-if="images.length > 0"
           v-for="image in images"
           :image="image"
           :key="image.id"
           :countPost="images.length"
           :isLast="isLast"
           :isFirst="isFirst"
       />
     </div>
   </div>
 </div>
</template>

<script>
import ImageItem from "@/components/ImageItem";
import axios from "axios";
export default {
  name: "ImageList",
  components: {
    ImageItem
  },
  props: {
    post_id: {
      type: Number,
      required: true
    },
    images: {}
  },
  data() {
    return {
      move: 550,
      index: 0
    }
  },
  methods: {
    moveSlider(value) {
      console.log('value:', value)
      this.$emit('noCloseModel')
      this.index -= value
      console.log(this.index)
    }
  },
  computed: {
    isFirst() {
      return this.index === 0
    },
    isLast() {
      return this.index === -(this.images.length - 1)
    }
  }
}
</script>

<style scoped>
.list-images {
  display: flex;
  flex-direction: row;
}

.slider {
  width: 550px;
  overflow-x: hidden;
}

.slider__inner {
  transition: 0.3s;
  display: flex;
  align-items: center;
}
</style>