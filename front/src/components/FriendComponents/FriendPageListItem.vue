<template>
  <div class="point">
      <div class="point-content">
        <div class="avatar">
          <router-link :to="`profile/${profile.tag_name}`" style="text-decoration: none; color: #C7493A">
            <img :src="blobAvatar" class="avatar">
          </router-link>
        </div>
        <div class="point-info">
          <div class="name">
            <router-link :to="`profile/${profile.tag_name}`" style="text-decoration: none; color: #C7493A">
              {{ profile.name }} {{ profile.surname }}
            </router-link>
          </div>
          <div class="message" @click="openChat">
            Перейти к чату
          </div>
        </div>
        <div class="option">
          <div class="relative">
            <img
                src="@/assets/images/option.png"
                class="option-img"
                @mouseenter="openContextMenu"
            >
            <transition-group name="context">
              <div class="context-menu" v-if="isShowContextMenu"
                   @mouseleave="isShowContextMenu = false"
                   v-click-outside="hideContextMenu">
                <div class="context-menu-item" @click="deleteFriend">
                  Удалить из друзей
                </div>
              </div>
            </transition-group>

          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FriendPageListItem",
  props: {
   friend: {
     type: Object,
     required: true
   },
  },
  data() {
    return {
      profile: {},
      blobAvatar: null,
      isShowContextMenu: false,
      countContextMenu: 0
    }
  },
  methods: {
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
            }
        )
      })
    },
    openContextMenu() {
      this.isShowContextMenu = true
    },
    hideContextMenu() {
      this.countContextMenu += 1
      if (this.countContextMenu != 1) {
        this.isShowContextMenu = false
        this.countContextMenu = 0
      }
    },
    async fetchProfile() {
      let id = this.friend.friend_id
      try {
        const response = await axios.get(`http://127.0.0.1:8000/friend/profile/${id}`).then(response => {
          this.profile = response.data
          fetch(`http://127.0.0.1:8000/profile/avatar/${this.profile.tag_name}`).then(response => {
            response.blob().then(blob => {
              this.blobAvatar = window.URL.createObjectURL(blob)
            })
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    deleteFriend() {
      axios.delete(`http://127.0.0.1:8000/friend/delete/${this.profile.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response.data)
        this.$emit('delete-friend', this.profile.id)
      })
    }
  },
  mounted() {
    this.fetchProfile()
  }
}
</script>

<style scoped>
.context-enter-active, .context-leave-active {
  transition: 0.25s;
}

.context-enter-from, .context-leave-to {
  opacity: 0;
}

.option-img {
  position: absolute;
  top: 10px;
  right: -10px;
  padding: 10px;
  cursor: pointer;
  display: block;
}

.relative {
  position: relative;
}

.context-menu {
  position: absolute;
  top: 5px;
  right: -20px;
  width: 200px;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  background: #383838;
}

.context-menu-item {
  color: #DC8C40;
  cursor: pointer;
}

.context-menu-item:hover {
  text-decoration: underline;
}
</style>