<template>
  <div class="peoples-item">
    <div class="people-avatar">
      <router-link :to="{name: 'profile', params: {tagName: profile.tag_name}}">
        <img :src="avatarUrl" class="people-avatar">
      </router-link>
    </div>
    <div class="name-and-surname">
      <div class="people-name">
        <router-link
            :to="{name: 'profile', params: {tagName: profile.tag_name}}"
            style="text-decoration: none; color: #f64949; cursor: pointer"
        >
          <span>{{ profile.name }} {{ profile.surname }}</span>
        </router-link>
      </div>
      <div class="people-city">{{ profile.city }}</div>
    </div>

    <div
        class="people-add-friend-active"
        v-if="(isFriend || acceptFriend) && !addFriend"
        @mouseenter="showContextMenu"
        @mouseleave="hideFriendMenu"
        ref="friend"
    >
      Ваш друг
      <div>
        <img src="@/assets/utils/arrow.png" class="arrow-friend">
        <div class="menu-friend" v-if="isShowContextMenu">
          <span class="delete-friend" @click="deleteFriend">
            Удалить из друзей
          </span>
        </div>
      </div>
    </div>
    <div
        class="people-add-friend wait-accept"
        v-if="((isGettingRequestFriend && !acceptFriend) || (gettingRequestFriend && !acceptFriend)) && !addFriend"
        @click="accept"
    >
       Принять заявку
    </div>
    <div
        class="people-add-friend"
        :class="{'pool': pool}"
        @click="requestToFriend"
        v-if="(!isOwner && !isFriend && !isGettingRequestFriend && !gettingRequestFriend && !acceptFriend) || addFriend"
    >
      {{ textRequest }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PeopleItem",
  props: {
    profile: {
      type: Object,
      required: true
    },
    requests: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      addFriend: false,
      acceptFriend: false,
      gettingRequestFriend: false,
      avatarUrl: null,
      pool: false,
      textRequest: 'Добавить в друзья',
      request: null,
      needUpdate: true,
      isOwner: false,
      friends: [],
      fromRequests: [],
      isShowContextMenu: false,

    }
  },
  methods: {
    deleteFriend() {
      this.isShowContextMenu = false
      axios.delete(`http://127.0.0.1:8000/friend/delete/${this.profile.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.data == 'friend is deleted') {
          this.addFriend = true
          this.pool = false
          this.textRequest = 'Добавить в друзья'
        } else {

        }
      })
    },
    hideFriendMenu() {
      this.isShowContextMenu = false
    },
    showContextMenu() {
      this.isShowContextMenu = true
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
    async fetchFriends() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      try {
        const response = await axios.get(`http://127.0.0.1:8000/friend/${this.profile.id}`).then(response => {
          this.friends = response.data
        })
      } catch (e) {
        console.log(e)
      }
    },
    fetchAvatar() {
      fetch(`http://127.0.0.1:8000/profile/avatar/${this.profile.tag_name}`).then(response => {
        response.blob().then(blob => {
          this.avatarUrl = window.URL.createObjectURL(blob)
        })
      })
    },
    validateRequest() {
      if (this.needUpdate) {
        for (let request of this.requests) {
          if (this.profile.id === request.profile_to_id) {
            this.pool = true
            this.textRequest = 'Заявка отправлена'
            this.request = request
          }
        }
      }
    },
    requestToFriend() {
      this.needUpdate = false
      if (this.pool) {
        this.textRequest = 'Добавить в друзья'
        this.pool = false
        axios.delete(`http://127.0.0.1:8000/requestsfriends/${this.request.id}`).then(response => {
          console.log(response.data)
        })
      } else {
        this.textRequest = 'Заявка отправлена'
        this.pool = true
        let newRequest = {
          profile_from_id: JSON.parse(localStorage.getItem('user_profile')).id,
          profile_to_id: this.profile.id
        }
        axios.post('http://127.0.0.1:8000/requestsfriends/', newRequest).then(response => {
          this.request = response.data
          console.log(this.request)
        })
      }
    },
    async accept() {
      const response = await axios.post(`http://127.0.0.1:8000/requestsfriends/${this.request.id}/accept`).then(response => {
        this.acceptFriend = true
      })
    }
  },
  computed: {
    isOwner() {
      return this.profile.id === JSON.parse(localStorage.getItem('user_profile')).id
    },
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
  watch: {
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
      if (this.profile.id === this.$store.state.idAcceptSending) {
        this.acceptFriend = true
      }
    }
  },
  mounted() {
    this.fetchAvatar()
    this.validateRequest()
    this.fetchFriends()
    this.fetchRequestFriends()
  },
  updated() {
    this.validateRequest()
  }
}
</script>

<style scoped>
.menu-friend {
  width: 280px;
  background: #383838;
  position: absolute;
  padding: 10px;
  border-top: #252525 solid 1px;
  top: 100%;
  left: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.peoples-item {
  margin-bottom: 35px;
  display: flex;
  position: relative;
}

.name-and-surname {

}

.people-name {
  color: #f64949;
  font-size: 20px;
}

.people-name:hover {
  text-decoration: underline;
}

.people-city {
  color: #DC8C40;
  margin-top: 10px;
}

.people-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 35px;
  cursor: pointer;
}

.peoples-item:last-child {
  margin-bottom: 0px;
}

.people-add-friend-active {
  color: #c2c2c2;
  background: rgb(56, 56, 56);
  position: absolute;
  padding: 10px 25px;
  border-radius: 8px;
  font-size: 20px;
  top: 0;
  right: 0;
  cursor: pointer;
  width: 250px;
  text-align: center;
  transition: 0.325s;
}

.people-add-friend-active:hover {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.people-add-friend {
  color: #e0e0e0;
  background: rgba(42, 41, 41, 0.75);
  position: absolute;
  padding: 10px 25px;
  border-radius: 8px;
  font-size: 20px;
  top: 0;
  right: 0;
  cursor: pointer;
  margin-top: 0;
}

.people-add-friend:hover {
  background: rgba(58, 58, 58, 0.75);
}

.pool {
  background: #424242;
}

.wait-accept {
  background: #383838;
}
</style>