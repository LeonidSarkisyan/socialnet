<template>
  <div class="content" v-show="!loading">
    <div class="chats-container" v-if="chats.length > 0">
      <ChatList
          :typing-chats-id="typingChatsId"
          :selectedChatId="selectedChatId"
          :chats="chats"
          @selectChat="selectChat"
          @deleteChatId="deleteChatId"
      />
      <ChatActive
          @typing="typing"
          :userTyping="userTyping"
          :change-margin-counter="changeMarginCounter"
          :chat="selectedChat"
      />
<!--      <div class="chat-option-div">-->
<!--        <div class="all-chats">-->
<!--          Все чаты-->
<!--        </div>-->
<!--        <div class="all-chats">-->
<!--          Непрочитанные-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="chats-container center" v-else>
      <div class="while-no-chats">
        Вы пока ни с кем не переписывались
      </div>
      <router-link :to="{name: 'peoples'}" class="all-users">
        Все пользователи
      </router-link>
    </div>
  </div>
</template>

<script>
import ChatList from "@/components/Chats/ChatList";
import ChatActive from "@/components/Chats/ChatActive";
import axios from "axios";
export default {
  name: "Dialogs",
  components: {
    ChatList, ChatActive
  },
  data() {
    return {
      userTyping: false,
      loading: true,
      selectedChatId: 0,
      chats: [],
      connection: null,
      connectionTyping: null,
      changeMarginCounter: 0,
      interval: null,
      intervalTyping: null,
      timeoutTyping: null,
      typingChatsId: []
    }
  },
  methods: {
    deleteChatId(id) {
      this.typingChatsId = this.typingChatsId.filter(value => {
        return value !== id
      })
    },
    chatTyping(data) {
      this.chatActiveTyping(data)
      this.chatListItemTiping(data)
    },
    chatListItemTiping(data) {
      this.typingChatsId.push(data.chat_id)
      console.log(this.typingChatsId)
    },
    chatActiveTyping(data) {
      if (data.chat_id === this.selectedChatId) {
        if (typeof this.timeoutTyping === 'number') {
          clearInterval(this.timeoutTyping)
        }
        this.userTyping = true
        this.timeoutTyping = setTimeout(() => {
          this.userTyping = false
        }, 3000)
      }
    },
    typing(message) {
      this.connectionTyping.send(message)
    },
    createWebSocketTyping() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      this.connectionTyping = new WebSocket(`ws://127.0.0.1:8000/websocket/typing/${id}`)

      this.connectionTyping.onopen = event => {
        console.log('Открылся typing')
      }

      this.connectionTyping.onmessage = event => {
        if (event.data !== '__pong__') {
          let data = JSON.parse(event.data)
          if (data.type === '__typing__') {
            this.chatTyping(data)
          } else if (data.type === '__update__') {
            let indexChat = this.chats.findIndex(value => {
              return value.id === data.chat_id
            })
            if (indexChat !== -1) {
              let indexMessage = this.chats[indexChat].messages.findIndex(value => {
                return value.id === data.id
              })
              this.chats[indexChat].messages[indexMessage].text = data.text
              this.chats[indexChat].messages[indexMessage].datetime_update_float = new Date()
            }
          } else if (data.type === '__delete__') {
            console.log('УДАЛЯЕМ СООБЩЕНИЕ')
            console.log(data)
            let indexChat = this.chats.findIndex(value => value.id === data.chat_id)
            this.chats[indexChat].messages = this.chats[indexChat].messages.filter(value => value.id !== data.id)
          } else if (data.type === '__read__') {
            console.log('ПРОЧИТЫВАЕМ СООБЩЕНИЯ!')
            console.log(data)
            let indexChat = this.chats.findIndex(value => value.id === data.chat_id)
            for (let index in this.chats[indexChat].messages) {
              this.chats[indexChat].messages[index].viewed = true
            }
          }
        }
      }

      this.connectionTyping.onclose = event => {
        console.log('Закрылся typing')
      }
    },
    createWebSocket() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      this.connection = new WebSocket(`ws://127.0.0.1:8000/chats/ws/${id}`)

      this.connection.onopen = event => {
        console.log('Открылось нормально!')
      }

      this.connection.onmessage = event => {
        console.log(event.data)
        if (event.data !== '__pong__') {
          let data = JSON.parse(event.data)
          console.log('Что-то пришло глобально!')
          let index = this.chats.findIndex(value => {
            return value.id === data.chat_id
          })
          if (this.selectedChatId === data.chat_id && data.profile_from_id !== id) {
            axios.get(`http://127.0.0.1:8000/messages/update/${data.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
                'Content-Type': 'application/json'
              }
            }).then(response => {
              console.log('Прочитанный сообщение:')
              console.log(response.data)
              this.chats[index].messages.push(response.data)
              this.changeMarginCounter += 1
              this.firstChat(index)
              console.log('Работает тут')
              this.$emit('readChat', response.data)
            })
            // this.chats[index].messages.push(data)
            // this.changeMarginCounter += 1
          } else if (this.selectedChatId === data.chat_id) {
            this.chats[index].messages.push(data)
            this.changeMarginCounter += 1
            this.firstChat(index)
          } else {
            this.chats[index].messages.push(data)
            this.firstChat(index)
          }
        }
      }

      this.connection.onclose = event => {
        console.log('Закрыт WebSocket Dialogs!')
      }
    },
    firstChat(index) {
      let chat = this.chats.splice(index, 1)[0]
      this.chats.unshift(chat)
      console.log(this.chats)
    },
    updateWebSocketTyping() {
      this.connectionTyping.send('__ping__')
    },
    updateWebSocketConnection() {
      this.connection.send('__ping__')
    },
    fetchChats() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      axios.get(`http://127.0.0.1:8000/chats/${id}`).then(response => {
        this.chats = response.data
        this.loading = false
        console.log(this.chats)
        this.isExistId()
      })
    },
    selectChat(id) {
      this.selectedChatId = id
      localStorage.selectChatId = id
      this.$store.commit('setCurrentActiveChatId', id)
      this.$route.params.id = id
    },
    isExistId() {
      if (this.$route.params.id) {
        let profile_id = Number(this.$route.params.id)
        let id = this.chats.find(value => {
          console.log(value)
          return value.profile_second_id === profile_id || value.profile_first_id === profile_id
        }).id
        this.selectedChatId = id
        localStorage.selectChatId = id
      }
    }
  },
  computed: {
    selectedChat() {
      if (this.selectedChatId) {
        let chat = this.chats.find(value => value.id === this.selectedChatId)
        return chat
      } else {
        return {info: 'no chat'}
      }
    },
  },
  mounted() {
    this.fetchChats()
    this.interval = setInterval(this.updateWebSocketConnection, 20000)
    this.intervalTyping = setInterval(this.updateWebSocketTyping, 500)
  },
  watch: {
    loading() {
      if (this.loading === false) {
        this.createWebSocket()
        this.createWebSocketTyping()
      }
    },
    selectedChatId() {
      this.userTyping = false
    },
  },
  unmounted() {
    this.connection.close()
    clearInterval(this.interval)
    clearInterval(this.intervalTyping)
    this.$store.commit('nullingCurrentActiveChatId')
  }
}
</script>

<style scoped>
.while-no-chats {
  text-align: center;
  font-size: 26px;
  color: #DC8C40;
}

.chats-container {
  position: relative;
  display: flex;
}

.chats {
  background: #252525;
  border-radius: 47px 47px 47px 47px;
  width: 770px;
  margin-left: 200px;
  margin-top: 21px;
}

.chat {
  display: block;
  border-bottom: 1px black solid;
}

.chat__inner {
  padding-top: 10px;
  padding-left: 15px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  position: relative;
}

.chat-avatar {
  width: 80px;
  clip-path: circle(40% at 50% 50%);
  display: block;
  margin-right: 30px;
}

.chat-option {
  width: 24px;
  display: block;
  position: absolute;
  top: 25px;
  right: 35px;
  cursor: pointer;
}

.name_and_msg {
  display: block;
  width: 70%;
  text-decoration: none;
}

.chat-name {
  font-size: 20px;
  line-height: 24px;
  color: #F5B06F;
  margin-bottom: 15px;
}

.chat-msg {
  line-height: 20px;
  color: #FFFFFF;
}

.datetime {
  line-height: 20px;
  color: #7D7D7D;
  position: absolute;
  top: 18px;
  right: 70px;
}

.chat-option-div {
  background: #252525;
  border-radius: 19px;
  width: 330px;
  position: absolute;
  top: 0;
  right: 125px;
}

.all-chats {
  margin-left: 24px;
  font-size: 20px;
  line-height: 24px;
  color: #F5B06F;
  margin-top: 27px;
  cursor: pointer;
}

.all-chats:last-child {
  margin-bottom: 27px;
}

.center {
  display: flex;
  flex-direction: column;
  margin: 15% auto 0;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.all-users {
  text-decoration: none;
  color: #ab2d20;
  margin-top: 25px;
}

.all-users:hover {
  color: #ff5546;
  text-decoration: underline;
}
</style>