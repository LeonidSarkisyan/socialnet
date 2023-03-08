<template>
  <div class="peoples" v-show="loaded">
    <div class="peoples-list">
      <transition-group name="peoples1">
        <GroupItem
            :group="group"
            v-for="group in groups"
            :key="group.id"
        />
      </transition-group>
      <div class="not-found" v-if="groups.length === 0">К сожалению, ничего не найдено</div>
    </div>
    <div class="search">
      <div class="search-text">Поиск:</div>
      <input type="text" class="search-input" v-model="query">
    </div>
  </div>
</template>

<script>
import GroupItem from "@/components/GroupItem";
import axios from "axios";
export default {
  name: "TheGroups",
  components: {GroupItem},
  data() {
    return {
      query: '',
      groups: [],
      loaded: false,
    }
  },
  methods: {
    fetchGroups() {
      axios.get('http://127.0.0.1:8000/groups/').then(response => {
        this.groups = response.data
        this.loaded = true
      })
    },
  },
  mounted() {
    this.fetchGroups()
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