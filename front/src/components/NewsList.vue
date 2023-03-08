<template>
  <div class="posts" v-show="loaded">
    <NewsListItem
        v-for="post of news"
        :post="post"
    />
    <div class="observer" ref="observer" v-show="!isLoading"></div>
  </div>
</template>

<script>
import axios from "axios";
import NewsListItem from "@/components/NewsListItem";
export default {
  name: "NewsList",
  components: {NewsListItem},
  data() {
    return {
      news: [],
      skip: 3,
      isLoading: true,
      loaded: false,
    }
  },
  methods: {
    createObserver() {
      let options = {
        rootMargin: '0px',
        threshold: 1.0
      }

      let callback = (entries, observer) => {
        if (entries[0].isIntersecting) {
          console.log('Загружаем новые посты...')
          this.fetchMoreNews()
        }
      };

      let observer = new IntersectionObserver(callback, options);

      observer.observe(this.$refs.observer)
    },
    async fetchNews() {
      const response = await axios.get('http://127.0.0.1:8000/posts/news').then(response => {
        this.news = response.data
        this.skip += 3
        this.isLoading = false
        this.loaded = true
        console.log('news:', this.news)
      })
    },
    fetchMoreNews() {
      console.log('алё!')
      axios.get(`http://127.0.0.1:8000/posts/news?skip=${this.skip}`).then(response => {
        this.news = [...this.news, ...response.data]
        console.log('news', this.news)
        this.skip += 3
      })
    }
  },
  mounted() {
    this.fetchNews()
    let options = {
      rootMargin: '200px',
      threshold: 1.0
    }

    let callback = (entries, observer) => {
      if (entries[0].isIntersecting) {
        console.log('Загружаем новые посты...')
        this.fetchMoreNews()
      }
    };

    let observer = new IntersectionObserver(callback, options);

    observer.observe(this.$refs.observer)
  }
}
</script>

<style scoped>
.observer {
  height: 60px;
}
</style>