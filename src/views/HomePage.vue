<script setup lang="ts">
import { auth } from '../firebase/instances'

import TabbedAuthForm from '../components/TabbedAuthForm.vue';
import { ref } from 'vue'

// auth listener to check for when the user logs in/out
const userIsLoggedIn = ref(Boolean(auth.currentUser))
auth.onAuthStateChanged((authUser) => {
  userIsLoggedIn.value = Boolean(authUser)
})
</script>

<template>
  <div class="content">
    <div class="banner-area">
      <div class="banner"></div>
    </div>
    <TabbedAuthForm  v-if="!userIsLoggedIn"/>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 10vh;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.banner-area {
  display: flex;
  justify-content: center;
  padding: 10% 0;
}

.banner {
  min-width: 100px;
  min-height: 100px;
  background-color: bisque;
}
</style>