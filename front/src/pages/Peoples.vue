<template>
  <div class="peoples">
    <div class="peoples-list">
      <transition-group name="peoples">
        <PeopleItem
            :profile="profile"
            :requests="requests"
            v-for="profile in filterArray"
            :key="profile.id"
        />
      </transition-group>
      <div class="not-found" v-if="filterArray.length === 0">К сожалению, ничего не найдено</div>
    </div>
    <div class="search">
      <div class="search-text">Поиск:</div>
      <input type="text" class="search-input" v-model="query">
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PeopleItem from "@/components/PeopleItem";
export default {
  name: "peoples",
  components: {PeopleItem},
  data() {
    return {
      peopleArray: [],
      query: '',
      requests: []
    }
  },
  methods: {
    async fetchProfiles() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/profile/').then(response => {
          this.peopleArray = response.data
          console.log(this.peopleArray)
        })
      } catch (error) {
        console.log(error)
      }
    },
    async fetchRequests() {
      try {
        let id = JSON.parse(localStorage.getItem('user_profile')).id
        await axios.get(`http://127.0.0.1:8000/requestsfriends/${id}`).then(response => {
          this.requests = response.data
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    // Фильтр строки
    filterArray() {
      return this.peopleArray.filter(value => {
        let string = (value.name + value.surname + value.tag_name).toLowerCase()
        return string.includes(this.query.toLowerCase().replace(/\s/g, ""))
      })
    }
  },
  mounted() {
    this.fetchRequests()
    this.fetchProfiles()
  }
}
</script>

<style scoped>
.peoples {
  display: flex;
}

.peoples-list {
  margin-left: 250px;
  margin-top: 50px;
  margin-bottom: 100px;
  width: 750px;
  /*background: #252525;*/
  padding: 25px;
  border-radius: 14px;
}

.search {
  margin-top: 50px;
  margin-left: 25px;
  border-radius: 4px;
  position: fixed;
  left: 1050px;
}

.search-input {
  border-radius: 4px;
}

.peoples-item {

}

.peoples-enter-active, .peoples-leave-active {
  transition: all 0.25s ease;
}

.peoples-enter-from, .peoples-leave-to {
  opacity: 0;
}

.peoples-move {
  transition: 0.25s ease;
}

.not-found {
  color: #DC8C40;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
}
</style>