<template>
  <div class="post_wrapper" v-show="loaded">
      <div class="post" ref="post">
        <div class="post-info">
          <img :src="avatar" class="post-info-avatar" @click="goToProfile">
          <div class="post-info-text">
            <div class="name-group" @click="goToProfile">{{ user.name }} {{ user.surname}}</div>
            <div class="date-post">
              {{ Number(dateTimePost.date.day) }} {{ dateTimePost.date.month }} в {{ Number(dateTimePost.time.hours) }}:{{ dateTimePost.time.minutes }}
            </div>
            </div>
          </div>
          <div class="post-text">
            {{ post.text }}
          </div>
          <ImageList :post_id="post.id" :images="images"/>
          <div class="post-likes">
            <Likes :post="post" :connection="connection"/>
            <CommentsInfo :post="post" :comments="comments" @openCommentInput="openCommentInput"/>
          </div>
      </div>
    <CommentsList
        :post="post"
        :comments="comments"
        :limit="limit"
        :limited="limited"
        @falseLimited="limited = false; limit = comments.length + 1"
        @limitplus="limitPlus"
    />
    <CommentsInput
        :post="post"
        v-if="openedCommentInput"
        :style="{'margin-bottom': margin + 'px'}"
        @createComment="createComment"
        @falseLimited="limited = false; limit = comments.length + 1"
    />
  </div>
</template>

<script>
import axios from "axios";
import ImageList from "@/components/ImageList";
import Likes from "@/components/Likes";
import CommentsList from "@/components/CommentsList";
import CommentsInfo from "@/components/CommentsInfo";
import CommentsInput from "@/components/CommentsInput";
export default {
  name: "NewsListItem",
  components: {
    ImageList, Likes, CommentsList, CommentsInfo, CommentsInput
  },
  props: {
    post: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      loaded: false,
      comments: [],
      connection: null,
      openedCommentInput: false,
      margin: 0,
      user: {},
      avatar: null,
      images: [],
      likeUrl: null,
      interval: null,
      limited: false,
      limit: 0,
      dateTimePost: {
        date: {
          year: null,
          month: null,
          day: null
        },
        time: {
          hours: null,
          minutes: null,
          seconds: null
        },
      },
      months: [
        {num: 1, name: 'янв'},
        {num: 2, name: 'фев'},
        {num: 3, name: 'мар'},
        {num: 4, name: 'апр'},
        {num: 5, name: 'май'},
        {num: 6, name: 'июн'},
        {num: 7, name: 'июл'},
        {num: 8, name: 'авг'},
        {num: 9, name: 'сен'},
        {num: 10, name: 'окт'},
        {num: 11, name: 'ноя'},
        {num: 12, name: 'дек'},
      ],
    }
  },
  methods: {
    getMonth(integer) {
      let month = this.months.find((value => {
        return value.num === integer
      }))
      return month.name
    },
    limitPlus() {
      this.limit += 5
      if (this.limit >= this.comments.length) {
        this.limited = false
      }
    },
    async fetchUser() {
      const response = await axios.get(`http://127.0.0.1:8000/posts/${this.post.id}/profile`).then(response => {
        this.user = response.data
        this.fetchUserAvatar(this.user.tag_name)
      })
    },
    fetchUserAvatar(tagName) {
      fetch(`http://127.0.0.1:8000/profile/avatar/${tagName}`).then(response => {
        response.blob().then(blob => {
          this.avatar = window.URL.createObjectURL(blob)
        })
      })
    },
    async fetchImages() {
      axios.get(`http://127.0.0.1:8000/posts/${this.post.id}/images`).then(response => {
        this.images = response.data
        for (let img in this.images) {
          fetch(`http://127.0.0.1:8000/posts/images/${this.images[img].id}`).then(response => {
            response.blob().then(blob => {
              let url = window.URL.createObjectURL(blob)
              this.images[img] = Object.assign({blobUrl: url}, this.images[img])
            })
            this.loaded = true
          })
        }
      })
    },
    goToProfile() {
      window.scrollTo(0,0);
      this.$router.push(
          {
            name: 'profile',
            params: {
              tagName: this.user.tag_name
            }
          }
      )
    },
    getLikePhoto() {
      fetch('http://127.0.0.1:8000/likes/unfull').then(response => {
        response.blob().then(blob => {
          this.likeUrl = window.URL.createObjectURL(blob)
        })
      })
    },
    putLike() {
      let newLike = {
        post_id: this.post.id,
        user_id: JSON.parse(localStorage.getItem('user_profile')).id
      }
      axios.post('http://127.0.0.1:8000/likes/', newLike).then(response => {
        console.log(response)
      })
    },
    openCommentInput() {
      this.$refs.post.style.borderBottomLeftRadius = 0
      this.$refs.post.style.borderBottomRightRadius = 0
      this.$refs.post.style.marginBottom = 0
      this.margin = 35
      this.openedCommentInput = true
    },
    validate() {
      if (this.post.comments.length > 0) {
        this.$refs.post.style.marginBottom = 0
        this.$refs.post.style.borderBottomLeftRadius = 0
        this.$refs.post.style.borderBottomRightRadius = 0
        this.openedCommentInput = true
        this.margin = 35
      }
    },
    fetchComments() {
      axios.get(`http://127.0.0.1:8000/comments/${this.post.id}`).then(response => {
        this.comments = response.data
        if (response.data.length > 3) {
          this.limited = true
          this.limit = 3
        }
      })
    },
    createComment(body) {
      this.connection.send(JSON.stringify(body))
    },
    createWebSocket() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      this.connection = new WebSocket(`ws://127.0.0.1:8000/comments/ws/${id}`)
      this.connection.onopen = event => {

      }

      this.connection.onmessage = event => {
        if (event.data === '__pong__') {
          //console.log('WebSocket update')
        } else {
          console.log('Что-то пришло с WebSocket:', JSON.parse(event.data))
          let data = JSON.parse(event.data)
          if (data.post_id === this.post.id) {
            if (this.comments.length > 0) {
              this.comments.push(data)
              if (this.limited) {

              } else {
                this.limited = false
                this.limit = 0
              }
            } else {
              this.$refs.post.style.marginBottom = 0
              this.$refs.post.style.borderBottomLeftRadius = 0
              this.$refs.post.style.borderBottomRightRadius = 0
              this.openedCommentInput = true
              this.margin = 35
              this.comments.push(data)
            }
          }
        }
      }

      this.connection.onclose = event => {
        if (event.wasClean) {
          console.log('Закрыто чисто!')
        } else {
          console.log('Соединение прервано!')
        }
      }
    },
    updateWebsocket() {
      this.connection.send('__ping__')
    },
    parseDateTime() {
      this.parseDate()
      this.parseTime()
    },
    parseDate() {
      this.dateTimePost.date.year = this.post.datetime_create.slice(0, 4)
      this.dateTimePost.date.month = this.getMonth(Number(this.post.datetime_create.slice(5, 7)))
      this.dateTimePost.date.day = this.post.datetime_create.slice(8, 10)
    },
    parseTime() {
      this.dateTimePost.time.hours = this.post.datetime_create.slice(11, 13)
      this.dateTimePost.time.minutes = this.post.datetime_create.slice(14, 16)
      this.dateTimePost.time.seconds = this.post.datetime_create.slice(17, 19)
    },
  },
  mounted() {
    this.createWebSocket()
    this.parseDateTime()
    this.fetchUser()
    this.fetchImages()
    this.getLikePhoto()
    this.fetchComments()
    this.validate()
    this.interval = setInterval(this.updateWebsocket, 15000)
  },
  unmounted() {
    clearInterval(this.interval)
    this.connection.close()
  }
}
</script>

<style scoped>

</style>