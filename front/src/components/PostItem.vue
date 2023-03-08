<template>
  <div class="post__wrapper" v-click-outside="closeModel">
    <div class="post" ref="post">
      <div class="post-info">
        <router-link :to="{name: 'profile', params: {tagName: profile.tag_name}}">
          <img :src="avatarImageUrl" class="post-info-avatar r">
        </router-link>
        <div class="post-info-text">
          <router-link :to="{name: 'profile', params: {tagName: profile.tag_name}}" style="text-decoration: none">
            <div class="name-group">{{ profile.name }} {{ profile.surname }}</div>
          </router-link>
          <div class="date-post">
            {{ Number(dateTimePost.date.day) }} {{ dateTimePost.date.month }} в {{ Number(dateTimePost.time.hours) }}:{{ dateTimePost.time.minutes }}
          </div>
        </div>
      </div>
      <div class="post-text" v-if="updated">
        {{ editedText }}
      </div>
      <div class="post-text" v-if="!edit && !updated">
        {{ post.text }}
      </div>
      <div class="div inputs" v-if="edit">
        <textarea v-model="editedText" @keyup.enter="updatePost" class="edit-input"></textarea>
        <img src="@/assets/images/ui/accept.png" class="icon" @click="updatePost">
        <img src="@/assets/images/ui/close.png" class="icon" style="width: 30px" @click="edit = false; $emit('noCloseModel')">
      </div>
      <div class="post-image">
        <ImageList
            @noCloseModel="noCloseModel"
            :post_id="post.id"
            :images="images"
            :key="postKey"
        >
        </ImageList>
      </div>
      <div class="post-likes">
        <Likes :post="post" :connection="connection"/>
        <CommentsInfo :post="post" :comments="comments" @openCommentInput="openCommentInput"/>
      </div>
      <img src="@/assets/images/option.png" class="option-img" v-if="isProfileOwner" @click="openContextMenu">
      <transition-group name="context-menu">
        <div
            ref="contextMenu"
            class="context-menu"
            v-click-outside="hideContextMenu"
            v-if="focused"
        >
          <div class="context-menu-item" @click="editPost">Редактировать</div>
          <div class="context-menu-item" @click="deletePost">
              Удалить
          </div>
        </div>
      </transition-group>
    </div>
    <CommentsList
        :isOwnerPost="isPostOwner"
        :post="post"
        :comments="comments"
        :limited="limited"
        :limit="limit"
        @falseLimited="limited = false; limit = comments.length + 1"
        @limitplus="limitPlus"
        @closeModal="closeModel"
        @deleteComment="deleteComment"
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
import axios, {post} from "axios";
import ImageList from "@/components/ImageList";
import Likes from "@/components/Likes";
import CommentsList from "@/components/CommentsList";
import CommentsInfo from "@/components/CommentsInfo";
import CommentsInput from "@/components/CommentsInput";
export default {
  name: "PostItem",
  components: {
    ImageList, Likes, CommentsList, CommentsInput, CommentsInfo
  },
  props: {
    profile: {},
    post: {},
    isProfileOwner: {},
  },
  data() {
    return {
      isPostOwner: false,
      openedCommentInput: false,
      margin: 0,
      avatarImageUrl: null,
      likeImageUrl: null,
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
      openedContextMenu: false,
      focused: false,
      clickOut: 0,
      postKey: 0,
      keyLike: 0,
      images: [],
      edit: false,
      editedText: '',
      updated: false,
      likeUrl: null,
      countLikes: 0,
      comments: [],
      connection: null,
      limited: false,
      limit: 0,
      interval: null,
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
    setOwnerPost() {
      this.isPostOwner = JSON.parse(localStorage.getItem('user_profile')).id === this.post.profile_id
    },
    deleteComment(id) {
      this.comments = this.comments.filter(value => {
        return value.id !== id
      })
    },
    closeModelTwo() {
      for (let i=0; i < 2; ++i) {
        this.$emit('closeModel')
      }
    },
    getMonth(integer) {
      let month = this.months.find((value => {
        return value.num === integer
      }))
      return month.name
    },
    noCloseModel() {
      this.$emit('noCloseModel')
    },
    closeModel(int=0) {
      if (int) {
        this.$emit('closeModel', 2)
      } else {
        this.$emit('closeModel')
      }
    },
    limitPlus() {
      this.$emit('noCloseModel')
      this.limit += 5
      if (this.limit >= this.comments.length) {
        this.limited = false
      }
    },
    forcePost() {
      this.postKey += 1
    },
    async fetchAvatarPost() {
      try {
        fetch(`http://127.0.0.1:8000/profile/avatar/${this.profile.tag_name}`).then(response => {
          response.blob().then(blob => {
            this.avatarImageUrl = window.URL.createObjectURL(blob)
          })
        })
      } catch (e) {
        console.log(e)
      }
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
    openContextMenu() {
      this.focused = true
    },
    async deletePost() {
      this.$emit('updateNotis', this.post.id)
      try {
        const response = axios.delete(`http://127.0.0.1:8000/posts/${this.post.id}`).then(response => {
          console.log(response.data)
          for (let i=0; i < 2; ++i) {
            this.$emit('closeModel')
          }
          this.$store.commit('updateKeyPostList', this.post.id)
        })
        this.focused = !this.focused
        this.$emit('deletePost', this.post.id)
      } catch (error) {
        console.log('ОШИБКА!!!', error)
      }
    },
    hideContextMenu() {
      console.log('Хах')
      this.clickOut += 1
      if (this.clickOut === 1) {
        console.log('Окно закрывать нельзя, только открыли!')
      } else {
        this.focused = false
        this.clickOut = 0
      }
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
          })
        }
      })
    },
    editPost() {
      this.editedText = this.post.text
      this.edit = true
      this.focused = false
      this.clickOut = 0
    },
    updatePost() {
      axios.put(`http://127.0.0.1:8000/posts/${this.post.id}?updated_text=${this.editedText}`).then(response => {
        this.editedText = response.data
        this.updated = true
        this.$store.commit('updateTextPost', this.editedText)
        this.edit = false
      })
    },
    getLikeUnFullPhoto() {
      fetch('http://127.0.0.1:8000/likes/unfull').then(response => {
        response.blob().then(blob => {
          this.likeUrl = window.URL.createObjectURL(blob)
        })
      })
    },
    getLikeFullPhoto() {
      fetch('http://127.0.0.1:8000/likes/full').then(response => {
        response.blob().then(blob => {
          this.likeUrl = window.URL.createObjectURL(blob)
        })
      })
    },
    getCountLike() {
      axios.get(`http://127.0.0.1:8000/likes/${this.post.id}/count/`).then(response => {
        this.countLikes = response.data.length
      })
    },
    putLike() {
      let newLike = {
        post_id: this.post.id,
        user_id: JSON.parse(localStorage.getItem('user_profile')).id
      }
      axios.post('http://127.0.0.1:8000/likes/', newLike)
      this.keyLike += 1
      this.getLikeFullPhoto()
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
        } else if (event.data === 'error') {
          alert('Ошибка. Обновите страницу.')
        } else if (event.data === 'Liked! And Notificated!'){
          console.log('Лайкнули!')
        } else {
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
          //console.log('Закрыто чисто!')
        } else {
          console.log('Соединение прервано!')
        }
      }
    },
    updateWebSocket() {
      this.connection.send('__ping__')
    }
  },
  watch: {
    '$store.state.textUpdated'() {
      this.editedText = this.$store.state.textUpdated
      this.updated = true
    }
  },
  mounted() {
    this.createWebSocket()
    this.parseDateTime()
    this.fetchAvatarPost()
    this.fetchImages()
    this.getLikeUnFullPhoto()
    this.getCountLike()
    this.fetchComments()
    this.validate()
    this.setOwnerPost()
    this.interval = setInterval(this.updateWebSocket, 15000)
  },
  unmounted() {
    clearInterval(this.interval)
    this.connection.close()
  }
}
</script>

<style scoped>

.inputs {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.icon {
  width: 26px;
  margin-right: 10px;
  cursor: pointer;
}

.edit-input {
  background: #7D7D7D;
  padding: 5px;
  border-radius: 4px;
  color: white;
  font-weight: 700;
  width: 350px;
  resize: none;
  font-size: 18px;
  margin-right: 10px;
}

.context-menu-enter-active, .context-menu-leave-active {
  transition: 0.25s;
}

.context-menu-enter-from, .context-menu-leave-active {
  opacity: 0;
  transform: scale(0);
  transform: translate3d(50px);
}

.context-menu {
  background: #444444;
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 15px;
  border-radius: 4px;
}

.context-menu-item {
  color: #ff9b38;
  text-align: center;
  font-weight: 700;
  margin-bottom: 10px;
}

.context-menu-item:hover {
  cursor: pointer;
  text-decoration: underline;
}

.post {
  position: relative;
}

.option-img {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  padding: 15px;
  display: block;
}

</style>