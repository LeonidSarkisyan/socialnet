<template>
  <div class="content profileX">
    <div class="profile edit" v-show="editMode">
      <div class="edit-title">
        Редактирование профиля
      </div>
      <div class="inputs-edit">
        <div class="window-edit-inputs">
          <input type="text" class="input-text" placeholder="@Никнейм" v-model="tagName">
          <input type="text" class="input-text" placeholder="Имя" v-model="name">
          <input type="text" class="input-text" placeholder="Фамилия" v-model="surname">
          <input type="text" class="input-text" placeholder="Статус" v-model="status">
          <input type="text" class="input-text" placeholder="Город" v-model="city">
        </div>
        <div class="window-edit-avatar">
          <img
              v-show="changedAvatar"
              class="avatar-img edit-avatar"
              @click="openFilesWindow"
              style="cursor: pointer"
              ref="avatarEdit"
          >
          <img
              v-show="!changedAvatar"
              :src="avatarImageUrl"
              class="avatar-img edit-avatar"
              @click="openFilesWindow"
              style="cursor: pointer"
          >
          <input type="file" v-show="false" ref="file" @change="copyFile">
          <div class="buttons">
            <div class="buttonEP edit-ava" @click="openFilesWindow">
              Поменять аватарку
            </div>
            <div class="buttonEP edit-ava red" @click="clearEditAvatar">
              Отменить
            </div>
          </div>
        </div>
      </div>

      <div class="window-edit-inputs">
        <div class="buttonEP" @click="updateProfile">
          Сохранить
        </div>
        <div class="buttonEP red" @click="cancel">
          Отменить
        </div>
      </div>
    </div>
    <div class="profile" v-show="!editMode && loaded">
      <div class="profile-info">
        <div class="profile-avatar" ref="avatarDiv">
          <img :src="avatarImageUrl" class="avatar-img">
        </div>
        <div class="profile-bio">
          <div class="profile-name">
            {{ profile.name }} {{ profile.surname }}
          </div>
          <div class="profile-status">
            {{ profile.status }}
          </div>
          <div class="profile-city">
            Город: {{ profile.city }}
          </div>
        </div>
      </div>
      <div v-if="isProfileOwner" class="profile-edit" @click="TurnOnEditMode">
        Редактировать профиль
      </div>

      <div class="option-friend" v-if="!isProfileOwner">
        <div class="people-add-friend" @click="openChat">
          Написать сообщение
        </div>
        <div v-if="(isFriend || isAccept) && !waitAcceptingRequest && !notOurRequest"
            class="people-add-friend f paf"
            @mouseenter="showFriendMenu"
            @mouseleave="hideFriendMenu"
            ref="friend"
        >
          <div>
            Ваш друг
          </div>
          <div>
            <img src="@/assets/utils/arrow.png" class="arrow-friend">
            <div class="menu-friend" v-if="isShowFriendMenu">
              <span class="delete-friend" @click="deleteFriend">
                Удалить из друзей
              </span>
            </div>
          </div>
        </div>
        <div
            @click="accept"
            class="people-add-friend paf wait-accepting"
            v-if="((isGettingRequestFriend && !isAccept) || (gettingRequestFriend && !isAccept) || waitAcceptingRequest) && !notOurRequest"
        >
          Принять заявку
        </div>
        <div
            v-if="(!isFriend && !isGettingRequestFriend && !isAccept && !gettingRequestFriend) || notOurRequest"
            class="people-add-friend paf"
            @click="requestToFriend"
            ref="friend"
            :class="{'clicked': isRequest}"
        >
          {{ textFriendButton }}
        </div>
      </div>
      <FriendList
          @updateGroups="this.fetchGroup"
          :friends="friends"
          :groups="groups"
      />
<!--      <div class="profile-new-post">-->
<!--        <div class="profile-new-post-avatar">-->
<!--          <img :src="avatarImageUrl" class="img-new-post">-->
<!--        </div>-->
<!--        <input type="text" placeholder="Как прошёл ваш день?">-->
<!--        <img src="@/assets/images/get-file.png" class="get-file">-->
<!--        <img src="@/assets/images/send-icon.png" class="send">-->
<!--      </div>-->
      <div class="profile-option">
        <MyInput 
            v-if="isProfileOwner" 
            :avatarImageUrl="avatarImageUrl"
            @createPost="createPost"
        >
        </MyInput >
        <PostList
            :key="keyPostList"
            @deletePost="deletePost"
            :profile="profile" 
            :avatarImageUrl="avatarImageUrl" 
            :posts="posts"
            :isProfileOwner="isProfileOwner"
            :isLoading="isLoading"
            v-if="posts.length"
        >
        </PostList>
        <div class="not-posts" v-else>Этот пользователь ещё не публиковал записи</div>
      </div>
      <!-- Список постов -->
    </div>

<!--    <div class="list-friends">-->
<!--      <a class="list-friends-text" href="friends.html">Друзья 117</a>-->
<!--      <div class="avatars">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="list-friends top">-->
<!--      <a class="list-friends-text" style="color: #F5B06F;" href="groups.html">-->
<!--        Сообщества 43-->
<!--      </a>-->
<!--      <div class="avatars">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--        <img src="@/assets/images/login.png" class="list-friends-img">-->
<!--      </div>-->
<!--    </div>-->

  </div>
</template>

<script>
import axios from 'axios'
import PostList from "@/components/PostList";
import MyInput from "@/components/MyInput";
import MyProfileOption from "@/components/MyProfileOption";
import FriendList from "@/components/FriendComponents/FriendList";
export default {
  name: "MyProfile",
  components: {
    MyInput, PostList, MyProfileOption, FriendList
  },
  data() {
    return {
      changedAvatar: false,
      name: '',
      surname: '',
      tagName: '',
      status: '',
      city: '',

      loaded: false,
      editMode: false,
      notOurRequest: false,
      waitAcceptingRequest: false,
      isShowFriendMenu: false,
      keyOption: 0,
      avatarImageUrl: null,
      userId: this.$route.params.tagName,
      profile: {},
      posts: [],
      isProfileOwner: null,
      isLoading: false,
      keyPostList: 0,
      isRequest: false,
      textFriendButton: 'Добавить в друзья',
      request: null,
      friendRequests: [],
      pool: false,
      friends: [],
      groups: [],
      fromRequests: [],
      isAccept: false,
      gettingRequestFriend: false,
      acceptFriend: false,
    }
  },
  methods: {
    fetchGroup() {
      axios.get(`http://127.0.0.1:8000/groups/subscribed/${this.profile.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        this.groups = response.data
        console.log('сообщества подписанные', this.groups)
      })
    },
    openChat() {
      let newChat = {
        profile_first_id: JSON.parse(localStorage.getItem('user_profile')).id,
        profile_second_id: this.profile.id
      }
      axios.post(`http://127.0.0.1:8000/chats/`, newChat).then(response => {
        console.log(response.data)
        this.$router.push(
            {
              name: 'chats',
              params: {
                id: this.profile.id
              }
            }
        )
      })
    },
    verifyEditAvatar(file) {
      let fileName = file.name
      let exe = fileName.split('.').pop().toLowerCase()
      if (exe === 'jpg' || exe === 'png' || exe === 'jpeg') {
        this.showFile(file)
      } else {
        alert('Недопустимый формат файла! (Нужен jpg, jpeg, png)')
      }
    },
    clearEditAvatar() {
      this.changedAvatar = false
      this.$refs.file.value = ''
    },
    copyFile(event) {
      let file = this.$refs.file.files[0];
      this.verifyEditAvatar(file)
    },
    showFile(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        this.$refs.avatarEdit.src = reader.result
        this.changedAvatar = true
      }
    },
    openFilesWindow() {
      this.$refs.file.click()
    },
    validateBeforeUpdateProfile() {
      return this.name.length > 0 && this.surname.length > 0 && this.status.length > 0 && this.tagName.length > 0 && this.city.length > 0
    },
    setModels() {
      this.name = this.profile.name
      this.surname = this.profile.surname
      this.status = this.profile.status
      this.tagName = this.profile.tag_name
      this.city = this.profile.city
      this.$refs.file.value = ''
      this.changedAvatar = false
    },
    updateProfile() {
      if (!this.validateBeforeUpdateProfile()) {
        alert('Поля не могут быть пустыми!')
      } else {
        let id = JSON.parse(localStorage.getItem('user_profile')).id
        let body = {
          name: this.name,
          surname: this.surname,
          status: this.status,
          tag_name: this.tagName,
          city: this.city,
        }
        axios.patch(`http://127.0.0.1:8000/profile/${id}`, body).then(response => {
          this.profile = response.data

          if (this.changedAvatar) {
            let formData = new FormData();
            formData.append('file', this.$refs.file.files[0])

            axios.post('http://127.0.0.1:8000/profile/avatar/change', formData,
      {
            headers: {
                    'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
                    'Content-Type': 'multipart/form-data'
                  }
              }
            ).then(response => {
              console.log(response.data)
              window.location.reload(true)
            })
          }

          this.$router.push({
            name: `profile`,
            params: {
              tagName: response.data.tag_name
            }
          })
          this.cancel()
        })
      }
    },
    cancel() {
      this.editMode = false
    },
    TurnOnEditMode() {
      this.setModels()
      this.editMode = true
    },
    async accept() {
      const response = await axios.post(`http://127.0.0.1:8000/requestsfriends/${this.request.id}/accept`).then(response => {
        this.waitAcceptingRequest = false
        this.isAccept = true
      })
    },
    async fetchRequestFriends() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/requestsfriends/${this.profile.id}`).then(response => {
          this.fromRequests = response.data
        })
      } catch (e) {
        console.log(e)
      }
    },
    deleteFriend() {
      axios.delete(`http://127.0.0.1:8000/friend/delete/${this.profile.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
        }
      }).then(response => {
        console.log(response.data)
        if (response.data === 'friend is deleted') {
          console.log('Нужно удалять вашу заявку!')
          this.notOurRequest = true
          this.validateRequest()
        } else {
          this.waitAcceptingRequest = true
          this.validateRequest()
        }
      })
    },
    hideFriendMenu() {
      this.$refs.friend.style.borderBottomRightRadius = 8 + 'px'
      this.$refs.friend.style.borderBottomLeftRadius = 8 + 'px'
      this.isShowFriendMenu = false
    },
    showFriendMenu() {
      this.$refs.friend.style.borderBottomRightRadius = 0
      this.$refs.friend.style.borderBottomLeftRadius = 0
      this.isShowFriendMenu = true
    },
    async fetchFriends() {
      this.friends = []
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      try {
        const response = await axios.get(`http://127.0.0.1:8000/friend/${this.profile.id}`).then(response => {
          this.friends = response.data
          console.log(`Список друзей ${this.profile.name} ${this.profile.surname}:`, this.friends)
        })
      } catch (e) {
        console.log(e)
      }
    },
    validateRequest() {
      this.pool = false
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      axios.get(`http://127.0.0.1:8000/requestsfriends/${id}`).then(response => {
        console.log(this.profile.id)
        for (let request of response.data) {
          if (this.profile.id === request.profile_to_id) {
            this.pool = true
            this.request = request
          }
        }
        if (this.pool) {
          this.isRequest = true
          this.textFriendButton = 'Заявка отправлена'
        } else {
          this.isRequest = false
          this.textFriendButton = 'Добавить в друзья'
        }
      })
    },
    changeLook() {
      this.isRequest = !this.isRequest
      console.log(this.isRequest)
      if (this.isRequest) {
        this.textFriendButton = 'Заявка отправлена'
      } else {
        this.textFriendButton = 'Добавить в друзья'
      }
    },
    sendRequestToFriend() {
      if (this.isRequest) {
        let newRequest = {
          profile_from_id: JSON.parse(localStorage.getItem('user_profile')).id,
          profile_to_id: this.profile.id
        }
        axios.post('http://127.0.0.1:8000/requestsfriends/', newRequest).then(response => {
          console.log(response)
          this.request = response.data
        })
      } else {
        axios.delete(`http://127.0.0.1:8000/requestsfriends/${this.request.id}`).then(response => {
          console.log(response.data)
        })
      }
    },
    requestToFriend() {
      this.changeLook()
      this.sendRequestToFriend()
    },
    async fetchAvatar(id) {
      fetch(`http://127.0.0.1:8000/profile/avatar/${this.profile.id}`).then(response => {
        response.blob().then(blob => {
          this.avatarImageUrl = window.URL.createObjectURL(blob)
        }).catch(e => {
          console.log(e)
        })
      })
    },
    async fetchPosts() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/posts/${this.profile.id}`).then(response => {
          this.posts = response.data
        })
      } catch (error) {
        console.log(error)
      }
    },
    async addPost(newPost, files) {
        const response = await axios.post('http://127.0.0.1:8000/posts/', newPost).then(response => {
          let postId = response.data.id

          if (files.length > 0) {
            this.addFilesToPost(postId, files, response.data)
          } else {
            this.isLoading = false
            this.posts.unshift(response.data)
          }
        })
    },
    addFilesToPost(id, files, data) {
      let formData = new FormData();
      for (let file of files) {
        formData.append('files', file)
      }
      axios.post(`http://127.0.0.1:8000/posts/images/${id}`, formData).then(response => {
        this.posts.unshift(data)
        this.isLoading = false
      })
    },
    createPost(newPost, files) {
      this.isLoading = true
      this.addPost(newPost, files)
    },
    deletePost(id) {
      this.posts = this.posts.filter((post) => {
        return post.id !== id
      })
    },
    updatePostList() {
      this.$store.commit('updateKeyPostList')
    },
  },
  computed: {
    isFriend() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      let index = this.friends.findIndex(value => value.friend_id === id)
      return index !== -1
    },
    isGettingRequestFriend() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      let arrayAcceptFalses = this.fromRequests.filter(value => {
        return value.accept === false
      })
      let index = arrayAcceptFalses.findIndex(value => {
        return value.profile_to_id === id
      })
      if (index !== 1) {
        this.request = arrayAcceptFalses[index]
      }
      return index !== -1
    }
  },
  mounted() {
    if (!localStorage.getItem('JWT')) {
      this.$router.push({name: 'register'})
    }
    axios
        .get(`http://127.0.0.1:8000/profile/${this.userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          this.profile = response.data
          this.validateRequest()
          if (this.profile.id == JSON.parse(localStorage.getItem('user_profile')).id) {
            this.isProfileOwner = true
          } else {
            this.isProfileOwner = false
          }
          this.fetchRequestFriends()
          this.fetchFriends()
          this.fetchPosts()
          this.fetchGroup()
          this.loaded = true
        }).catch(() => {
      this.$emit('logout')
    })

    fetch(`http://127.0.0.1:8000/profile/avatar/${this.userId}`).then(response => {
      response.blob().then(blob => {
        this.avatarImageUrl = window.URL.createObjectURL(blob)
      })
    })

    // WebSocket писать тут

  },
  watch: {
    '$route.path'() {
      console.log('Был переход по ссылке!')
      this.keyOption += 1
      let tagName = this.$route.params.tagName
      axios
          .get(`http://127.0.0.1:8000/profile/${tagName}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            this.profile = response.data
            this.validateRequest()
            if (this.profile.id == JSON.parse(localStorage.getItem('user_profile')).id) {
              this.isProfileOwner = true
            } else {
              this.isProfileOwner = false
            }
            this.fetchRequestFriends()
            this.fetchFriends()
            this.fetchPosts()
            this.fetchGroup()
            this.loaded = true
            console.log(this.isProfileOwner)
          })

      fetch(`http://127.0.0.1:8000/profile/avatar/${tagName}`).then(response => {
        response.blob().then(blob => {
          this.avatarImageUrl = window.URL.createObjectURL(blob)
        })
      })
    },
    '$store.state.idPostDeleted'() {
      this.deletePost(this.$store.state.idPostDeleted)
      this.$store.commit('nullIdPostDeleted')
    },
    '$store.state.idRequestSending'() {
      if (this.profile.id === this.$store.state.idRequestSending) {
        this.gettingRequestFriend = true
        this.request = {}
        this.request.id = this.$store.state.idRequest
        console.log('Доступный рек айди:', this.request.id)
      }
    },
    '$store.state.idAcceptSending'() {
      console.log('поменялось!')
      console.log(this.$store.state.idAcceptSending)
      console.log(this.profile.id, 'profile id')
      if (this.profile.id === this.$store.state.idAcceptSending) {
        this.isAccept = true
      }
    }
  },
}
</script>

<style>


.inputs-edit {
  display: flex;
}

.buttonEP {
  font-weight: 700;
  color: #fff;
  padding: 10px 15px;
  border-radius: 4px;
  display: inline-block;
  background: #006633;
  margin-right: 15px;
  margin-top: 10px;

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  cursor: pointer;
  transition: 0.325s;
}

.buttonEP:hover {
  background: #33CC33;
}

.red {
  background: #990000;
}

.red:hover {
  background: #FF0000;
}

.window-edit-inputs {
  margin-left: 35px;
}

.input-text {
  display: block;
  width: 360px;
  height: 40px;
  margin-bottom: 10px;
  font-size: 20px;
  color: white;
  background: #383838;
  border-radius: 4px;
  padding-left: 15px;
  transition: 0.15s;
}

.input-text:hover {
  background: #545454;
}

.input-text:focus {
  background: #b6b6b6;
  color: black;
  font-weight: 700;
}

.edit-title {
  font-size: 36px;
  color: #ff9b38;
  margin-left: 35px;
  margin-bottom: 20px;
}

.delete-friend:hover {
  text-decoration: underline;
  cursor: pointer;
}

.menu-friend {
  width: 250px;
  background: #383838;
  position: absolute;
  padding: 10px;
  border-top: #252525 solid 1px;
  top: 100%;
  left: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.arrow-friend {
  width: 20px;
  transform: rotate(-90deg);
  position: absolute;
  right: 10px;
  top: 12px;
  display: block;
}

.people-add-friend {
  position: relative;
  width: 250px;
  color: #cccccc;
  background: rgba(44, 43, 43, 0.75);
  padding: 10px 10px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  /*margin-left: 50px;*/
  margin-top: 35px;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  text-align: center;
}

.clicked {
  background: #383737;
}

.option-friend {
  display: flex;
  align-items: center;
  width: 600px;
  justify-content: space-between;
  margin-left: 35px;
  margin-bottom: 50px;
}

.not-posts {
  font-size: 20px;
  font-weight: 700;
  color: #DC8C40;
  margin-left: 160px;
  margin-top: 50px;
}
.profile {
  margin-top: 16px;
  margin-left: 350px;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-bio {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 35px;
  margin-right: 50px;
}

.profile-name {
  font-size: 32px;
  line-height: 44px;
  color: #C7493A;
}

.profile-status {
  line-height: 20px;
  color: #F5B06F;
  width: 330px;
}

.profile-date-birth {
  line-height: 20px;
  color: #DC8C40;
}

.profile-city {
  line-height: 20px;
  color: #DC8C40;
}

.profile-edit {
  font-weight: 700;
  line-height: 20px;
  color: #212121;
  padding: 11px 9px;
  background: #C7493A;
  display: inline-block;
  border-radius: 10px;
  margin-left: 35px;
  margin-top: 21px;
  cursor: pointer;
  transition: color, background-color 0.25s;
}

.profile-edit:hover {
  color: #C7493A;
  background-color: #212121;
  outline: 2px #C7493A solid;
}

.profile-new-post {
  background: #4B4B4B;
  border-radius: 10px;
  width: 650px;
  display: flex;
  align-items: center;
  margin-left: 35px;
  margin-top: 21px;
}

input {
  all: unset;
}

.profile-new-post input {
  height: 48px;
  width: 75%;
  display: block;
  font-size: 20px;
  line-height: 20px;
  color: #ffffff;
}

.margin {
  margin-left: 35px;
}

.list-friends {
  background: #252525;
  border-radius: 10px;
  padding-top: 16px;
  padding-left: 18px;
  padding-right: 18px;
  padding-bottom: 16px;
  display: inline-block;
  position: fixed;
  top: 220px;
  left: 1100px;
}

.top {
  top: 460px;
}

.list-friends-text {
  line-height: 20px;
  color: #C7493A;
  font-weight: 700;
  margin-bottom: 10px;
  margin-left: 8px;
  display: inline-block;
  text-decoration: none;
}

.avatars {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 330px;
}

.list-friends-img {
  margin-bottom: 6px;
}

.add-friend {
  background: #404040;
  border-radius: 40px;
  margin-left: 35px;
  margin-top: 21px;
  width: 285px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  line-height: 24px;
  color: #F5B06F;
  cursor: pointer;
  transition: 0.3s;
}

.add-friend:hover {
  transform: scale(1.1);
  background: #5e5e5e;
}

.add-panels {
  display: flex;
  justify-content: space-around;
  width: 685px;
}

.img-new-post {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 5px;
  margin-left: 15px;
  margin-right: 15px;
}

.f {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #383838;
  transition: 0.3s;
}

.f:hover {
  background: #4d4d4d;
  cursor: auto;
}

.wait-accepting {
  background: #333333;
}

.wait-accepting:hover {
  background: #444444;
}

.edit-avatar {
  display: block;
  margin-left: 100px;
}

.edit-ava {
  display: block;
  margin-left: 75px;
  margin-top: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>