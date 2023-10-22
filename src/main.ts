import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'login', component: Login },
        { path: '/home/:homeId', name: 'home', component: Home }
    ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')