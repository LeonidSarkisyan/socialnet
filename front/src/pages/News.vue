<template>
  <div class="content">
    <NewsList/>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import axios from "axios";
import NewsList from "@/components/NewsList";
export default {
  name: "News",
  components: {NewsList},
}
</script>

<style scoped>

</style>