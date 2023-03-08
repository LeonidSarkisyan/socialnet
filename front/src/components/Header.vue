<template>
    <div class="header-main">
      <HeaderHeader
          @updateNotifications="updateNotifications"
          @forceScroll="this.$emit('forceScroll')"
          @logout="this.$emit('logout')"
          :avatar="avatar"
          :showMenu="showMenu"
          :notifications="notifications"
          :scrollKey="scrollKey"
      />
      <div ref="menu" class="menu">
        <Menu v-if="showMenu" :sticky="sticky"/>
      </div>
    </div>
</template>

<script>
import Menu from "@/components/Menu";
import HeaderHeader from "@/components/HeaderHeader";
export default {
  name: "Header",
  components: {
    HeaderHeader, Menu
  },
  props: {
    showMenu: {
      type: Boolean,
      required: true
    },
    avatar : {},
    notifications: {},
    scrollKey: {}
  },
  data() {
    return {
      sticky: false
    }
  },
  methods: {
    updateNotifications(id) {
      this.$emit('updateNotifications', id)
    }
  },
  mounted() {
    window.onscroll = () => {
      let menu = document.getElementsByClassName('menu')[0]
      if (window.pageYOffset >= menu.clientHeight) {
        this.sticky = true
        this.$emit('addPadding')
      }
      if (window.pageYOffset <= 65) {
        this.sticky = false
        this.$emit('minPadding')
      }
    }
  }
}
</script>

<style scoped>
.header-main {
  z-index: 1000;
  width: 100%;
}
</style>