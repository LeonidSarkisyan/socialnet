<template>
  <div class="sticky" @scroll="scroll" :class="{'fixed': sticky}">
    <div class="menu">
      <div class="menu-inner">
        <div class="menu-list">
          <router-link :to="'/' + userId" class="menu-item" @click="scrollToTop">
            <img src="@/assets/images/menu/profile.png" class="menu-item-img">
            <div>
              Мой профиль
            </div>
          </router-link>
          <router-link to="/news" class="menu-item" @click="scrollToTop" >
            <img src="@/assets/images/menu/news.png" class="menu-item-img">
            <div>Новости</div>
          </router-link>
          <router-link to="/chats" class="menu-item" @click="scrollToTop" >
            <img src="@/assets/images/menu/chats.png" class="menu-item-img">
            <div class="msg">Мессенджер</div>
            <div class="count-no">
              <div class="count-no-chat" v-show="isCountNoChuts">
                {{ countNoChuts }}
              </div>
            </div>
          </router-link>
          <router-link to="/friends" class="menu-item" @click="scrollToTop" >
            <img src="@/assets/images/menu/friends.png" class="menu-item-img">
            <div>
              Друзья
            </div>
          </router-link>
          <router-link to="/groups" class="menu-item" @click="scrollToTop" >
            <img src="@/assets/images/menu/groups.png" class="menu-item-img">
            <div>
              Сообщества
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Menu",
  props: {
    sticky: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      is: false
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    scroll(event) {
      console.log(event)
    },
  },
  computed: {
    userId () {
      try {
        let profile = JSON.parse(localStorage.getItem('user_profile'))
        return 'profile' + '/' + profile.tag_name
      } catch (e) {
        return '/'
      }
    },
    isCountNoChuts() {
      return this.$store.state.countNoCheckChuts
    },
    countNoChuts() {
      let count = this.$store.state.countNoCheckChuts
      if (count !== 0) {
        this.is = true
        return count
      } else {
        this.is = false

      }
    }
  },
}
</script>

<style scoped>
.msg {
  margin-right: 10px;
}

.count-no {

}

.count-no-chat {
  padding: 5px;
  object-fit: cover;
  background: #ffa95e;
  color: #b05502;
  font-weight: 700;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item-img {
  width: 25px;
  display: block;
  margin-right: 10px;
  margin-top: -2.5px;
}

.fixed {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1001;
}

.menu {
  background: #272727;
}

.menu-inner {
  width: 1050px;
  margin: 0 auto 0;
}

.menu-list {
  display: flex;
  justify-content: space-between;
  padding: 6px 0 6px;
}

.menu-item {
  font-size: 20px;
  line-height: 29px;
  color: #F5B06F;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 26px 6px;
  border-radius: 16px;
  transition: 0.35s;
  text-decoration: none;
}

.menu-item-selected {
  background: #3E3E3E;
}

.menu-item:hover {
  background: #3E3E3E;
}
</style>