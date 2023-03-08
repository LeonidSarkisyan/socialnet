<template>
  <div class="notifications" :style="{'max-height': height + 'px'}">
    <div class="notifications-title">Уведомления</div>
    <div class="loading" v-if="loading">...</div>
    <div
        v-show="!loading"
        class="scroll-menu"
        :style="{'max-height': height - 50 + 'px'}"
        :key="scrollKey"
    >
      <NotificationsItem
          @openModalPost="openModalPost"
          @hideNotiList="this.$emit('hideNotiList')"
          @forceScroll="this.$emit('forceScroll')"
          v-for="notification in notifications"
          :notification="notification"
          :key="notifications.id"
          @loaded="loadingReady"
      />
      <div class="noti-no" v-if="!notifications.length">Уведомлений нет</div>
    </div>
  </div>
</template>

<script>
import NotificationsItem from "@/components/NotificationsItem";
export default {
  name: "Notifications",
  components: {
    NotificationsItem
  },
  props: {
    notifications: {
      type: Array,
      required: true
    },
    scrollKey: {

    }
  },
  data() {
    return {
      height: 350,
      loadingCount: 0,
      loading: false // ИЗМЕНЕНО В ЭКСПЕРЕМЕНТАЛЬНЫХ ЦЕЛЯХ!!! (isin: true)
    }
  },
  methods: {
    hideNotificationWidget(bool) {
      this.$emit('hideNotificationWidget', bool)
    },
    openModalPost(post_id) {
      this.$emit('openModalPost', post_id)
    },
    loadingReady() {
      this.loadingCount += 1
      if (this.loadingCount === this.notifications.length) {
        this.loading = false
      }
    },
    beNotificactions() {
      if (this.notifications.length !== 0) {
        this.height = 600
      }
    },
    getLouding() {
      console.log(this.notifications.length)
    },
    needLoading() {
      if (this.notifications.length === 0) {
        this.loading = false
      }
    }
  },
  mounted() {
    this.needLoading()
    this.beNotificactions()
    this.$emit('forceScroll')
    this.getLouding()
  }
}
</script>

<style>
.loading {
  text-align: center;
  font-weight: 700;
  display:inline-block;
  font-family: monospace;
  color: #ffa95e;
  font-size: 46px;
  clip-path: inset(0 3ch 0 0);
  animation: l 0.15s steps(4) infinite;
}

@keyframes l {
  to {
    clip-path: inset(0 -1ch 0 0)
  }
}

.noti-no {
  font-size: 16px;
  color: #fff;
  text-align: center;
  margin-top: 60px;
  margin-bottom: 60px;
}

body::-webkit-scrollbar {
  width: 12px;               /* ширина scrollbar */
}
body::-webkit-scrollbar-track {
    background: #272727  /* цвет дорожки */
}
body::-webkit-scrollbar-thumb {
  background-color: #5e5e5e;    /* цвет плашки */
  border-radius: 20px;       /* закругления плашки */
  border: 3px solid #333333;  /* padding вокруг плашки */
}

.scroll-menu::-webkit-scrollbar {
  width: 12px;               /* ширина scrollbar */
}
.scroll-menu::-webkit-scrollbar-track {
  background: #272727  /* цвет дорожки */
}
.scroll-menu::-webkit-scrollbar-thumb {
  background-color: #5e5e5e;    /* цвет плашки */
  border-radius: 20px;       /* закругления плашки */
  border: 3px solid #333333;  /* padding вокруг плашки */
}

.scroll-menu {
  overflow: auto;
  height: v-bind(height)px;
  overflow-y: scroll;
}

.notifications-title {
  font-size: 16px;
  font-weight: 700;
  color: #F5B06F;
  padding-top: 10px;
  padding-left: 15px;
  padding-bottom: 10px;
  border-bottom: 1px #F5B06F solid;
}

.notifications {
  border: 1px solid #848484;
  border-radius: 2px;
  background: #252525;
  width: 100%;
  height: v-bind(height)px;
}
</style>