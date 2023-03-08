<template>
  <div class="window-item" :class="{'opacity': addedOpacity}">
    <div class="window-item-info">
      <router-link
          :to="{name: 'profile', params: {tagName: noti.requestfriend.profile.tag_name}}"
          class="non"
          @click.stop
      >
        <div class="avatar">
          <img :src="urlAvatar" class="av">
          <div>
            <img :src="icon" class="nwi-icon">
          </div>
        </div>
      </router-link>
      <router-link :to="{name: 'profile', params: {tagName: noti.requestfriend.profile.tag_name}}" class="non" @click.stop>
        <div class="window-item-name-and-surname">
          {{ noti.requestfriend.profile.name }} {{ noti.requestfriend.profile.surname }}
        </div>
      </router-link>
      <div class="window-item-type">
        хочет добавить вас в друзья
      </div>
      <div class="window-item-button-close" @click="deleteNotificationWindowItem">
        &#10006;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationWindowItemRequestFriend',
  props: {
    noti: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      urlAvatar: null,
      addedOpacity: false,
      icon: null
    }
  },
  methods: {
    async fetchAvatar() {
      try {
        fetch(`http://127.0.0.1:8000/profile/avatar/${this.noti.requestfriend.profile.tag_name}`).then(response => {
          response.blob().then(blob => {
            this.urlAvatar = window.URL.createObjectURL(blob)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    deleteNotificationWindowItem() {
      this.$emit('deleteNotificationWindowItem', this.noti.id)
    },
    setOpacity() {
      this.addedOpacity = true
    },
    fetchNotificationIcon() {
      fetch(`http://127.0.0.1:8000/notifications/image/requestfriend`).then(response => {
        response.blob().then(blob => {
          this.icon = window.URL.createObjectURL(blob)
        })
      })
    },
  },
  mounted() {
    this.fetchAvatar()
    this.fetchNotificationIcon()
    setTimeout(this.setOpacity, 5000)
    setTimeout(this.deleteNotificationWindowItem, 7000)
  }
}
</script>

<style scoped>
.nwi-icon {
  width: 30px;
  position: absolute;
  left: 35px;
  top: 35px;
}

.non {
  text-decoration: none;
}

.opacity {
  opacity: 0;
}

.window-item-button-close {
  position: absolute;
  top: 7px;
  right: 8px;
  color: white;
  padding: 0px 5px 2px;
}

.window-item-comment {
  color: white;
  position: absolute;
  left: 10px;
  top: 70px;
}

.window-item-type {
  color: white;
  position: absolute;
  top: 40px;
  left: 75px;
}

.window-item-name-and-surname {
  color: #ffa95e;
  position: absolute;
  top: 15px;
  left: 75px;
  font-weight: 700;
}

.window-item-name-and-surname:hover {
  text-decoration: underline;
}

.av {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.window-item {
  cursor: pointer;
  width: 300px;
  background: rgba(94, 94, 94, 0.46);
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  position: relative;
}

.window-item:hover {
  background: rgba(145, 145, 145, 0.46);
}
</style>