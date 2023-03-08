<template>
  <NotificationComment
      v-if="notification.type === 'comment'"
      :notification="notification"
      @hideNotiList="this.$emit('hideNotiList')"
      @openModalPost="openModelPost"
  />
  <NotificationLike
      v-if="notification.type === 'like'"
      :notification="notification"
      @hideNotiList="this.$emit('hideNotiList')"
      @openModalPost="openModelPost"
  />
  <NotificationRequestFriend
      v-if="notification.type === 'requestfriend'"
      :notification="notification"
      @hideNotiList="this.$emit('hideNotiList')"
      @hideNotificationWidget="hideNotificationWidget"
  />
  <NotificationAcceptFriend
    v-if="notification.type === 'acceptfriend'"
    :notification="notification"
    @hideNotiList="this.$emit('hideNotiList')"
    @hideNotificationWidget="hideNotificationWidget"
  />
</template>

<script>
import NotificationLike from "@/components/NotificationTypes/NotificationLike";
import NotificationComment from "@/components/NotificationTypes/NotificationComment";
import NotificationRequestFriend from "@/components/NotificationTypes/NotificationRequestFriend";
import NotificationAcceptFriend from "@/components/NotificationTypes/NotificationAcceptFriend";
import axios from "axios";
import ModalPost from "@/components/ModalPost";
export default {
  name: "NotificationsItem",
  components: {
    ModalPost, NotificationComment, NotificationLike, NotificationRequestFriend, NotificationAcceptFriend
  },
  props: {
    notification: {}
  },
  data() {
    return {
      avatar: null,
      icon: null,
      loadingAvatar: false,
      loadingIcon: false,
      dateTimeNotification: {
        date: {
          year: null,
          month: null,
          day: null
        },
        time: {
          hours: null,
          minutes: null,
          seconds: null
        },
      },
      months: [
        {num: 1, name: 'янв'},
        {num: 2, name: 'фев'},
        {num: 3, name: 'мар'},
        {num: 4, name: 'апр'},
        {num: 5, name: 'май'},
        {num: 6, name: 'июн'},
        {num: 7, name: 'июл'},
        {num: 8, name: 'авг'},
        {num: 9, name: 'сен'},
        {num: 10, name: 'окт'},
        {num: 11, name: 'ноя'},
        {num: 12, name: 'дек'},
      ],
    }
  },
  methods: {
    hideNotificationWidget(bool) {
      this.$emit('hideNotificationWidget', bool)
    },
    openModelPost(id) {
      this.$emit('openModalPost', id)
      this.$emit('hideNotiList')
    },
    fetchAvatar() {
      console.log(this.notification)
      fetch(`http://127.0.0.1:8000/profile/avatar/${this.notification.comment.profile.tag_name}`).then(response => {
        response.blob().then(blob => {
          this.avatar = window.URL.createObjectURL(blob)
          this.loadingAvatar = true
          this.tryLoading()
        })
      })
    },
    fetchNotificationIcon() {
      fetch(`http://127.0.0.1:8000/notifications/image/comment`).then(response => {
        response.blob().then(blob => {
          this.icon = window.URL.createObjectURL(blob)
          this.loadingIcon = true
          this.tryLoading()
        })
      })
    },
    forceScroll() {
      this.$emit('forceScroll')
    },
    tryLoading() {
      if (this.loadingAvatar && this.loadingIcon) {
        this.$emit('loaded')
      }
    },
    getMonth(integer) {
      let month = this.months.find((value => {
        return value.num === integer
      }))
      return month.name
    },
    parseDateTime() {
      this.parseDate()
      this.parseTime()
    },
    parseDate() {
      this.dateTimeNotification.date.year = this.notification.date.slice(0, 4)
      this.dateTimeNotification.date.month = this.getMonth(Number(this.notification.date.slice(5, 7)))
      this.dateTimeNotification.date.day = this.notification.date.slice(8, 10)
    },
    parseTime() {
      this.dateTimeNotification.time.hours = this.notification.date.slice(11, 13)
      this.dateTimeNotification.time.minutes = this.notification.date.slice(14, 16)
      this.dateTimeNotification.time.seconds = this.notification.date.slice(17, 19)
    },
    //goToPost() {
    //  this.$emit('hideNotiList')
    //  console.log(this.notification.comment.post.id)
    //  this.$router.push({
    //    name: 'profile',
    //    params: {
    //      tagName: this.notification.comment.post.profile.tag_name,
    //      post_id: this.notification.comment.post.id
    //    }
    //  })
    //}
  }
}
</script>

<style scoped>
.text-underline-none {
  text-decoration: none;
}

.date {
  color: #848484;
}

.box {
  position: relative;
}

.comment-text-noti {
  margin-top: 5px;
  margin-bottom: 5px;
}

.people {
  font-weight: 700;
  color: #ffa95e;
  cursor: pointer;
  text-decoration: none;
}

.people:hover {
  text-decoration: underline;
}

.wrapper {
  padding-bottom: 15px;
  padding-top: 20px;
  padding-left: 15px;
  display: flex;
  border-bottom: 1px solid #848484;
  border-right: 1px solid #848484;
}

.wrapper:hover {
  background: #3b3b3b;
  cursor: pointer;
}

.avatarS {
  width: 60px;
  margin-right: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
}

.icon {
  width: 30px;
  object-fit: cover;
  border-radius: 50%;
  z-index: 100;
  position: absolute;
  left: 60%;
  top: 60%;
}

.info {
  font-size: 16px;
  word-wrap: normal;
  width: 80%;
  color: white;
  font-weight: 400;
}
</style>