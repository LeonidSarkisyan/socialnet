<template>
  <div class="likes" key="keyLike">
    <img :src="likeUrlUnFull" class="like-img" @click="putLike" v-if="!isLikes">
    <img :src="likeUrlFull" class="like-img" @click="putLike" v-if="isLikes">
    <div class="likes-text">{{ likes.length }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Likes",
  props: {
    post: {

    },
    connection : {

    }
  },
  data() {
    return {
      likeUrlFull: null,
      likeUrlUnFull: null,
      isLikes: false,
      likes: [],
      ourLike: null
    }
  },
  methods: {
    getLikeUnFullPhoto() {
      fetch('http://127.0.0.1:8000/likes/unfull').then(response => {
        response.blob().then(blob => {
          this.likeUrlUnFull = window.URL.createObjectURL(blob)
        })
      })
    },
    getLikeFullPhoto() {
      fetch('http://127.0.0.1:8000/likes/full').then(response => {
        response.blob().then(blob => {
          this.likeUrlFull = window.URL.createObjectURL(blob)
        })
      })
    },
    getCountLike() {
      axios.get(`http://127.0.0.1:8000/likes/${this.post.id}/count/`).then(response => {
        this.likes = response.data
        this.checkPutLike()
      })
    },
    putLike() {
      if (this.isLikes) {
        this.checkPutLike()
        axios.delete(`http://127.0.0.1:8000/likes/${this.ourLike.id}`).then(response => {
          console.log(response.data)
          this.getCountLike()
          this.isLikes = false
        })
      } else {
        let LikeWS = {
          post_id: this.post.id,
          user_id: JSON.parse(localStorage.getItem('user_profile')).id,
          type: 'like'
        }

        this.connection.send(JSON.stringify(LikeWS))
        this.getCountLike()
      }
    },
    checkPutLike() {
      for (let like of this.likes) {
        if (like.user_id == JSON.parse(localStorage.getItem('user_profile')).id) {
          this.ourLike = like
          this.isLikes = true
        }
      }
    }
  },
  mounted() {
    this.getLikeFullPhoto()
    this.getLikeUnFullPhoto()
    this.getCountLike()
  }
}
</script>

<style scoped>

</style>