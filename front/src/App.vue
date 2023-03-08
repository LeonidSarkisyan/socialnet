<template>
  <div class="app" :style="{'margin-bottom': padding + 'px'}">
    <Header
        :showMenu="showMenu"
        :avatar="avatar"
        :key="headerKey"
        :scrollKey="scrollKey"
        :notifications="notifications"
        @logout="logout"
        @addPadding="addPadding"
        @minPadding="minPadding"
        @updateNotifications="updateNotifications"
    />
  </div>
  <NotificationWindow
      v-if="notificationsForWindow.length > 0"
      :notifications-window="notificationsForWindow"
      @deleteNotificationWindowItem="deleteNotificationWindowItem"
      @openModal="openModal"
  />
  <ModalPost
      @deletePost="updateNotifications"
      @closeModal="closeModalPost"
      v-if="isShowModal"
      :post_id="selectedPostId"
  />
  <router-view
      @readChat="readChat"
      @updateAvatarLogin="changeAvatarLogin"
      @register="register"
      @enter="enter"
      @check="check"
      @logout="logout"
  >
  </router-view>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";
import NotificationWindow from "@/components/NotificationWindow";
import ModalPost from "@/components/ModalPost";
export default {
  name: 'App',
  components: {
    NotificationWindow,
    Header,
    ModalPost
  },
  data() {
    return {
      chats: [],
      selectedPostId: 0,
      isShowModal: false,
      id: 0,
      reg: false,
      profile: {},
      token: null,
      avatar: null,
      showMenu: false,
      headerKey: 0,
      connection: null,
      connectionMessage: null,
      notifications: [],
      notificationsForWindow: [],
      padding: 0,
      scrollKey: 0,
      audio: null,
      audioMessage: null,
      interval: null,
      intervalMessage: null,
      countNoViewed: 0
    }
  },
  methods: {
    needToPlayAudioMessage(data) {
      let bool = this.$store.state.currentActiveChatId !== data.chat_id
      return bool
    },
    playAudioMessage(data) {
      let canPlay = this.needToPlayAudioMessage(data)

      if (canPlay) {
        console.log('Сыграло аудио!')
        if (this.audioMessage.currentTime !== 0) {
          this.audioMessage.pause()
          this.audioMessage.currentTime = 0.0
        }
        this.audioMessage.play()
      } else {
        console.log('Играть не нужно')
      }
    },
    readChat(data) {
      this.fetchChats()
    },
    howMuchNoCheckedChuts() {
      let countNoCheckChuts = this.chats.filter(value => {
        return value.messages.filter(message => {
          return !message.viewed && message.profile_from_id !== this.id
        }).length > 0
      }).length
      this.$store.commit('setCountNoCheckChuts', countNoCheckChuts)
      console.log('Непрочитанных чатов:', countNoCheckChuts)
    },
    async fetchChats() {
      await axios.get(`http://127.0.0.1:8000/chats/${this.id}`).then(response => {
        this.chats = response.data
        this.howMuchNoCheckedChuts()
      })
    },
    updateNewMessage(data) {
      console.log(this.chats)
    },
    createMessageWebSocket() {
      this.connectionMessage = new WebSocket(`ws://127.0.0.1:8000/message/notification/ws/${this.id}`)

      this.connectionMessage.onopen = event => {
        console.log('Уведомления сообщений открыто!')
        console.log(event)
      }

      this.connectionMessage.onmessage = event => {
        if (event.data !== '__pong__') {
          console.log('Что-то пришло для уведомлений сообщений!')
          console.log(event.data)
          let data = JSON.parse(event.data)
          this.fetchChats(data)
          this.playAudioMessage(data)
        }
      }

      this.connectionMessage.onclose = event => {
        console.log('Упало!', event)
      }
    },
    updateMessageWebSocket() {
      this.connectionMessage.send('__ping__')
    },
    isNoViewed() {
      this.countNoViewed = 0
      for (let notification of this.notifications) {
        if (!notification.viewed) {
          this.countNoViewed += 1
        }
      }
      this.$store.commit('setCountNoViewed', this.countNoViewed)

    },
    closeModalPost() {
      this.isShowModal = false
    },
    openModal(id) {
      this.selectedPostId = id
      this.isShowModal = true
    },
    deleteNotificationWindowItem(id) {
      this.notificationsForWindow = this.notificationsForWindow.filter((value) => {
        return value.id !== id
      })
    },
    createNotificationWindow(data) {
      console.log('Создаём окно')
      console.log('Данные окна:', data)
      this.notificationsForWindow.push(data)
    },
    getAudioFiles() {
      fetch('http://127.0.0.1:8000/notifications/audio/file', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
      }).then(response => {
        this.audio = new Audio(response.url)
      })
      fetch('http://127.0.0.1:8000/messages/audio/file', {
        mode: "cors",
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
      }).then(response => {
        this.audioMessage = new Audio(response.url)
      })
    },
    addPadding() {
      this.padding = 70
    },
    minPadding() {
      this.padding = 0
    },
    updateNotifications(id) {
      this.notifications = this.notifications.filter((notification) => {
        return notification.comment.post.id !== id
      })
    },
    fetchNotifications() {
      axios.get(`http://127.0.0.1:8000/notifications/${this.id}`).then(response => {
        this.notifications = response.data
        if (this.notifications.length > 0) {
          this.scrollKey += 1
          if (this.scrollKey !== 1) {
            if (this.audio.currentTime !== 0) {
              this.audio.pause()
              this.audio.currentTime = 0.0
              this.audio.play()
            } else {
              this.audio.play()
            }
          }
        } else {
          //this.audio.play()
          this.scrollKey += 1
        }
        this.isNoViewed()
      })
    },
    register(newUser, newProfile, avatar) {
      axios.post('http://127.0.0.1:8000/users', newUser).then(response => {
        let userId = response.data.id
        newProfile.user_id = userId
        console.log('newProfile:', newProfile)
        axios.post('http://127.0.0.1:8000/profile/', newProfile).then(response => {
          this.profile = response.data
          let formData = new FormData();
          formData.append("file", avatar);
          formData.append("id", this.profile.id)
          axios.post('http://127.0.0.1:8000/profile/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          this.enter(newUser.username, newUser.password)
        })
      })
    },
    enter(username, password) {
      try {
        const response = axios.post('http://127.0.0.1:8000/authetication/login', {username: username, password: password}).catch(error => {
          console.log('НАДО УБРАТЬ ЛОУДЕР')
          this.$store.commit('setKeyLoaderRegisterForm')
          if (error.response.status === 404) {
            alert('Такого пользователя не существует!')
          } else {
            alert('Неправильный пароль!')
          }
        })
        response.then(response => {
          this.token = response.data.access_token
          localStorage.JWT = this.token
          try {
            const response = axios.get('http://127.0.0.1:8000/users/me', {
              headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
              }
            }).then(response => {
              console.log(response)
              localStorage.user_profile = JSON.stringify(response.data)
              this.id = JSON.parse(localStorage.getItem('user_profile')).id
              this.profile = response.data
              this.showMenu = true
              this.createWebSocket()
              this.createMessageWebSocket()
              this.interval = setInterval(this.updateWebsocket, 20000)
              this.intervalMessage = setInterval(this.updateMessageWebSocket, 20000)
              this.getAudioFiles()
              this.fetchNotifications()
              this.fetchChats()
              this.changeAvatarLogin()
              this.$router.push({
                name: 'profile',
                params: {
                  tagName: this.profile.tag_name
                }
              })
            }).catch(e => {
              console.log('qwe')
            })
          } catch (e) {
            console.log('ААА!')
            console.log(e)
          }
        })
      } catch (e) {
        console.log('Такого пользователя нет!')
      }
      this.reg = true
    },
    changeAvatarLogin() {
      this.headerKey += 1
    },
    check() {
      try {
        const response = axios.get('http://127.0.0.1:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        })
        console.log(response)
      } catch (e) {
        console.log(e)
      }
    },
    logout() {
      this.reg = false
      this.scrollKey = 0
      localStorage.removeItem('JWT')
      localStorage.removeItem('user_profile')
      this.showMenu = false
      this.changeAvatarLogin()
      this.connection.close()
      this.connectionMessage.close()
      clearInterval(this.interval)
      clearInterval(this.intervalMessage)
      this.notificationsForWindow = []
      this.notifications = []
      this.$router.push({name: 'register'})
    },
    createWebSocket() {
      this.connection = new WebSocket(`ws://127.0.0.1:8000/notifications/ws/${this.id}`)

      this.connection.onopen = event => {
        console.log('Корневой app open')
      }

      this.connection.onmessage = event => {
        let data
        try {
            data = JSON.parse(event.data)
            this.filterWebsocketMessage(data)
          } catch (e) {

        }
      }

      this.connection.onclose = event => {
        console.log('Упало!', event)
      }
    },
    updateWebsocket() {
      this.connection.send('ping')
    },
    filterWebsocketMessage(data) {
      console.log('Отфильтрованные данные:', data)
      if (data.type === 'like') {
        if (this.audio.currentTime !== 0) {
          this.audio.pause()
          this.audio.currentTime = 0.0
        }
        this.audio.play()
        this.createNotificationWindow(data)
        this.fetchNotifications()
      } else if (data.type === 'requestfriend') {
        this.$store.commit('setRequestId', data.requestfriend.id)
        this.$store.commit('upIdRequestSending', data.requestfriend.profile.id)
        this.createNotificationWindow(data)
        this.fetchNotifications()
      } else if (data.type === 'acceptfriend') {
        this.$store.commit('setAcceptId', data.acceptfriend.id)
        this.$store.commit('setAcceptSendingId', data.acceptfriend.profile.id)
        this.createNotificationWindow(data)
        this.fetchNotifications()
      } else {
        this.createNotificationWindow(data)
        this.fetchNotifications()
      }
    },
  },
  computed: {
    isRegister() {
      if (localStorage.getItem('JWT')) {
        const response = axios.get('http://127.0.0.1:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
            'Content-Type': 'application/json'
          }
        })
          response.then(response => {
            fetch(`http://127.0.0.1:8000/profile/avatar/${response.data.tag_name}`).then(response => {
              response.blob().then(blob => {
                this.avatar = window.URL.createObjectURL(blob)
              })
            })
          })
        //this.id = JSON.parse(localStorage.getItem('user_profile')).id
        //this.createWebSocket()
        //this.interval = setInterval(this.updateWebsocket, 15000)
        //this.getAudioFiles()
        return true
      } else {
        this.$router.push({name: 'register'})
        return false
      }
    }
  },
  watch: {
    '$store.state.idNotificationDeleted'() {
      this.notifications = this.notifications.filter(value => {
        return value.id !== this.$store.state.idNotificationDeleted
      })
    },
    '$store.state.fetchNotification'() {
      let id = this.$store.state.fetchNotification
      let objIndex = this.notifications.findIndex(value => value.id === id)
      this.notifications[objIndex].request_friend.accept = true
      console.log(this.notifications[objIndex])
    }
  },
  mounted() {
    if (this.isRegister) {
      this.showMenu = true
      this.id = JSON.parse(localStorage.getItem('user_profile')).id
      this.getAudioFiles()
      this.createWebSocket()
      this.createMessageWebSocket()
      this.fetchNotifications()
      this.fetchChats()
      this.interval = setInterval(this.updateWebsocket, 20000)
      this.intervalMessage = setInterval(this.updateMessageWebSocket, 20000)
    } else {
      this.$router.push(
          {
            name: 'register'
          }
      )
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital@1&display=swap');

* {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Montserrat', sans-serif;
  background: #212121;
}

.like-img {
  display: block;
  cursor: pointer;
  width: 32px;
}

.posts {
  width: 600px;
  margin: 0 auto 0;
  margin-top: 29px;
}

.post {
  background: #4B4B4B;
  border-radius: 10px;
  padding-top: 21px;
  padding-left: 25px;
  padding-bottom: 21px;
  margin-bottom: 35px;
}

.post-info {
  display: flex;
  align-items: center;
}

.post-info-avatar {
  display: block;
  width: 67px;
  height: 67px;
  object-fit: cover;
  margin-right: 22px;
  border-radius: 50%;
  cursor: pointer;
}

.r {
  clip-path: circle(40% at 50% 50%);
  width: 75px;
  margin-right: 0px;
  margin-left: -10px;
  margin-bottom: -5px;
}

.name-group {
  font-size: 18px;
  line-height: 20px;
  color: #F5B06F;
  cursor: pointer;
  display: inline-block;
}

.name-group:hover {
  text-decoration: underline;
}

.date-post {
  line-height: 20px;
  color: #959595;
}

.post-text {
  line-height: 20px;
  color: #FFFFFF;
  margin-top: 14px;
  margin-bottom: 14px;
  width: 550px;
}

.post-image-img {
  max-width: 550px;
}

.post-likes {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.like-img {
  display: block;
  cursor: pointer;
  width: 32px;
}

.likes-text {
  font-size: 24px;
  line-height: 29px;
  color: #939393;
  margin-left: 11px;
}

.likes {
  display: flex;
  align-items: center;
  margin-right: 24px;
}

.comments {
  display: flex;
  align-items: center;
}

.comments-img {
  cursor: pointer;
  width: 38px;
  display: block;
}

</style>
