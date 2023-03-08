import MyProfile from "@/pages/MyProfile";
import News from "@/pages/News";
import Dialogs from "@/pages/Dialogs";
import Friends from "@/pages/Friends";
import Groups from "@/pages/Groups";
import {createRouter, createWebHistory} from "vue-router";
import RegisterForm from "@/pages/RegisterForm";
import Peoples from "@/pages/Peoples";
import MyGroup from "@/pages/MyGroup";
import TheGroups from "@/pages/TheGroups";


const routes = [
    {
        path: '/',
        component: RegisterForm,
        name: 'register',
    },
    {
      path: '/profile/:tagName?/:post_id?',
      component: MyProfile,
      name: 'profile',
      props: true
    },
    {
      path: '/group/:tagName/',
      component: MyGroup,
      name: 'group',
      props: true
    },
    {
        path: '/news',
        component: News
    },
    {
        path: '/chats/:id?',
        component: Dialogs,
        name: 'chats'
    },
    {
        path: '/friends',
        component: Friends,
        name: 'friends'
    },
    {
        path: '/groups',
        component: Groups,
        name: 'groups'
    },
    {
        path: '/peoples',
        component: Peoples,
        name: 'peoples'
    },
    {
        path: '/allgroups',
        component: TheGroups,
        name: 'allgroups'
    }
]

const router = createRouter({
        routes: routes,
        history: createWebHistory(process.env.BASE_URL),
        scrollBehavior() {
            document.getElementById('app').scrollIntoView( );
        }
})

export default router



