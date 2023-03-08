<template>
  <div class="window" :style="{'top': top + 'vh'}">
      <NotificationWindowItem
          v-for="notification in notificationsWindow"
          :noti="notification"
          :key="notification"
          @deleteNotificationWindowItem="deleteNotificationWindowItem"
          @openModal="openModal"
      />
  </div>
</template>

<script>
import NotificationWindowItem from "@/components/NotificationWindowItem";
export default {
  name: "NotificationWindow",
  components: {
    NotificationWindowItem
  },
  props: {
    notificationsWindow: {
      type: Array,
      required: true
    }
  },
  methods: {
    deleteNotificationWindowItem(id) {
      this.$emit('deleteNotificationWindowItem', id)
    },
    openModal(id) {
      this.$emit('openModal', id)
    }
  },
  computed: {
    top() {
      return 80 - 18 * (this.notificationsWindow.length - 1)
    }
  },
}
</script>

<style scoped>
.notification-tran-enter-active, .notification-tran-leave-active {
  transition: 0.5s;
}

.notification-tran-enter-from,
.notification-tran-leave-to {
  opacity: 0;
}

.window {
  position: fixed;
  right: 17px;
}
</style>