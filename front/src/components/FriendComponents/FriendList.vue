<template>
  <div class="friends" ref="friends" :style="{'height': (this.friends.length > 7 ? height : 135) + 'px'}">
    <div class="friends-titles">
      <div
          :class="{'friends-titles-item-selected': showSection === 'friends'}"
          class="friends-titles-item"
          @click="selectGroup('friends')"
      >
        Друзья {{ friends.length }}
      </div>
      <div
          :class="{'friends-titles-item-selected': showSection === 'groups'}"
          class="friends-titles-item"
          @click="selectGroup('groups')"
      >
        Сообщества {{ groups.length }}
      </div>
    </div>
    <div
        class="no-friend"
        v-show="!friends.length && showSection === 'friends'"
    >Пользователь не добавлял друзей</div>
    <div
        class="no-friend"
        v-show="!groups.length && showSection === 'groups'"
    >Пользователь не подписан на сообщества
    </div>
    <div class="loader" v-show="loading && friends.length"></div>
    <div class="friends-inner">
      <FriendListItem
          :show-section="showSection"
          v-for="friend in limitFriends"
          :friend="friend"
          @loaded="tryLoading"
      />
      <GroupListItemFriend
        v-show="showSection === 'groups'"
        v-for="group in limitGroup"
        :subs="group"
      />

      <div class="open-friends-list">
        <img
            v-if="showLimitedArrow && showSection === 'friends'"
            ref="arrow"
            src="@/assets/images/friends/open-friends-list.png"
            class="icon"
            @click="openFriendsList"
        >
        <img
            v-if="showLimitedArrowGroup && showSection === 'groups'"
            ref="arrow"
            src="@/assets/images/friends/open-friends-list.png"
            class="icon"
            @click="openGroupsList"
        >
      </div>
    </div>
  </div>
</template>

<script>
import FriendListItem from "@/components/FriendComponents/FriendListItem";
import GroupListItemFriend from "@/components/FriendComponents/GroupListItemFriend";
import axios from "axios";
export default {
  name: "FriendList",
  components: {
    FriendListItem, GroupListItemFriend
  },
  props: {
    friends: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      limited: true,
      height: 175,
      loading: true,
      countLoadedFriends: 0,
      countLoadedGroups: 0,
      showSection: 'friends',
    }
  },
  methods: {
    selectGroup(string) {
      this.showSection = string
    },
    tryLoading() {
      this.countLoadedFriends += 1
      if (this.countLoadedFriends === 7 || this.countLoadedFriends === this.friends.length) {
        this.loading = false
      }
    },
    openFriendsList() {
      if (this.limited) {
        let height = this.friends.length / 7
        console.log(height)
        this.height = 270
        this.limited = false
        this.$refs.arrow.classList.add('icon-clicked')
      } else {
        this.height = 175
        this.limited = true
        this.$refs.arrow.classList.remove('icon-clicked')
      }
    },
    openGroupsList() {
      if (this.limited) {
        let height = this.groups.length / 7
        console.log(height)
        this.height = 270
        this.limited = false
        this.$refs.arrow.classList.add('icon-clicked')
      } else {
        this.height = 175
        this.limited = true
        this.$refs.arrow.classList.remove('icon-clicked')
      }
    }
  },
  computed: {
    showLimitedArrow() {
      return this.friends.length > 7
    },
    showLimitedArrowGroup() {
      return this.groups.length > 7
    },
    limitFriends() {
      if (this.friends.length > 7 && this.limited) {
        return this.friends.slice(0, 7)
      } else {
        return this.friends
      }
    },
    limitGroup() {
      if (this.groups.length > 7 && this.limited) {
        return this.groups.slice(0, 7)
      } else {
        return this.groups
      }
    }
  },
  watch: {
    '$route.path'() {
      this.limited = true
      this.height = 175
      this.loading = true
      this.countLoadedFriends = 0
      this.$emit('updateGroups')
    },
    showSection() {
      this.limited = true
      this.height = 175
      this.limited = true
    }
  }
}
</script>

<style scoped>
.no-friend {
  font-size: 20px;
  color: #ff9b38;
  font-weight: 700;
  width: 100%;
  text-align: center;
  margin-top: 20px;
}

.loader {
  width: 60px; /* control the size */
  aspect-ratio: 8/5;
  --_g: no-repeat radial-gradient(#000 68%,#0000 71%);
  -webkit-mask: var(--_g),var(--_g),var(--_g);
  -webkit-mask-size: 25% 40%;
  background: #ff9b38;
  animation: load 2s infinite;
  margin: 25px auto auto;
}

@keyframes load {
  0%    {-webkit-mask-position: 0% 0%  ,50% 0%  ,100% 0%  }
  16.67%{-webkit-mask-position: 0% 100%,50% 0%  ,100% 0%  }
  33.33%{-webkit-mask-position: 0% 100%,50% 100%,100% 0%  }
  50%   {-webkit-mask-position: 0% 100%,50% 100%,100% 100%}
  66.67%{-webkit-mask-position: 0% 0%  ,50% 100%,100% 100%}
  83.33%{-webkit-mask-position: 0% 0%  ,50% 0%  ,100% 100%}
  100%  {-webkit-mask-position: 0% 0%  ,50% 0%  ,100% 0%  }
}

  .friends {
    width: 600px;
    padding: 10px 25px 10px;
    background: #4B4B4B;
    border-radius: 10px;
    margin-left: 35px;
    margin-top: 21px;
    transition: height 0.25s;
  }

  .friends-inner {
    display: flex;
    flex-wrap: wrap;
  }

  .friends-titles-item {
    padding: 4px 10px 4px;
    color: white;
    font-weight: 700;
    display: inline-block;
    border-radius: 8px;
    background: #7D7D7D;
    margin-bottom: 20px;
    margin-right: 10px;
    user-select: none;
    cursor: pointer;
  }

  .friends-titles-item:hover {
    background: #565454;
  }
  
  .friends-titles-item-selected {
    background: #af4338;
    cursor: default;
  }

  .friends-titles-item-selected:hover {
    background: #af4338;
  }

  .open-friends-list {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .icon {
    width: 32px;
    cursor: pointer;
    transition: 0.25s;
  }

  .icon-clicked {
    transform: rotate(180deg);
  }
</style>