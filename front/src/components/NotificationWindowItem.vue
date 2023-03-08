<template>
  <NotificationWindowItemComment
      v-if="noti.type === 'comment'"
      :noti="noti"
      @openModal="openModal"
      @deleteNotificationWindowItem="deleteNotificationWindowItem"
      @forceScroll="forceScroll"
      @loaded="this.$emit('loaded')"
  />
  <NotificationWindowItemLike
      v-if="noti.type === 'like'"
      :noti="noti"
      @openModal="openModal"
      @deleteNotificationWindowItem="deleteNotificationWindowItem"
      @forceScroll="forceScroll"
      @loaded="this.$emit('loaded')"
  />
  <NotificationWindowItemRequestFriend
    v-if="noti.type === 'requestfriend'"
    :noti="noti"
    @deleteNotificationWindowItem="deleteNotificationWindowItem"
    @forceScroll="forceScroll"
    @loaded="this.$emit('loaded')"
  />
  <NotificationWindowItemAcceptFriend
    v-if="noti.type === 'acceptfriend'"
    :noti="noti"
    @deleteNotificationWindowItem="deleteNotificationWindowItem"
    @forceScroll="forceScroll"
    @loaded="this.$emit('loaded')"
  />
</template>

<script>
import axios from "axios";
import NotificationWindowItemComment from "@/components/NotificationTypes/NotificationWindowItemComment";
import NotificationWindowItemLike from "@/components/NotificationTypes/NotificationWindowItemLike";
import NotificationWindowItemRequestFriend from "@/components/NotificationTypes/NotificationWindowItemRequestFriend";
import NotificationWindowItemAcceptFriend from "@/components/NotificationTypes/NotificationWindowItemAcceptFriend";
export default {
  name: "NotificationWindowItem",
  components: {
    NotificationWindowItemComment,
    NotificationWindowItemLike,
    NotificationWindowItemRequestFriend,
    NotificationWindowItemAcceptFriend
  },
  props: {
    noti: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteNotificationWindowItem(id) {
      this.$emit('deleteNotificationWindowItem', id)
    },
    openModal(id) {
      this.$emit('openModal', id)
    },
    forceScroll() {
      this.$emit('forceScroll')
    }
  },
}
</script>

<style scoped>
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
  padding-right: 18px;
  border-radius: 8px;
  position: relative;
}

.window-item:hover {
  background: rgba(145, 145, 145, 0.46);
}
</style>