<template>
  <div class="friend-item" v-show="loaded && showSection === 'friends'">
    <router-link :to="{name: 'profile', params: {tagName: profile.tag_name}}">
      <img :src="blobAvatar" class="friend-avatar">
    </router-link>
    <router-link :to="{name: 'profile', params: {tagName: profile.tag_name}}" style="text-decoration: none">
      <span class="friend-name">{{ profile.name }}</span>
    </router-link>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FriendListItem",
  props: {
    friend: {
      type: Object,
      required: true
    },
    showSection: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      profile: {tag_name: '2'},
      blobAvatar: null,
      loaded: false
    }
  },
  methods: {
    async fetchProfile() {
      try {
        let id = this.friend.friend_id
        const response = await axios.get(`http://127.0.0.1:8000/friend/profile/${id}`).then(response => {
          this.profile = response.data
          fetch(`http://127.0.0.1:8000/profile/avatar/${this.profile.tag_name}`).then(response => {
            response.blob().then(blob => {
              this.blobAvatar = window.URL.createObjectURL(blob)
              this.loaded = true
              this.$emit('loaded')
            })
          })
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.fetchProfile()
  }
}
</script>

<style scoped>
.friend-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto 0;
}

.friend-name {
  color: #fff;
  cursor: pointer;
}

.friend-name:hover {
  font-weight: 700;
  text-decoration: underline;
}

.friend-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>