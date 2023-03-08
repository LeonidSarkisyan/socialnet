<template>
  <div class="div">
    <img :src="url" class="comments-img" @click="openCommentInput">
    <div class="likes-text">{{ comments.length }}</div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CommentsInfo",
  props: {
    post: {
      type: Object,
      required: true
    },
    comments: {}
  },
  data() {
    return {
      url: null,
    }
  },
  methods: {
    getImage() {
      fetch('http://127.0.0.1:8000/comments/image').then(response => {
        response.blob().then(blob => {
          this.url = window.URL.createObjectURL(blob)
        })
      })
    },
    openCommentInput() {
      this.$emit('openCommentInput')
    }
  },
  mounted() {
    this.getImage()
  }
}
</script>

<style scoped>
  .div {
    display: flex;
    align-items: center;
  }
</style>