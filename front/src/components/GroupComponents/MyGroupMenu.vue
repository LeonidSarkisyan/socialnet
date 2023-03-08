<template>
  <div class="group-menu-button">
    <div class="subscribe" @click="subscribe" v-if="!isSub">
      Подписаться
    </div>
    <div
        v-else
        class="un-subscribe"
        @click="unSubscribe"
        @mouseenter="showUnSubTitle"
        @mouseleave="showSubTitle"
    >
      {{ unSubText }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyGroupMenu",
  props: {
    isSub: {
      type: Boolean,
      required: true
    },
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      unSubText: 'Вы подписаны'
    }
  },
  methods: {
    subscribe() {
      axios.get(`http://127.0.0.1:8000/groups/subscribe/${this.group.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response)
        this.$emit('subPlus')
      })
    },
    unSubscribe() {
      axios.delete(`http://127.0.0.1:8000/groups/subscribe/${this.group.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response)
        this.$emit('subPlus')
      })
    },
    showUnSubTitle() {
      this.unSubText = 'Отписаться'
    },
    showSubTitle() {
      this.unSubText = 'Вы подписаны'
    }
  }
}
</script>

<style scoped>
.un-subscribe {
  width: 140px;
  text-align: center;
  font-weight: 700;
  line-height: 20px;
  color: #2c2b2b;
  padding: 11px 9px;
  background: #868585;
  display: inline-block;
  border-radius: 10px;
  margin-left: 35px;
  margin-top: 21px;
  cursor: pointer;
  transition: color, background-color 0.25s;
}

.un-subscribe:hover {
  color: #868585;
  background: #2c2b2b;
  outline: 2px #868585 solid;
}

.subscribe {
  user-select: none;
  font-weight: 700;
  line-height: 20px;
  color: #212121;
  padding: 11px 9px;
  background: #C7493A;
  display: inline-block;
  border-radius: 10px;
  margin-left: 35px;
  margin-top: 21px;
  cursor: pointer;
  transition: color, background-color 0.25s;
}

.subscribe:hover {
  color: #C7493A;
  background-color: #212121;
  outline: 2px #C7493A solid;
}
</style>