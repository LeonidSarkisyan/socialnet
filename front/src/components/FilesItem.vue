<template>
  <div class="file">
    <div class="image-div">
      <img ref="image" class="image">
      <div class="delete" @click="deleteFile">&#10006;</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilesItem",
  props: {
    file: {}
  },
  methods: {
    deleteFile () {
      this.$emit('deleteFile', this.file)
    }
  },
  mounted() {
    let reader = new FileReader()
    reader.onloadend = () => {
      this.$refs.image.src = reader.result
    }
    reader.readAsDataURL(this.file)
  }
}
</script>

<style scoped>
.image-div {
  position: relative;
  margin-right: 15px;
  margin-bottom: 10px;
}
.image {
  height: 120px;
  position: relative;
  display: block;
}

.delete {
  cursor: pointer;
  padding: 0 5px 2px;
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.48);
}

.delete:hover {

}
</style>