<template>
  <div class="list">
    <FriendPageListItem
        v-for="friend in friends"
        :friend="friend"
        @delete-friend="deleteFriend"
        :key="friend.id"
    />
  </div>
</template>

<script>
import FriendPageListItem from "@/components/FriendComponents/FriendPageListItem";
export default {
  name: "FriendPageList",
  components: {
    FriendPageListItem
  },
  props: {
    friends: {
      type: Array,
      required: true
    }
  },
  methods: {
    deleteFriend(id) {
      this.$emit('delete-friend', id)
    }
  }
}
</script>

<style scoped>

</style>