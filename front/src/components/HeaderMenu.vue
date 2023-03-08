<template>
  <div class="header-menu">
    <div class="header-menu-item" @click="showListPeople">Люди</div>
    <div>
      <router-link :to="{name: 'allgroups'}" class="header-menu-item">
        Группы
      </router-link>
    </div>
    <div class="noti">
      <div class="noti-interface">
        <div>
          <img :src="url" class="img" @click="showNotificationWidget">
        </div>
        <div class="count" v-if="$store.state.countNoViewed > 0">
          {{ $store.state.countNoViewed }}
        </div>
      </div>

      <div class="notification-widget" v-if="isShowNotificationWidget" >
        <div class="fixed" v-click-outside="hideNotificationWidget">
          <Notifications
              @openModalPost="openModalPost"
              @hideNotiList="hideNotificationWidget"
              @forceScroll="this.$emit('forceScroll')"
              :notifications="notifications"
              :scrollKey="scrollKey"
          />
        </div>
      </div>
    </div>
    <ModalPost
        @deletePost="updateNotifications"
        @closeModal="closeModalPost"
        v-if="isShowModal"
        :post_id="selectedPostId"
    />
  </div>
</template>

<script>
import ModalPost from "@/components/ModalPost";
import Notifications from "@/components/Notifications";
import axios from "axios";
export default {
  name: "HeaderMenu",
  components: {
    Notifications, ModalPost
  },
  props: {
    notifications: {
      type: Array,
      required: true
    },
    scrollKey: {}
  },
  data() {
    return {
      url: null,
      isShowNotificationWidget: false,
      isShowNotificationWidgetCount: 0,
      isShowModal: false,
      selectedPostId: 0,
    }
  },
  methods: {
    updateNotifications(id) {
      this.$emit('updateNotifications', id)
    },
    openModalPost(post_id) {
      this.selectedPostId = post_id
      this.isShowModal = true
    },
    closeModalPost() {
      this.isShowModal = false
    },
    fetchNotificationImage() {
      fetch('http://127.0.0.1:8000/notifications/image/new/no').then(response => {
        response.blob().then(blob => {
          this.url = window.URL.createObjectURL(blob)
        })
      })
    },
    showListPeople() {
      this.$router.push({name: 'peoples'})
    },
    showNotificationWidget() {
      this.isShowNotificationWidget = true
      let token = localStorage.getItem('JWT')
      axios.get('http://127.0.0.1:8000/notifications/viewed/true', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response.data)
        this.$store.commit('clearCountNoViewed')
      })
    },
    hideNotificationWidget(event, html, tigr=true) {
      if (tigr) {
        this.isShowNotificationWidgetCount += 1
        if (this.isShowNotificationWidgetCount !== 1) {
          this.isShowNotificationWidget = false
          this.isShowNotificationWidgetCount = 0
        }
      }
    },
  },
  mounted() {
    this.fetchNotificationImage()
  }
}
</script>

<style scoped>
.count {
  margin-left: 15px;
  border-radius: 50%;
  background: #ffa95e;
  width: 20px;
  height: 20px;
  padding: 7px;
  line-height: 23px;
  color: #cb6305;
  text-align: center;
}

.noti-interface {
  display: flex;
  align-items: center;
}

.fixed {
  position: fixed;
  width: 600px;
  border-radius: 10px;
}

.notification-widget {
  width: 472px;
  border-radius: 10px;
  position: absolute;
  top: 51px;
  right: 100%;
  z-index: 1000;
}

.noti {
  position: relative;
}

.img {
  width: 40px;
  margin-bottom: -8px;
  cursor: pointer;
}

.header-menu {
  font-weight: 700;
  font-size: 24px;
  color: #212121;
  display: flex;
  align-items: center;
  margin-left: 300px;
}

.header-menu-item {
  text-decoration: none;
  color: #212121;
  margin-right: 50px;
  cursor: pointer;
  transition: 0.3s;
}

.header-menu-item:hover {
  color: white;
}
</style>