<template>
  <div class="content">
    <GroupMenu @selectButton="selectButton"/>
    <GroupList :groups="groups"/>
  </div>
</template>

<script>
import GroupMenu from "@/components/GroupComponents/GroupMenu";
import GroupList from "@/components/GroupComponents/GroupList";
import axios from "axios";
export default {
  name: "Groups",
  components: {
    GroupMenu, GroupList
  },
  data() {
    return {
      groups: [],
    }
  },
  methods: {
    selectButton(id) {
      if (id == 1) {
        this.fetchGroups()
      } else if (id == 2) {
        this.fetchMyGroups()
      }
    },
    fetchGroups() {
      axios.get('http://127.0.0.1:8000/groups/').then(response => {
        this.groups = response.data
      })
    },
    fetchMyGroups() {
      axios.get('http://127.0.0.1:8000/groups/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response.data)
        this.groups = response.data
      })
    }
  },
  mounted() {
    console.log('Сообщества')
    this.fetchGroups()
  }
}
</script>

<style scoped>

</style>