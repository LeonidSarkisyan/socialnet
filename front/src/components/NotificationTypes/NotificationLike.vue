<template>
  <div class="div__wrapper" @click="openModelPost">
    <div class="div">
      <div class="wrapper">
        <div class="avatarS">
          <router-link :to="`/profile/${notification.like.profile.tag_name}`" @click.stop="this.$emit('hideNotiList')">
            <div class="box">
              <img :src="avatar" class="avatar">
              <img :src="icon" class="icon">
            </div>
          </router-link>
        </div>
        <div class="info">
          <router-link :to="`/profile/${notification.like.profile.tag_name}`" class="people" @click.stop="this.$emit('hideNotiList')">
          <span class="people">
            {{ notification.like.profile.name }} {{ notification.like.profile.surname }}
          </span>
          </router-link>
          оценил вашу запись
          <div class="date">
            {{ Number(dateTimeNotification.date.day) }} {{ dateTimeNotification.date.month }} в {{ Number(dateTimeNotification.time.hours) }}:{{ dateTimeNotification.time.minutes }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationLike",
  props: {
    notification: {
      type: Object,
      required: true
    }
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
    openModelPost() {
      console.log(this.notification.like)
      this.$emit('openModalPost', this.notification.like.posts.id)
    },
    fetchAvatar() {
      fetch(`http://127.0.0.1:8000/profile/avatar/${this.notification.like.profile.tag_name}`).then(response => {
        response.blob().then(blob => {
          this.avatar = window.URL.createObjectURL(blob)
          this.loadingAvatar = true
          this.tryLoading()
        })
      })
    },
    fetchNotificationIcon() {
      fetch(`http://127.0.0.1:8000/notifications/image/like`).then(response => {
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
  },
  mounted() {
    this.fetchAvatar()
    this.fetchNotificationIcon()
    this.parseDateTime()
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