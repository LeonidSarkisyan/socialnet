<template>
  <div class="peoples-item" v-show="loaded">
    <div class="people-avatar">
      <router-link :to="{name: 'group', params: {tagName: group.tag_name}}">
        <img :src="avatarUrl" class="people-avatar">
      </router-link>
    </div>
    <div class="name-and-surname">
      <div class="people-name">
        <router-link
            :to="{name: 'group', params: {tagName: group.tag_name}}"
            style="text-decoration: none; color: #f64949; cursor: pointer"
        >
          <span>{{ group.title }}</span>
        </router-link>
      </div>
      <div class="people-city">{{ group.genre }}</div>
      <div class="people-city">Подписчиков: {{ subscribers.length }}</div>
    </div>

    <div
        class="people-add-friend"
        v-show="!isSub"
        @click="subscribe"
    >
      Подписаться
    </div>
    <div
        class="people-add-friend subbed"
        v-show="isSub"
        @click="unSubscribe"
    >
      Вы подписаны
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GroupItem",
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      avatarUrl: null,
      loaded: false,
      subscribers: []
    }
  },
  methods: {
    unSubscribe() {
      axios.delete(`http://127.0.0.1:8000/groups/subscribe/${this.group.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        this.fetchSubscribers()
      })
    },
    subscribe() {
      axios.get(`http://127.0.0.1:8000/groups/subscribe/${this.group.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        this.fetchSubscribers()
      })
    },
    fetchAvatar() {
      fetch(`http://127.0.0.1:8000/groups/avatar/${this.group.id}`).then(response => {
        response.blob().then(blob => {
          this.avatarUrl = window.URL.createObjectURL(blob)
          this.fetchSubscribers()
        })
      })
    },
    fetchSubscribers() {
      axios.get(`http://127.0.0.1:8000/groups/subscribe/all/${this.group.id}`).then(response => {
        this.subscribers = response.data
        console.log('Подписчики: ', this.subscribers)
        this.loaded = true
      })
    }
  },
  computed: {
    isSub() {
      let sub = this.subscribers.find(value => {
        return value.profile_id === JSON.parse(localStorage.getItem('user_profile')).id
      })
      if (sub) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.fetchAvatar()
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

.subbed {
  background: #343434;
}
</style>