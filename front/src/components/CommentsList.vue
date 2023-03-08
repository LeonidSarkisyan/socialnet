<template>
  <div class="commentsV2" ref="comments" v-show="comments.length > 0">
    <CommentsListItem
        v-for="comment in commentLimited"
        :comment="comment"
        :key="comment.id"
        :profileId="profile_id"
        :isOwnerPost="isOwnerPost"
        @closeModal="closeModal"
        @deleteComment="deleteComment"
    />
    <div class="show-comment" @click="showComment" v-if="this.limited">Показать следующие комментарии</div>
  </div>
</template>

<script>
import axios from "axios";
import CommentsListItem from "@/components/CommentsListItem";
export default {
  name: "CommentsList",
  components: {
    CommentsListItem
  },
  props: {
    post: {},
    comments: {},
    isOwnerPost: {
      type: Boolean,
      required: true
    },
    limited: {
      type: Boolean,
      required: true
    },
    limit: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      profile_id: null
    }
  },
  methods: {
    deleteComment(id) {
      this.$emit('deleteComment', id)
    },
    getProdileId() {
      this.profile_id = JSON.parse(localStorage.getItem('user_profile')).id
    },
    closeModal() {
      this.$emit('closeModal')
    },
    showComment() {
      this.$emit('limitplus')
    },
  },
  computed: {
    commentLimited() {
      if (this.limit && this.comments.length > this.limit) {
        return this.comments.slice(0, this.limit)
      } else {
        return this.comments
      }
    }
  },
  mounted() {
    this.getProdileId()
  }
}
</script>

<style scoped>
  .show-comment {
    font-weight: 700;
    color: #ffa95e;
    cursor: pointer;
    margin-left: 25px;
    margin-top: -10px;
    padding-bottom: 10px;
  }

  .show-comment:hover {
    text-decoration: underline;
  }

  .commentsV2 {
    border-top: #252525 solid 1px;
    background: #4B4B4B;
  }
</style>