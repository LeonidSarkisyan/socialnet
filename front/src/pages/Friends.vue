<template>
  <div class="content">
    <div class="list-container">
      <FriendPageList
          :friends="filterArray"
          v-if="friends.length > 0"
          @delete-friend="deleteFriend"
      />
      <div class="no-friends" v-else>Вы пока не добавили ни одного друга</div>
      <div class="search">
        <div class="search-text">Поиск друзей:</div>
        <input type="text" class="search-input" v-model="query">
      </div>
    </div>
  </div>
</template>

<script>
import FriendPageList from "@/components/FriendComponents/FriendPageList";
import axios from "axios";
export default {
  name: "Friends",
  components: {
    FriendPageList
  },
  data() {
    return {
      friends: [],
      query: ''
    }
  },
  methods: {
    async fetchFriends() {
      try {
        let id = JSON.parse(localStorage.getItem('user_profile')).id
        const response = await axios.get(`http://127.0.0.1:8000/friend/${id}`).then(response => {
          this.friends = response.data
          console.log(this.friends)
        })
      } catch (e) {
        console.log(e)
      }
    },
    deleteFriend(id) {
      console.log('эй')
      this.friends = this.friends.filter(value => {
        console.log(value)
        return value.friend_id !== id
      })
    }
  },
  computed: {
    filterArray() {
      return this.friends.filter(value => {
        let string = (value.friend.name + value.friend.surname + value.friend.tag_name).toLowerCase()
        return string.includes(this.query.toLowerCase().replace(/\s/g, ""))
      })
    }
  },
  watch: {
    query() {
      console.log(this.query)
    }
  },
  mounted() {
    console.log('Друзья')
    this.fetchFriends()
  }
}
</script>

<style>
.no-friends {
  width: 600px;
  text-align: center;
  color: #ff9b38;
  font-size: 26px;
}

.list-container {
  margin-top: 24px;
  display: flex;
  margin-left: 350px;
}

.list {
  width: 600px;
  background: #252525;
  border-radius: 10px;
  margin-right: 31px;
  margin-bottom: 25px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 42px;
}

.point {
  display: flex;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
}

.point-content {
  display: flex;
  border-bottom: 1px #333333 solid;
  width: 550px;
  padding-bottom: 10px;
}

.point-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.name {
  font-size: 20px;
  line-height: 24px;
  color: #C7493A;
}

.name:hover {
  text-decoration: underline;
}

.type-group {
  color: #EFAC6E;
}

.message {
  line-height: 20px;
  color: #F5B06F;
  cursor: pointer;
}

.message:hover {
  text-decoration: underline;
}

.option {
  position: absolute;
  top: 15px;
  right: 40px;
}

.option-img {
  width: 24px;
}

.point-content:last-child {
  border: 0;
}

.search {
  width: 330px;
  height: 150px;
  background: #252525;
  border-radius: 47px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.search-text {
  font-size: 24px;
  line-height: 29px;
  color: #F5B06F;
  margin-bottom: 14px;
}

.search-input {
  all: unset;
  width: 280px;
  height: 35px;
  background: #474747;
  border-radius: 16px;
  font-weight: 700;
  color: #F5B06F;
  padding-left: 16px;
}
</style>