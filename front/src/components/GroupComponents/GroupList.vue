<template>
  <div class="list-container">
    <div class="list">
      <GroupListItem
          v-for="group in groups"
          :group="group"
          :key="group.id"
      />
      <div
          class="no-group"
          v-show="groups.length === 0"
      >Нет сообществ
      </div>
    </div>
<!--    <div class="search">-->
<!--      <div class="search-text">Поиск сообщества:</div>-->
<!--      <input type="text" class="search-input">-->
<!--    </div>-->
  </div>
</template>

<script>
import axios from "axios";
import GroupListItem from "@/components/GroupComponents/GroupListItem";
export default {
  name: "GroupList",
  components: {
    GroupListItem
  },
  props: {
    groups: {
      type: Array,
      required: true
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.no-group {
  display: inline-block;
  padding: 20px;
  margin-left: 180px;
  font-size: 20px;
  font-weight: 700;
  color: #ff9b38;
}

.name {
  font-size: 16px;
}
</style>