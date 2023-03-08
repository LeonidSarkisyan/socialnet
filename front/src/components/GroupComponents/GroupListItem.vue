<template>
  <div class="point" v-show="loaded">
    <div class="point-content">
      <div class="avatar">
        <router-link :to="{name: 'group', params: {tagName: group.tag_name}}">
          <img :src="blobAvatar" class="avatar">
        </router-link>
      </div>
      <div class="point-info">
        <div class="name">
          <router-link :to="{name: 'group', params: {tagName: group.tag_name}}" style="text-decoration: none; color: #C7493A">
            {{ group.title }}
          </router-link>
        </div>
        <div class="type-group">
          {{ group.genre }}
        </div>
        <div class="message">
          {{ group.count_subscribers }} подписчика
        </div>
      </div>
      <div class="option">
        <img src="@/assets/images/option.png" class="option-img">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupListItem",
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      blobAvatar: null,
      loaded: false,
    }
  },
  methods: {
    fetchAvatar() {
      fetch(`http://127.0.0.1:8000/groups/avatar/${this.group.id}`).then(response => {
        response.blob().then(blob => {
          this.blobAvatar = window.URL.createObjectURL(blob)
          this.loaded = true
        })
      })
    }
  },
  mounted() {
    this.fetchAvatar()
  }
}
</script>

<style scoped>

</style>