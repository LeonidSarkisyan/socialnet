import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/router";
import store from "@/store/index";

const app = createApp(App)

app
    .use(router)
    .use(store)
    .mount('#app')

app.directive('click-outside', {
    beforeMount(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event, el);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
    }
})