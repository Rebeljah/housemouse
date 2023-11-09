import { initFirebaseInstances } from './firebase/instances'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './vue/App.vue'
import HomePage from './vue/views/HomePage.vue'
import Chores from './vue/views/Chores.vue'
import Money from './vue/views/Money.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'homePage', component: HomePage },
        { path: '/chores', name: 'chores', component: Chores },
        { path: '/money', name: 'money', component: Money },
    ]
})

initFirebaseInstances()
const app = createApp(App)
app.use(router)
app.mount('#app')