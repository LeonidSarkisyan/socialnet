<template>
  <div class="chat-list-item" @click="selectChat" :class="{'active': chat.id === selectChatId}">
    <img :src="profileAvatar" class="img">
    <div class="info">
      <div class="name-and-surname">
        {{ profile.name }} {{ profile.surname }}
      </div>
      <div class="last-message">
        <div class="dots" v-show="isTyping">
          Печатает ...
        </div>
      </div>
      <div class="last-message" :class="{'last-message-active': chat.id === selectChatId}" v-show="!isTyping">
        <div>
          {{ lastMessage }}
        </div>
        <div
            class="read-point"
            v-if="!isRead"
            :class="{'read-point-active': chat.id === selectChatId}"
        >
        </div>
      </div>
    </div>
    <div class="count-no-viewed-message" v-if="countNoViewed">
      {{ countNoViewed }}
    </div>
    <div
        class="last-datetime"
        v-if="lastMessageDateTime"
        :class="{'last-message-active': chat.id === selectChatId}"
    >
      <span v-if="lastMessageDateTime.getDate() === new Date().getDate()">
        {{ String(lastMessageDateTime.getHours()).padStart(2, '0') }}:{{ String(lastMessageDateTime.getMinutes()).padStart(2, '0') }}
      </span>
      <span v-else>
          {{ String(lastMessageDateTime.getDate()).padStart(2, '0') }}  {{ month }}
          {{ String(lastMessageDateTime.getHours()).padStart(2, '0') }}:{{ String(lastMessageDateTime.getMinutes()).padStart(2, '0') }}
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatListItem",
  props: {
    chat: {
      type: Object,
      required: true
    },
    selectChatId: {
      type: Number,
      required: true
    },
    typingChatsId: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      reading: false,
      profile_id: 0,
      profile: {},
      profileAvatar: null,
      selected: false,
      isTyping: false,
      timeoutTyping: null,
      months: ["янв", "фев", "март", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
    }
  },
  methods: {
    typing() {
      if (typeof this.timeoutTyping === "number") {
        clearTimeout(this.timeoutTyping)
      }
      this.isTyping = true
      this.timeoutTyping = setTimeout(() => {
        this.isTyping = false
      }, 3000)
      this.$emit('deleteChatId', this.chat.id)
    },
    selectChat() {
      this.$emit('selectChat', this.chat.id)
      let countNoViewedMessages = this.chat.messages.filter(value => {
        return !value.viewed && value.profile_to_id === JSON.parse(localStorage.getItem('user_profile')).id
      }).length
      console.log('Количество непрочитанных сообщений:')
      console.log(countNoViewedMessages)
      if (countNoViewedMessages) {
        this.checkMessages()
        this.$store.commit('readOneChut')
      } else {
        console.log('Читать нечего')
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
    checkMessages() {
      axios.get(`http://127.0.0.1:8000/messages/${this.chat.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log('Тут:')
        console.log(response.data)
        this.readingMessages()
      })
    },
    readingMessages() {
      for (let message of this.chat.messages) {
        message.viewed = true
      }
    },
    isNeedToRead() {
      if (this.selectChatId === this.chat.id) {
        this.checkMessages()
      }
    }
  },
  computed: {
    countNoViewed() {
      if (this.selectChatId !== this.chat.id) {
        let viewed = this.chat.messages.filter(value => {
          return !value.viewed && value.profile_from_id === this.profile_id
        })
        return viewed.length
      } else {
        //this.checkMessages()
        return 0
      }
    },
    lastMessage() {
      if (this.chat.messages.length > 0) {
        let id = JSON.parse(localStorage.getItem('user_profile')).id
        let message = this.chat.messages[this.chat.messages.length - 1]
        if (message.profile_from_id === id) {
          return 'Вы: ' + message.text
        } else {
          return message.text
        }
      } else {
        return ''
      }
    },
    isRead() {
      if (this.chat.messages.length > 0) {
        if (this.lastMessage !== '') {
          let message = this.chat.messages[this.chat.messages.length - 1]
          if (message.profile_from_id === JSON.parse(localStorage.getItem('user_profile')).id) {
            return message.viewed
          } else {
            return true
          }
        }
      } else {
        return true
      }
    },
    lastMessageDateTime() {
      if (this.chat.messages.length > 0) {
        let message = this.chat.messages[this.chat.messages.length - 1]
        return new Date(message.datetime_create_float * 1000)
      } else {
        return ''
      }
    },
    month() {
      return this.months[this.lastMessageDateTime.getMonth()]
    },
  },
  watch: {
    'typingChatsId.length'() {
      let index = this.typingChatsId.findIndex(value => {
        return value === this.chat.id
      })
      if (index !== -1) {
        this.typing()
      }
    }
  },
  mounted() {
    this.fetchProfile()
    this.isNeedToRead()
  }
}
</script>

<style scoped>
.read-point {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #DC8C40;
  margin-left: 10px;
  margin-top: 2px;
}

.count-no-viewed-message {
  font-weight: 700;
  padding: 2px;
  border-radius: 50%;
  background: #ffa95e;
  color: #b05502;
  width: 20px;
  height: 20px;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 13px;
  top: 30px;
}

.last-message {
  color: rgb(170,170,170);
  overflow: hidden;
  display: flex;
  align-items: center;
}

.info {
  height: 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-list-item {
  position: relative;
  padding: 9px;
  display: flex;
  align-items: center;
  border-radius: 16px;
  cursor: pointer;

  overflow: hidden;

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.chat-list-item:hover {
  background: rgb(44,44,44);
}

.img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  margin-right: 8px;
}

.name-and-surname {
  color: #fff;
  font-weight: 700;
}

.active {
  background: rgb(200, 106, 109);
}

.active:hover {
  background: rgb(200, 106, 106);
}

.dots {
  margin: 15px 0 15px;
  text-align: center;
  font-weight: 700;
  color: white;
  display:inline-block;
  clip-path: inset(0 1ch 0 0);
  animation: l 1s steps(8) infinite;
}

@keyframes l {
  to {
    clip-path: inset(0 -1ch 0 0)
  }
}

.last-datetime {
  font-size: 13px;
  font-weight: 700;
  color: #838282;
  position: absolute;
  top: 5px;
  right: 10px;
}

.last-message-active {
  color: white;
}

.read-point-active {
  background: white;
}
</style>