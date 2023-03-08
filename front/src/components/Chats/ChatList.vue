<template>
  <div class="chats-list">
    <ChatListItem
        :typing-chats-id="typingChatsId"
        :selectChatId="selectedChatId"
        @selectChat="selectChat"
        @deleteChatId="deleteChatId"
        :chat="chat"
        v-for="chat in chats"
        :key="chat.id"
    />
  </div>
</template>

<script>
import ChatListItem from "@/components/Chats/ChatListItem";
export default {
  name: "ChatList",
  components: {
    ChatListItem
  },
  props: {
    chats: {
      type: Array,
      required: true
    },
    selectedChatId: {
      type: Number,
      required: true
    },
    typingChatsId: {
      type: Array,
      required: true
    }
  },
  methods: {
    deleteChatId(id) {
      this.$emit('deleteChatId', id)
    },
    selectChat(id) {
      this.$emit('selectChat', id)
    }
  }
}
</script>

<style scoped>
.chats-list {
  padding: 8px;
  border-top: 1px #000000 solid;
  border-right: 1px #000000 solid;
  width: 25%;
  background-color: #212121;
  height: 78vh;
  overflow-y: auto;
  padding-bottom: 25px;
}

.chats-list::-webkit-scrollbar {
  width: 9px;               /* ширина scrollbar */

}
.chats-list::-webkit-scrollbar-track {
  border-radius: 20px;/* цвет дорожки */
  padding-top: 60px;
}
.chats-list::-webkit-scrollbar-thumb {
  background-color: #ff9b38;    /* цвет плашки */
  border-radius: 20px;       /* закругления плашки */
  border: 1px solid #af4338;  /* padding вокруг плашки */
}
</style>