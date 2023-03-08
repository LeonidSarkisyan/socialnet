<template>
  <div class="chat-active">
    <div class="no-chat" v-if="chat.info === 'no chat'">
      Выберите чат
    </div>
    <div class="chat-yes" v-else>
      <div class="header">
        <router-link :to="{name: 'profile', params: {
          tagName: profile.tag_name
        }}" style="text-decoration: none; color: white; display: inline">
          <span class="name-surname">
            {{ profile.name }} {{ profile.surname }}
          </span>
        </router-link>
        <div class="chat-avatar">
          <router-link :to="{name: 'profile', params: {tagName: profile.tag_name}}">
            <img :src="profileAvatar" class="img">
          </router-link>
        </div>
      </div>
      <MessageList
            :edit-message="editMessage"
            :height-message-list="heightMessageList"
            :is-need-to-scroll="isNeedToScroll"
            :user-typing="userTyping"
            @deleteMessage="deleteMessage"
            @openEditMessageMode="openEditMessageMode"
            @editMargin="editMargin"
            @setMargin="setMargin"
            @scrollMessageList="wheel"
            @moreMessages="fetchMoreMessages"
            @editTurnOff="editTurnOff"
            :margin="margin"
            :profile-alien="profile"
            :chat="chat"
            :messages="chat.messages"
            :profile-alien-url="profileAvatar"
            :my-profile-url="myProfileAvatar"
      />
      <ChatInput
          :edit-mode="editMode"
          :edit-message="editMessage"
          @typing="typing"
          @writeMessage="createMessage"
          @editTurnOff="editTurnOff"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ChatInput from "@/components/Chats/ChatInput";
import MessageList from "@/components/Chats/MessageList";
import news from "@/pages/News";
export default {
  name: "ChatActive",
  components: {
    ChatInput, MessageList
  },
  props: {
    chat: {
      type: Object,
      required: true
    },
    changeMarginCounter: {
      type: Number,
      required: true
    },
    userTyping: {
      type: Boolean,
      required: false
    },
  },
  data() {
    return {
      isNeedToScroll: true,
      limit: 20,
      skip: 0,
      heightList: [],
      connection: null,
      isSelectedChat: false,
      profile_id: 0,
      profile: {},
      profileAvatar: null,
      myProfileAvatar: null,
      counterMessage: 0,
      margin: 0, // 474б
      heightMessageList: 0,
      editMode: false,
      editMessage: {}
    }
  },
  methods: {
    deleteMessage(chatId, id) {
      this.chat.messages = this.chat.messages.filter(value => {
        return value.id !== id
      })
    },
    editTurnOff() {
      this.editMode = false
      this.editMessage = {}
    },
    openEditMessageMode(message) {
      this.editMessage = message
      this.editMode = true
    },
    setSkip() {
      this.skip = this.chat.messages.length - 20
    },
    updateSkip() {
      this.skip += 20
    },
    async fetchMoreMessages(height) {
      console.log('Запрос сообщений...')
      console.log(height)
      this.isNeedToScroll = false
      this.updateSkip()
      await axios.get(`http://127.0.0.1:8000/messages/get/${this.chat.id}?skip=${this.skip}&limit=${this.limit}`).then(response => {
        this.chat.messages = [...response.data.reverse(), ...this.chat.messages]
        console.log(response.data)
      })
      this.heightMessageList = height
      this.isNeedToScroll = true
    },
    fetchMessages() {

    },
    typing() {
      let newWSBody = {
        type: '__typing__',
        profile_to_id: this.profile.id,
        profile_from_id: JSON.parse(localStorage.getItem('user_profile')).id,
        chat_id: this.chat.id
      }
      this.$emit('typing', JSON.stringify(newWSBody))
    },
    editMargin(margin) {
      this.heightList.push(margin)
    },
    setMargin(height) {
      //console.log('Высота тут:', height)
      //this.margin = 500 - height
    },
    setMarginOfMessages() {
      this.margin = 474 + 50 - (this.chat.messages.length * 79)
    },
    validateScroll(y) {
      let validScroll = 474 - (79 * this.chat.messages.length)
      console.log(validScroll <= this.margin + y)
      console.log(474 > this.margin + y + (79 * 5) - 25)

      console.log(this.heightList)
      let lastHeight = Math.max(...this.heightList)
      console.log(lastHeight, 'высокий')
      return validScroll <= this.margin + y + 50 && 474 > this.margin + y + (79 * 5) - 50
    },
    wheel(event) {
      let y = event.deltaY
      if (y > 0) {
        y = -60 // 79
      } else {
        y = 60
      }
      if (this.validateScroll(y)) {
        this.margin += y
      } else {
        console.log('Мышью двигать нельзя!')
      }
    },
    createMessage(text) {
      let newMessage = {
        text: text,
        profile_from_id: JSON.parse(localStorage.getItem('user_profile')).id,
        profile_to_id: this.profile_id,
        chat_id: this.chat.id
      }
      this.isNeedToScroll = true
      this.connection.send(JSON.stringify(newMessage))
      this.setMarginOfMessages()
    },
    verifyChat() {
      if (this.chat.info) {
        this.isSelectedChat = true
      }
    },
    fetchProfile() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      let token = localStorage.getItem('JWT')
      if (this.chat.profile_first_id === id) {
        this.profile_id = this.chat.profile_second_id
      } else if (this.chat.profile_second_id === id) {
        this.profile_id = this.chat.profile_first_id
      }
      axios.get(`http://127.0.0.1:8000/profile/id/${this.profile_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        this.profile = response.data
        fetch(`http://127.0.0.1:8000/profile/avatar/${this.profile.tag_name}`).then(response => {
          response.blob().then(blob => {
            this.profileAvatar = window.URL.createObjectURL(blob)
          })
        })
      })
    },
    fetchMyProfile() {
      let id = JSON.parse(localStorage.getItem('user_profile')).tag_name
      fetch(`http://127.0.0.1:8000/profile/avatar/${id}`).then(response => {
        response.blob().then(blob => {
          this.myProfileAvatar = window.URL.createObjectURL(blob)
        })
      })
    },
    createWebsocket() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      this.connection = new WebSocket(`ws://127.0.0.1:8000/chats/ws/${id}`)

      this.connection.onopen = event => {

      }

      this.connection.onmessage = event => {
        // if (event.data !== '__pong__') {
        //   let data = JSON.parse(event.data)
        //   console.log('Что-то пришло!')
        //   if (this.chat.id === data.chat_id) {
        //     this.chat.messages.push(data)
        //     this.margin -= 79
        //   }
        // }
      }

      this.connection.onclose = event => {

      }
    },
    updateWebsocket() {
      this.connection.send('__ping__')
    },
    clearChatActive() {
      if (this.connection) {
        this.connection.close()
      }
      this.heightList = []
    }
  },
  mounted() {
    this.fetchProfile()
    this.margin -= 1
  },
  watch: {
    changeMarginCounter() {
      this.margin -= 79
    },
    chat() {
      this.margin -= 1
      this.skip = 0
      this.setSkip()
      this.isNeedToScroll = true
      this.clearChatActive()
      this.fetchProfile()
      this.fetchMyProfile()
      this.createWebsocket()
      setInterval(this.updateWebsocket, 20000)
      //this.setMarginOfMessages()
    }
  }
}
</script>

<style scoped>
.name-surname {
  color: white;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60px;
}

.name-surname:hover {
  text-decoration: underline;
}

.header {
  height: 60px;
  background: rgba(38, 38, 38, 0.5);
  text-align: center;
  position: relative;
  border-bottom: 1px #000000 solid;
  margin-bottom: -60px;
}

.no-chat {
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  margin-top: 35%;
}

.chat-active {
  border-top: 1px #000000 solid;
  border-right: 1px #000000 solid;
  width: 50%;
  height: 83.5vh;
  background-color: #333333;
  position: relative;
}

.img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  margin-right: 8px;
  position: absolute;
  right: 0;
  top: 3px;
}
</style>