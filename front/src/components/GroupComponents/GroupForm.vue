<template>
  <div class="group-form">
    <input type="text" placeholder="Название" class="input-text" v-model="title">
    <input type="text" placeholder="Жанр, например: Кино, Спорт, СМИ" class="input-text" v-model="genre">
    <input
        type="text"
        placeholder="@TagName"
        class="input-text"
        v-model="tagName"
        :class="{'error-input': error.length > 0}"
    >
    <input type="file" v-show="false" ref="file" @change="loadFile">
    <div class="group-menu-wrapper">
      <div class="chooseFileMenu">
        <div class="chooseFile" @click="openChooseFileWindow">
          Загрузить аватарку
        </div>
        <div class="group-avatar">
          <div class="black-avatar" v-show="!avatarLoaded"></div>
          <img src="" ref="avatar" v-show="avatarLoaded" class="avatar">
        </div>
        <div class="file-name">
          {{ fileName }}
        </div>
      </div>
      <div class="form-menu">
        <div class="button" @click="createGroup">
          Создать сообщество
        </div>
      </div>
      <div class="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "GroupForm",
  data() {
    return {
      title: '',
      genre: '',
      tagName: '',
      error: '',
      fileName: '',
      avatarLoaded: false,
    }
  },
  methods: {
    subscribe(data) {
      axios.get(`http://127.0.0.1:8000/groups/subscribe/${data.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response)
        this.goToGroup(data)
      })
    },
    loadFileToServer(oldResponse) {
      let formData = new FormData()
      formData.append("file", this.$refs.file.files[0])
      formData.append('group_id', oldResponse.data.id)
      axios.post('http://127.0.0.1:8000/groups/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`
        }
      }).then(response => {
        console.log(response.data)
        this.subscribe(oldResponse.data)
      })
    },
    loadFile() {
      let reader = new FileReader()
      reader.readAsDataURL(this.$refs.file.files[0]);
      reader.onloadend = () => {
        this.$refs.avatar.src = reader.result
        this.avatarLoaded = true
      }
    },
    openChooseFileWindow() {
      this.$refs.file.click()
    },
    createGroup() {
      const newGroup = {
        title: this.title,
        genre: this.genre,
        tag_name: this.tagName
      }
      axios.post('http://127.0.0.1:8000/groups/', newGroup, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response.data)
        this.loadFileToServer(response)
      }).catch(error => {
        console.log(error)
        if (error.response.status === 403) {
          this.error = 'TagName такой уже существует!'
        }
      })
    },
    goToGroup(group) {
      this.$router.push({
        name: 'group',
        params: {
          tagName: group.tag_name
        }
      })
    }
  }
}
</script>

<style scoped>
.group-menu-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.black-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: black;
  margin: 15px 0 15px;
}

.chooseFile {
  padding: 10px 15px;
  border-radius: 10px;
  background: #858585;
  font-weight: 700;
  color: white;
  display: inline-block;
  user-select: none;
  cursor: pointer;
}

.chooseFile:hover {
  background: #cccccc;
}

.button {
  user-select: none;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
  background: #939393;
  font-weight: 700;
  display: inline-block;
  transition: 0.15s;
}

.button:hover {
  background: #bebebe;
  transform: translateY(-2px);
}

.group-form {
  padding: 15px;
}

.input-text {
  margin: 0 auto 10px;
  display: block;
  width: 95%;
  height: 40px;
  font-size: 20px;
  color: white;
  background: #383838;
  border-radius: 4px;
  transition: 0.15s;
}

.form-menu {
  display: flex;
  align-items: center;
  justify-content: center;
}

.error {
  color: #dc0000;
  margin-top: 15px;
}

.error-input {
  background: #ec6b5c;
  color: white;
}

.error-input:focus {
  background: #ec6b5c;
  color: #ffffff;
  font-weight: 700;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  padding: 0;
  margin: 15px 0 15px;
}

.group-avatar {
  display: flex;
  justify-content: center;
}
</style>