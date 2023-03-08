<template>
  <div class="friend-item">
    <router-link :to="{name: 'group', params: {tagName: subs.group.tag_name}}">
      <img :src="avatarBlob" class="friend-avatar">
    </router-link>
    <router-link :to="{name: 'group', params: {tagName: subs.group.tag_name}}" style="text-decoration: none">
      <span class="friend-name">{{ subs.group.title }}</span>
    </router-link>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GroupListItemFriend",
  props: {
    subs: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      avatarBlob: null
    }
  },
  methods: {
    fetchAvatar() {
      fetch(`http://127.0.0.1:8000/groups/avatar/${this.subs.group.id}`).then(response => {
        response.blob().then(blob => {
          this.avatarBlob = window.URL.createObjectURL(blob)
        })
      })
    }
  },
  mounted() {
    this.fetchAvatar()
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