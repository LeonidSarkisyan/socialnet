<template>
  <div class="post-info comment">

    <router-link :to="{name: 'profile', params: {tagName: this.comment.profile.tag_name}}" class="no-text-decoration">
      <img :src="url" class="post-info-avatar r" @click="closeModal">
    </router-link>
    <div class="post-info-text">

      <router-link :to="{name: 'profile', params: {tagName: this.comment.profile.tag_name}}" class="no-text-decoration">
        <div class="name-group comment-fio" @click="closeModal">
          {{ comment.profile.name }} {{ comment.profile.surname }}
        </div>
      </router-link>


      <div class="comment-text" v-if="!edit">{{ commentOrUpdatedText }}</div>

      <div class="div inputs" v-if="edit">
        <textarea v-model="editedText" @keyup.enter="updateComment" class="edit-input"></textarea>
        <img
            src="@/assets/images/ui/accept.png"
            class="icon"
            @click="updateComment"
        >
        <img
            src="@/assets/images/ui/close.png"
            class="icon" style="width: 30px"
            @click="edit = false; $emit('noCloseModel')"
        >
      </div>

    </div>
    <div class="comment-datetime">
      {{ dateTimeComment.date.day }} {{ dateTimeComment.date.month }}
      {{ dateTimeComment.time.hours }}:{{ dateTimeComment.time.minutes }}
    </div>
    <img
        src="@/assets/images/comment/edit.png"
        class="option-img option-img-edit"
        @click="openEditWidget"
        v-if="isOwnerComment"
    >
    <img
        v-if="isOwnerPost || isOwnerComment"
        src="@/assets/images/comment/close.png"
        class="option-img"
        @click="deleteComment"
    >
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CommentsListItem",
  props: {
    comment: {
      type: Object,
      required: true
    },
    isOwnerPost: {
      type: Boolean,
      required: true
    },
    profileId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      url: null,
      isShowContextMenu: false,
      edit: false,
      editedText: '',
      replacedText: false,
      dateTimeComment: {
        date: {
          year: null,
          month: null,
          day: null
        },
        time: {
          hours: null,
          minutes: null,
          seconds: null
        },
      },
      months: [
        {num: 1, name: 'янв'},
        {num: 2, name: 'фев'},
        {num: 3, name: 'мар'},
        {num: 4, name: 'апр'},
        {num: 5, name: 'май'},
        {num: 6, name: 'июн'},
        {num: 7, name: 'июл'},
        {num: 8, name: 'авг'},
        {num: 9, name: 'сен'},
        {num: 10, name: 'окт'},
        {num: 11, name: 'ноя'},
        {num: 12, name: 'дек'},
      ],
    }
  },
  methods: {
    getMonth(integer) {
      let month = this.months.find((value => {
        return value.num === integer
      }))
      return month.name
    },
    parseDateTime() {
      this.parseDate()
      this.parseTime()
    },
    parseDate() {
      this.dateTimeComment.date.year = this.comment.create_date_time.slice(0, 4)
      this.dateTimeComment.date.month = this.getMonth(Number(this.comment.create_date_time.slice(5, 7)))
      this.dateTimeComment.date.day = this.comment.create_date_time.slice(8, 10)
    },
    parseTime() {
      this.dateTimeComment.time.hours = this.comment.create_date_time.slice(11, 13)
      this.dateTimeComment.time.minutes = this.comment.create_date_time.slice(14, 16)
      this.dateTimeComment.time.seconds = this.comment.create_date_time.slice(17, 19)
    },
    validate() {
      return this.editedText.length !== 0
    },
    updateComment() {
      if (this.validate()) {
        console.log(228)
        this.replacedText = true
        this.edit = false
        axios.put(`http://127.0.0.1:8000/comments/${this.comment.id}?new_text=${this.editedText}`).then(response => {
          console.log(response.data)
        })
      } else {
        alert('Пустой комментарий!')
      }
    },
    openEditWidget() {
      if (!this.replacedText) {
        this.setEditedText()
      }
      this.edit = true
    },
    deleteComment() {
      axios.delete(`http://127.0.0.1:8000/comments/${this.comment.id}`).then(response => {
        console.log(response.data)
        this.$emit('deleteComment', this.comment.id)
      })
    },
    openContextMenu() {
      this.isShowContextMenu = true
    },
    hideContextMenu() {
      this.isShowContextMenu = false
    },
    closeModal() {
      for (let i=0; i < 2; ++i) {
        this.$emit('closeModal')
      }
    },
    fetchAvatar() {
      fetch(`http://127.0.0.1:8000/profile/avatar/v2/${this.comment.user_id}`).then(response => {
        response.blob().then(blob => {
          this.url = window.URL.createObjectURL(blob)
        })
      })
    },
    goToProfile() {
      window.scrollTo(0,0);
      this.$router.push(
          {
            name: 'profile',
            params: {
              tagName: this.comment.profile.tag_name
            }
          }
      )
    },
    setEditedText() {
      this.editedText = this.comment.text
    }
  },
  computed: {
    isOwnerComment() {
      return this.profileId === this.comment.user_id
    },
    commentOrUpdatedText() {
      if (this.replacedText) {
        return this.editedText
      } else {
        return this.comment.text
      }
    }
  },
  mounted() {
    this.fetchAvatar()
    this.parseDateTime()
  }
}
</script>

<style scoped>
.inputs {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.edit-input {
  background: #7D7D7D;
  padding: 5px;
  border-radius: 4px;
  color: white;
  font-weight: 700;
  width: 350px;
  resize: none;
  font-size: 18px;
  margin-right: 10px;
}

.icon {
  width: 26px;
  margin-right: 10px;
  cursor: pointer;
}

.option-img {
  position: absolute;
  top: 20px;
  right: 10px;
  cursor: pointer;
  display: block;
}

.option-img-edit {
  right: 40px;
}

.option-img:hover {
  background: #5e5e5e;
  border-radius: 4px;
}

.no-text-decoration {
  text-decoration: none;
}

.comment-datetime {
  color: #848484;
  top: 2px;
  right: 35px;
  position: absolute;
}

.comment {
  padding-left: 25px;
  margin: 10px 0 10px;
  padding-bottom: 10px;
  position: relative;
}

.comment:last-child {
  margin-bottom: 0;
}

.comment-fio {
  font-size: 16px;
}

.comment-fio:hover {
  text-decoration: underline;
}

.comment-text {
  color: white;
  margin-top: 5px;
}

.img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}
</style>