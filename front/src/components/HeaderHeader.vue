<template>
  <div class="header">
    <div class="header-inner">
      <div class="header-logo">
        <router-link class="header-logo-title" :to="logoPath">
          Одногруппники
        </router-link>
        <router-link :to="logoPath">
          <img src="@/assets/images/logo.png" class="header-logo-img">
        </router-link>
        <HeaderMenu
            @updateNotifications="updateNotifications"
            @forceScroll="this.$emit('forceScroll')"
            v-if="showMenu"
            :notifications="notifications"
            :scrollKey="scrollKey"
        />
      </div>
      <div class="header-login" @click="openMenu">
        <img :src="logoLogin" class="login-avatar" ref="loginAvatar">
        <img src="@/assets/images/arrow-login.png" class="login-arrow" ref="arrow" :class="{'deg': menuShow}">
          <div
              v-if="menuShow"
              :class="{'header-login-menu-open': menuShow}"
              class="header-login-menu"
              v-click-outside="hideMenu"
          >
            <div class="menu-item" @click="logout">Выйти</div>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import HeaderMenu from "@/components/HeaderMenu";
export default {
  name: "HeaderHeader",
  components: {HeaderMenu},

  props: {
    avatar: {
      required: false,
    },
    showMenu: {
      type: Boolean,
      required: true
    },
    notifications: {},
    scrollKey: {}
  },
  data() {
    return {
      urlAvatar: null,
      menuShow: false,
      loginUrl: null,
      hide: 0
    }
  },
  methods: {
    updateNotifications(id) {
      this.$emit('updateNotifications', id)
    },
    openMenu() {
      if (this.menuShow === true) {
        this.hide = 1
      } else {
        this.hide = 0
      }
      this.menuShow = !this.menuShow
    },
    hideMenu() {
      this.hide += 1
      if (this.hide !== 1) {
        this.menuShow = false
        this.hide = 0
      }
    },
    logout() {
      this.menuShow = !this.menuShow
      this.$emit('logout')
    }
  },
  computed: {
    logoPath() {
      try {
        let profile = localStorage.getItem('JTW')
        return '/news'
      } catch (e) {
        return '/'
      }
    },
    logoLogin() {
      try {
        let profile = JSON.parse(localStorage.getItem('user_profile'))
        fetch(`http://127.0.0.1:8000/profile/avatar/${profile.tag_name}`).then(response => {
          response.blob().then(blob => {
            this.loginUrl = window.URL.createObjectURL(blob)
            this.$refs.loginAvatar.src = this.loginUrl
          })
        })
      } catch (error) {
        fetch('http://127.0.0.1:8000/profile/avatar/not/authetication').then(response => {
          response.blob().then(blob => {
            this.loginUrl = window.URL.createObjectURL(blob)
            this.$refs.loginAvatar.src = this.loginUrl
          })
        })
      }
    }
  },
}
</script>

<style scoped>

.menu-item {
  text-align: center;
  color: #ff9b38;
  margin-top: 10px;
  font-weight: 700;
  font-size: 20px;
  padding-bottom: 10px;
}

.menu-item:hover {
  color: #ffdbb8;
  cursor: pointer;
  text-decoration: underline;
}

.deg {
  transform: rotate(-180deg);
}

.header {
  background: #A33327;
}

.header-inner {
  padding: 0px 0 0px;
  width: 1236px;
  margin: 0 auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-logo {
  display: flex;
  align-items: center;
}

.header-logo-title {
  font-size: 24px;
  line-height: 29px;
  color: #EFAC6E;
  margin-right: 22px;
  cursor: pointer;
  text-decoration: none;
}

.header-logo-img {
  height: 55px;
  cursor: pointer;
}

.header-login {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  z-index: 1000;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65px;
  width: 120px;
}

.header-login:hover {

}

.login-arrow {
  transition: 0.5s;
  margin-left: 13px;
  cursor: pointer;
}

.login-avatar {
  cursor: pointer;
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
}

.header-login-menu {
  border-top: 1px black solid;
  z-index: 500;
  position: absolute;
  width: 120px;
  background: #A33327;
  top: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  transition: height 0.5s;
}

.header-login-menu-open {

}
</style>