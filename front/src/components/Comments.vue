<template>
  <div class="comments">
    <CommentsInfo :post="post" @openCommentInput="openCommentInput"/>
    <CommentsList :post="post"/>
    <CommentsInput :post="post" v-if="openedCommentInput"/>
  </div>
</template>

<script>
import CommentsInput from "@/components/CommentsInput";
import CommentsList from "@/components/CommentsList";
import CommentsInfo from "@/components/CommentsInfo";
export default {
  name: "Comments",
  components: {
    CommentsList,
    CommentsInput,
    CommentsInfo
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      openedCommentInput: false
    }
  },
  methods: {
    openCommentInput() {
      if (this.openedCommentInput) {

      } else {
        this.openedCommentInput = true
        this.$emit('openedCommentInput')
      }
    }
  }
}
</script>

<style scoped>

</style>