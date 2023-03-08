<template>
  <div class="message-list" @wheel="wheel">
    <div class="message-list-inner" ref="messagesList">
      <div class="more-messages" ref="observer"></div>
      <MessageListItem
          @editTurnOff="this.$emit('editTurnOff')"
          @deleteMessage="deleteMessage"
          @openEditMessageMode="openEditMessageMode"
          @editMargin="editMargin"
          :profile-alien="profileAlien"
          :avatarFirstProfile="profileAlienUrl"
          :avatarSecondProfile="myProfileUrl"
          :blobEditMessageImage="blobEditMessageImage"
          :blobDeleteMessageImage="blobDeleteMessageImage"
          :message="message"
          :edit-message="editMessage"
          :key="message.id"
          v-for="message in messages"
      />
      <div class="text-center">
        <div class="dots">
          <span :class="{'opacity': !userTyping}">
            Печатает ...
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageListItem from "@/components/Chats/MessageListItem";
export default {
  name: "MessageList",
  components: {
    MessageListItem
  },
  props: {
    editMessage: {
      type: Object,
      required: true
    },
    chat: {
      type: Object,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    profileAlien: {
      type: Object,
      required: true
    },
    margin: {
      type: Number,
      required: true
    },
    userTyping: {
      type: Boolean,
      required: false
    },
    isNeedToScroll: {
      type: Boolean,
      required: false
    },
    heightMessageList: {
      type: Number,
      required: false,
    },
    profileAlienUrl: {},
    myProfileUrl: {}
  },
  data() {
    return {
      blobAvatarFirstProfile: null,
      blobAvatarSecondProfile: null,
      blobEditMessageImage: null,
      blobDeleteMessageImage: null,
    }
  },
  methods: {
    deleteMessage(chatId, id) {
      this.$emit('deleteMessage', chatId, id)
    },
    openEditMessageMode(message) {
      this.$emit('openEditMessageMode', message)
    },
    fetchEditMessageImage() {
      fetch('http://127.0.0.1:8000/messages/image/?type_file=edit').then(response => {
        response.blob().then(blob => {
          this.blobEditMessageImage = window.URL.createObjectURL(blob)
        })
      })

      fetch('http://127.0.0.1:8000/messages/image/?type_file=delete').then(response => {
        response.blob().then(blob => {
          this.blobDeleteMessageImage = window.URL.createObjectURL(blob)
        })
      })
    },
    fetchMorePost() {
      this.$emit('moreMessages', this.$refs.messagesList.scrollHeight)
    },
    editMargin(margin) {
      if (this.isNeedToScroll) {
        this.$refs.messagesList.scrollTop = this.$refs.messagesList.scrollHeight
        this.$emit('editMargin', margin)
      }
    },
    wheel(event) {
      //this.$emit('scrollMessageList', event)
    },
    getAvatars() {
      console.log(this.chat)
      fetch(`http://127.0.0.1:8000/profile/avatar/v2/${this.chat['profile_first_id']}`).then(response => {
        response.blob().then(blob => {
          this.blobAvatarFirstProfile = window.URL.createObjectURL(blob)
        })
      })
      fetch(`http://127.0.0.1:8000/profile/avatar/v2/${this.chat['profile_second_id']}`).then(response => {
        response.blob().then(blob => {
          this.blobAvatarSecondProfile = window.URL.createObjectURL(blob)
        })
      })
      console.log(this.chat['profile_first_id'])
      console.log(this.chat['profile_second_id'])
    }
  },
  watch: {
    heightMessageList() {
      let scrollTop = this.$refs.messagesList.scrollHeight - this.heightMessageList
      this.$refs.messagesList.scrollTop = scrollTop + this.$refs.messagesList.scrollTop
    },
    margin() {
      this.$refs.messagesList.scrollTop = this.$refs.messagesList.scrollHeight
    },
    profileAlien() {
      this.$emit('setMargin', this.$refs.messagesList.clientHeight)
    },
  },
  mounted() {
    //this.$emit('setMargin', this.$refs.messagesList.clientHeight)
    let options = {
      // root: document.querySelector('#scrollArea'),
      rootMargin: '0px',
      threshold: 1.0
    }

    let callback = (entries, observer) => {
      if (entries[0].isIntersecting) {
        this.fetchMorePost()
      }
    };

    let observer = new IntersectionObserver(callback, options);

    observer.observe(this.$refs.observer)
    this.fetchEditMessageImage()
  },
}
</script>

<style scoped>
.text-center {
  width: 100%;
  text-align: center;
}

.dots {
  margin: 15px auto 15px;
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

.typing {
  color: #ffffff;
  font-weight: 700;
}

.message-list {
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 80vh;
  margin: 0 auto 0;
}

.message-list-inner {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 60px;
  padding-bottom: 6vh;
   /* 94 px для каждого сообщения */
}

.message-list-inner::-webkit-scrollbar {
  width: 9px;               /* ширина scrollbar */

}
.message-list-inner::-webkit-scrollbar-track {
  border-radius: 20px;/* цвет дорожки */
  padding-top: 60px;
}
.message-list-inner::-webkit-scrollbar-thumb {
  background-color: #ff9b38;    /* цвет плашки */
  border-radius: 20px;       /* закругления плашки */
  border: 1px solid #af4338;  /* padding вокруг плашки */
}

.opacity {
  opacity: 0;
}

.more-messages {
  height: 1px;
}
</style>