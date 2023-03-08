<template>
  <div class="modal-back">
    <div class="modal">
      <div>
        <div class="modal__inner">
          <PostItem
              @deletePost="deletePost"
              @noCloseModel="noCloseModal"
              @closeModel="closeModal"
              class="post-in-modal"
              v-if="showPost"
              :post="post"
              :profile="profile"
              :isProfileOwner="isProfileOwner"
              :key="post.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostItem from "@/components/PostItem";
import axios from "axios";
export default {
  name: "ModalPost",
  components: {
    PostItem
  },
  props: {
    post_id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      clickCount: 0,
      post: null,
      profile: null,
      isProfileOwner: false,
      showPost: false,
      showContextMenu: false
    }
  },
  methods: {
    deletePost(id) {
      this.$emit('deletePost', id)
    },
    hideContextMenu() {
      this.showContextMenu = true
      console.log(this.showContextMenu)
    },
    click() {
      console.log('Хах')
    },
    noCloseModal() {
      this.clickCount = -1
    },
    closeModal() {
      console.log('Что то лысое')
      this.clickCount += 1
      if (this.clickCount === 1) {
        this.$emit('closeModal')
        this.clickCount = 0
      }
    },
    fetchPostAndProfile() {
      axios.get(`http://127.0.0.1:8000/posts/one/${this.post_id}`).then(response => {
        console.log(response.data)
        this.post = response.data
        if (this.post.profile_id === JSON.parse(localStorage.getItem('user_profile')).id) {
          this.isProfileOwner = true
        }
        axios.get(`http://127.0.0.1:8000/posts/${this.post_id}/profile`).then(response => {
          this.profile = response.data
          this.showPost = true
        })
      })
    }
  },
  mounted() {
    this.fetchPostAndProfile()
  }
}
</script>


<style>
.show-comment {
  font-weight: 700;
  color: #ffa95e;
  cursor: pointer;
  margin-left: 25px;
  margin-top: -10px;
  padding-bottom: 10px;
  font-size: 16px;
}

.input {
  border-radius: 0;
  width: 500px;
  padding: 10px;
  display: block;
  font-weight: 700;
  color: white;
  font-size: 16px;
}

.context-menu-item {
  font-size: 16px;
}

.modal__inner {
  padding-top: 65px;
  background-color: rgba(0, 0, 0, 0);
}

.post {
  background: #4B4B4B;
  border-radius: 10px;
  padding-left: 25px;
  padding-right: 25px;
}

.date-post {
  font-size: 16px;
  font-weight: 400;
}

.post-text {
  font-size: 16px;
  font-weight: 400;
}

.comment-datetime {
  font-size: 16px;
  font-weight: 400;
}

.comment-input {
  padding: 0;
}

.comment-text {
  font-size: 16px;
  font-weight: 400;
  width: 450px;
}

.modal {
  z-index: 1000;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}

.modal::-webkit-scrollbar {
  width: 0;
}

.modal-back {
  z-index: 1000;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
}
</style>