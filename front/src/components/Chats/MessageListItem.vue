<template>
  <div
      :class="{
        'editing': this.editMessage.id === this.message.id,
        'no-read': !this.message.viewed && isMyMessage && delayNoView
      }"
      class="message-list-item-com"
      ref="message"
      @mouseenter="showEditMessageIcon"
      @mouseleave="hideEditMessageIcon"
  >
    <div class="avatar-chat">
      <router-link :to="{name: 'profile', params: {tagName: tagName}}">
        <img :src="avatarFirstProfile" class="alien" v-if="!isMyMessage">
        <img :src="avatarSecondProfile" class="alien" v-if="isMyMessage">
      </router-link>
    </div>
    <div class="message-body">
      <div class="message-name-surname">
        <router-link
            :to="{name: 'profile', params: {tagName: tagName}}" class="names">
          {{ nameAndSurnameMessage }}
        </router-link>
        <div class="message-datetime" v-if="datetime.getDate() === new Date().getDate()">
          {{ String(datetime.getHours()).padStart(2, '0') }}:{{ String(datetime.getMinutes()).padStart(2, '0') }}
        </div>
        <div class="message-datetime" v-else>
          {{ String(datetime.getDate()).padStart(2, '0') }}  {{ month }}
          {{ String(datetime.getHours()).padStart(2, '0') }}:{{ String(datetime.getMinutes()).padStart(2, '0') }}
        </div>
        <img
            :src="blobEditMessageImage"
            class="img"
            v-show="isMyMessage && isShowEditMessage"
            @click="openEditMessage"
        >
        <img
            :src="blobDeleteMessageImage"
            class="img"
            v-show="isMyMessage && isShowEditMessage"
            @click="deleteMessage"
        >
      </div>
      <div class="message-list-item">
        {{ message.text }}
        <span class="edited">
          {{ message.datetime_create_float !== message.datetime_update_float ? 'изм.' : ''}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MessageListItem",
  props: {
    message: {
      type: Object,
      required: true
    },
    profileAlien: {
      type: Object,
      required: true
    },
    editMessage: {
      type: Object,
      required: true
    },
    avatarFirstProfile: {},
    avatarSecondProfile: {},
    blobEditMessageImage: {},
    blobDeleteMessageImage: {},
  },
  data() {
    return {
      months: ["янв", "фев", "март", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
      isShowEditMessage: false,
      isSelectForEdit: false,
      delayNoView: false,
    }
  },
  methods: {
    noReadMessageDelay() {
      setTimeout(() => {
        this.delayNoView = !this.message.viewed
      }, 100)
    },
    deleteMessage() {
      axios.delete(`http://127.0.0.1:8000/messages/${this.message.id}`).then(response => {
        console.log(response.data)
        this.$emit('deleteMessage', this.message.chat_id, this.message.id)
      })
    },
    openEditMessage() {
      console.log('Редактируем сообщения!')
      if (!this.isSelectForEdit) {
        this.isSelectForEdit = true
        this.$emit('openEditMessageMode', this.message)
      } else {
        this.isSelectForEdit = false
        this.$emit('editTurnOff')
      }
    },
    hideEditMessageIcon() {
      this.isShowEditMessage = false
    },
    showEditMessageIcon() {
      this.isShowEditMessage = true
    },
    editMargin() {
      let margin = this.$refs.message.clientHeight + 15 // 15px - this is margin message
      this.$emit('editMargin', margin)
    }
  },
  computed: {
    nameAndSurnameMessage() {
      if (this.isMyMessage) {
        let profile = JSON.parse(localStorage.getItem('user_profile'))
        return profile.name + ' ' + profile.surname
      } else {
        return this.profileAlien.name + ' ' + this.profileAlien.surname
      }
    },
    isMyMessage() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      return this.message.profile_from_id === id
    },
    datetime() {
      return new Date(this.message.datetime_create_float * 1000)
    },
    month() {
      return this.months[this.datetime.getMonth()]
    },
    noRead() {
      if (!this.message.viewed) {
        setTimeout(() => {
          return true
        }, 500)
      }
    },
    tagName() {
      if (!this.isMyMessage) {
        return this.profileAlien.tag_name
      } else {
        return JSON.parse(localStorage.getItem('user_profile')).tag_name
      }
    }
  },
  mounted() {
    this.editMargin()
    this.noReadMessageDelay()
  }
}
</script>

<style scoped>
.message-datetime {
  color: #707070;
  margin-left: 25px;
}

.message-list-item-com {
  width: 99%;
  display: flex;
  margin-top: 5px;
  cursor: pointer;
  padding-top: 8px;
  padding-left: 6px;
  padding-bottom: 8px;
}

.message-list-item-com:hover {

}

.message-list-item {
  color: white;
  padding: 0 6px 0;
  /*white-space: pre-line;*/
}

.message-name-surname {
  padding: 0 6px 0;
  margin-bottom: 16px;
  color: #ff9b38;
  display: flex;
}

.alien {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
}

.img {
  width: 18px;
  height: 18px;
  opacity: 0.25;
  display: block;
  transition: 0.35s;
  margin-left: 25px;
}

.img:hover {
  opacity: 3;
}

.edited {
  font-size: 13px;
  color: gray;
}

.no-read {
  background: #414040;
  border-radius: 4px;
}

.editing {
  background: #545454;
  border-radius: 4px;
}

.names {
  font-size: 16px;
  text-decoration: none;
  color: #DC8C40;
}

.names:hover {
  text-decoration: underline;
}
</style>