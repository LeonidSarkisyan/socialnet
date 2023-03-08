<template>
  <div class="comment-input">
    <img :src="url" class="post-info-avatar r m" @click="goToProfile">
    <input type="text" placeholder="Напишите комментарий" ref="input" class="input" v-model="text" @keyup.enter="writeComment">
    <img src="@/assets/images/send.png" class="send degree" @click="writeComment">
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CommentsInput",
  props: {
    post: {}
  },
  data() {
    return {
      url: null,
      text: ''
    }
  },
  methods: {
    fetchAvatar() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      fetch(`http://127.0.0.1:8000/profile/avatar/v2/${id}`).then(response => {
        response.blob().then(blob => {
          this.url = window.URL.createObjectURL(blob)
        })
      })
    },
    writeComment() {
      if (this.text.length > 0) {
        let body = {
          user_id: JSON.parse(localStorage.getItem('user_profile')).id,
          post_id: this.post.id,
          text: this.text
        }
        this.$emit('createComment', body)
        this.$emit('falseLimited')
        this.text = ''
      } else {
        alert('Пустой комментарий!')
      }
    },
    goToProfile() {
      window.scrollTo(0, 0)
      this.$router.push(
          {
            name: 'profile',
            params: {
              tagName: JSON.parse(localStorage.getItem('user_profile')).tag_name
            }
          }
      )
    }
  },
  mounted() {
    this.fetchAvatar()
  }
}
</script>

<style scoped>
  .send {
    height: 40px;
    cursor: pointer;
    transition: 0.15s;
  }

  .send:hover {
    transform: scale(0.75);
  }

  .m {
    margin-left: 5px;
  }

  .input {
    border-radius: 0;
    width: 500px;
    padding: 10px;
    display: block;
    font-weight: 700;
    color: white;
  }

  .comment-input {
    display: flex;
    padding: 10px;
    align-items: center;
    background: #4B4B4B;
    width: 580px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top: 1px #252525 solid;
  }
</style>