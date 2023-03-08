<template>
  <div class="profile" v-show="loaded">
    <div class="profile-info">
      <div class="profile-avatar" ref="avatarDiv">
        <img :src="avatarBlob" class="avatar-img">
      </div>
      <div class="profile-bio">
        <div class="profile-name">
          {{ group.title }}
        </div>
        <div class="profile-status">
          {{ group.genre }}
        </div>
        <div class="profile-city">
          Подписчиков: {{ subscribers.length }}
        </div>
      </div>
    </div>
    <MyGroupMenu
        @subPlus="fetchSubs"
        :group="group"
        :isSub="isSub"
    />
    <GroupSubscribers/>
    <MyInput
        v-if="isMyGroup"
        :avatarImageUrl="avatarBlob"
        @createPost="createPost"
    >
    </MyInput >
  </div>
</template>

<script>
import axios from "axios";
import MyInput from "@/components/MyInput";
import MyGroupMenu from "@/components/GroupComponents/MyGroupMenu";
import GroupSubscribers from "@/components/GroupComponents/GroupSubscribers";
export default {
  name: "MyGroup",
  components: {
    MyInput, MyGroupMenu, GroupSubscribers
  },
  data() {
    return {
      group: {},
      subscribers: [],
      groupId: this.$route.params.tagName,
      avatarBlob: null,
      loaded: false,
    }
  },
  methods: {
    fetchGroup() {
      axios.get(`http://127.0.0.1:8000/groups/page/${this.groupId}`).then(response => {
        console.log(response.data)
        this.group = response.data
        this.fetchAvatar()
        this.fetchSubs(response.data.id)
      })
    },
    fetchAvatar() {
      fetch(`http://127.0.0.1:8000/groups/avatar/${this.group.id}`).then(response => {
        response.blob().then(blob => {
          this.avatarBlob = window.URL.createObjectURL(blob)
        })
      })
    },
    fetchSubs() {
      axios.get(`http://127.0.0.1:8000/groups/subscribe/all/${this.group.id}`).then(response => {
        this.subscribers = response.data
        console.log('Подписчики: ', this.subscribers)
        this.loaded = true
      })
    },
    createPost(newPost, files) {
      console.log('create post')
    }
  },
  computed: {
    isMyGroup() {
      return this.group.creator_id === JSON.parse(localStorage.getItem('user_profile')).id
    },
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
    this.fetchGroup()
  }
}
</script>

<style scoped>
.profile-info {
  background: #1f1f1f;
  width: 70%;
  padding: 10px;
  border-radius: 10px;
}

.avatar-img {
  width: 100px;
  height: 100px;
}
</style>