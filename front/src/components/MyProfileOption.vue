<template>
  <div class="option-friend">
    <div class="people-add-friend">
      Написать сообщение
    </div>
    <div class="people-add-friend paf" @click="requestToFriend" ref="friend" :class="{'clicked': isRequest}">
      {{ textFriendButton }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyProfileOption",
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isRequest: false,
      textFriendButton: 'Добавить в друзья',
      request: null,
      friendRequests: []
    }
  },
  methods: {
    validateRequest() {
      console.log('Будет проверено')
      console.log(this.profile.id)
      for (let request of this.friendRequests) {
        if (this.profile.id === request.profile_to_id) {
          console.log('пук')
        }
      }
    },
    getRequest() {
      let id = JSON.parse(localStorage.getItem('user_profile')).id
      axios.get(`http://127.0.0.1:8000/requestsfriends/${id}`).then(response => {
        this.friendRequests = response.data
        this.validateRequest()
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
          profile_to_id: this.profile_id
        }
        axios.post('http://127.0.0.1:8000/requestsfriends/', newRequest).then(response => {
          console.log(response)
        })
      } else {

      }
    },
    requestToFriend() {
      this.changeLook()
      this.sendRequestToFriend()
    }
  },
  mounted() {
    console.log(this.profile)
    this.getRequest()
  },
}
</script>

<style scoped>
.people-add-friend {
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

.paf {
  /*margin-left: 45px;*/
}
</style>