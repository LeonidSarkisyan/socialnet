<template>
  <div class="chat-input">
    <!-- Edit mode === false -->
    <input
        v-if="!editMode"
        type="text"
        class="input-chat"
        placeholder="Напишите сообщение..."
        @keyup.enter="writeMessage"
        v-model="text"
    >
    <img
        v-if="!editMode"
        src="@/assets/images/send.png"
        class="send degree"
        @click="writeMessage"
    >
    <!-- Edit mode === true -->
    <div class="edit-message" v-if="editMode">
      <div style="margin-right: 15px;">
        Редактирование сообщения
      </div>
      <div class="close-edit-message" @click="this.closeEditMode">
        &#10006;
      </div>
    </div>
    <input
      v-if="editMode"
      type="text"
      class="input-chat"
      @keyup.enter="updateMessage"
      v-model="editMessage.text"
    >
    <img
        v-if="editMode"
        src="@/assets/images/send.png"
        class="send degree"
        @click="updateMessage"
    >
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatInput",
  props: {
    editMessage: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      text: '',
      editText: '',
    }
  },
  methods: {
    copyEditText() {
      this.editText = this.editMessage.text
    },
    closeEditMode() {
      this.editMessage.text = this.editText
      this.$emit('editTurnOff')
    },
    updateMessage() {
      if (this.editMessage) {
        console.log('Отправляем сообщение на обновление...')
        axios.patch(`http://127.0.0.1:8000/messages/${this.editMessage.id}?new_text=${this.editMessage.text}`)
            .then(response => {
                console.log(response.data)
                this.editMessage.datetime_update_float = new Date()
                this.$emit('editTurnOff')
            })
      } else {
        console.log('Пока нет сообщения для обновления!')
      }
    },
    writeMessage() {
      if (this.text.length > 0) {
        this.$emit('writeMessage', this.text)
      }
      this.text = ''
    },
    typing() {
      this.$emit('typing')
    }
  },
  watch: {
    editMode() {
      if (this.editMode) {
        this.copyEditText()
      }
    },
    text() {
      this.typing()
    }
  }
}
</script>

<style scoped>
.chat-input {
  position: absolute;
  top: 75vh;
  left: 10%;
  right: 10%;
  background: #252525;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 7px 6px;
}

.input-chat {
  color: #ffffff;
  width: 100%;
  background: #252525;
  border-radius: 0;
  padding-left: 10px;
}

.send {
  height: 40px;
  cursor: pointer;
  transition: 0.15s;
}

.send:hover {
  transform: scale(0.75);
}

.edit-message {
  position: absolute;
  top: -60%;
  right: 25px;
  padding: 8px 8px 8px;
  background: #252525;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: white;
  display: flex;
  align-items: center;
}

.close-edit-message {
  margin-top: -1px;
  cursor: pointer;

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;

}
</style>