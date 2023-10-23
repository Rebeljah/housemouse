import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import LandingPage from './views/Landing.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import Chores from './views/Chores.vue'
import Money from './views/Money.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'landing', component: LandingPage },
        { path: '/login', name: 'login', component: Login },
        { path: '/signup', name: 'signup', component: Signup },
        { path: '/chores', name: 'chores', component: Chores },
        { path: '/money', name: 'money', component: Money },
    ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')