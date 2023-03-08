<template>
  <div class="posts margin">
    <transition-group name="post-item">
      <div class="center" v-if="isLoading">
        <div class="lds-dual-ring"></div>
      </div>
      <PostItem
          v-for="post in posts"
          :post="post"
          :profile="profile"
          :isProfileOwner="isProfileOwner"
          :key="post.id"
          @deletePost="deletePost"
      />
    </transition-group>
  </div>
</template>

<script>
import axios from "axios";
import PostItem from "@/components/PostItem";
export default {
  name: "PostList",
  components: {PostItem},
  props: {
    avatarImageUrl: {},
    profile: {},
    posts: {},
    isProfileOwner: {},
    isLoading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    deletePost(id) {
      this.$emit('deletePost', id)
    }
  },
}
</script>

<style scoped>

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
  margin-top: 75px;
  margin-bottom: 110px;
}

.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #DC8C40;
  border-color: #DC8C40 transparent #DC8C40 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.holder {
  height: 400px;

}

.post-item-enter-active, .post-item-leave-active {
  transition: all 0s ease;
}

.post-item-enter-from, .post-item-leave-to {
  opacity: 0;
}

.post-item-move {
  transition: 0s ease;
}

.post-item-leave-move {
  transition: 0s;
}
</style>