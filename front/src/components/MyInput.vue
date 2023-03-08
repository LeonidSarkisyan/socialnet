<template>
  <div class="profile-new-post-container">
    <div class="profile-new-post">
      <div class="profile-new-post-avatar">
        <img :src="avatarImageUrl" class="img-new-post">
      </div>
      <input type="text" placeholder="Что нового?" v-model="postText" @keyup.enter="createPost">
      <img src="@/assets/images/get-file.png" class="get-file" @click="addFiles">
      <img src="@/assets/images/send.png" class="send degree" @click="createPost">
    </div>
    <div class="profile-photos" v-show="this.fileList.length > 0">
      <input type="file" multiple="multiple" v-show="false" ref="file" @change="copyFiles">
      <transition-group name="photo">
        <FilesItem
            @deleteFile="deleteFile"
            :file="file"
            v-for="file in fileList"
            :key="file"
        />
      </transition-group>
    </div>

  </div>

</template>

<script>
import FilesItem from "@/components/FilesItem";
export default {
  name: "MyInput",
  components: {
    FilesItem
  },
  props: {
    avatarImageUrl : {},
  },
  data() {
    return {
      postText: '',
      fileList: []
    }
  },
  methods: {
    validateText() {
      if (this.postText.length || this.fileList.length !== 0) {
        return true
      } else {
        return false
      }
    },
    createPost() {
      let accept = this.validateText()
      if (!accept) {
        alert('Пустой пост!')
      } else {
        let newPost = {
          text: this.postText,
          profile_id: JSON.parse(localStorage.getItem('user_profile')).id
        }
        this.$emit('createPost', newPost, this.fileList)
        this.postText = ''
        this.fileList = []
      }
    },
    addFiles() {
      this.$refs.file.click()
    },
    copyFiles() {
      if (this.fileList.length === 0) {
        const dt = new DataTransfer()
        for (let file of this.$refs.file.files) {
          dt.items.add(file)
        }
        if (dt.files.length > 10) {
          alert('Нельзя загружать больше 10 изображений!')
        } else {
          this.fileList = [...dt.files]
        }
      } else {
        const dt = new DataTransfer()
        for (let file of this.$refs.file.files) {
          dt.items.add(file)
        }
        if (this.fileList.length + dt.files.length > 10) {
          alert('Нельзя загружать больше 10 изображений!')
        } else {
          this.fileList = [...this.fileList, ...dt.files]
        }
      }
      console.log('file list:', this.fileList)
      console.log(Array.isArray(this.fileList))
      this.showFiles()
    },
    showFiles() {
      for (let file in this.fileList) {
        let reader = new FileReader()
        reader.readAsDataURL(this.fileList[file])
        reader.onloadend = () => {
          this.$refs.image.src = reader.result
        };
      }
    },
    deleteFile(file) {
      this.fileList = this.fileList.filter(value => {
        return value !== file
      })
    }
  }
}
</script>

<style scoped>
.photo-enter-active, .photo-leave-active {
  transition: 0.25s;
}

.photo-enter-from, .photo-leave-to {
  opacity: 0;
  transform: scale(0);
}

.photo-item-move {
  transition: 0.4s;
}
.profile-photos {
  background: #4B4B4B;
  border-radius: 10px;
  width: 630px;
  margin-left: 35px;
  margin-top: 21px;
  padding: 10px 10px 0;
  display: flex;
  flex-wrap: wrap;
}

.send {
  height: 40px;
  cursor: pointer;
  transition: 0.15s;
}

.send:hover {
  transform: scale(0.75);
}

.get-file {
  width: 32px;
  cursor: pointer;
  margin-right: 8px;
  transition: 0.15s;
}

.get-file:hover {
  transform: scale(0.75);
}


</style>