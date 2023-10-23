<script setup lang="ts">
import { ref } from 'vue'

import { auth, logoutUser } from '../firebase'

const emit = defineEmits(['click-login', 'click-signup'])

const userLoggedIn = ref(false)

auth.onAuthStateChanged((user) => {
  userLoggedIn.value = user !== null
})

</script>

<template>
  <div id="navbar">
    <div v-if="!userLoggedIn">
      <button @click="emit('click-login')">Log in</button>
      <button @click="emit('click-signup')">Sign up</button>
    </div>
    <div v-else>
      <button @click="logoutUser">Log out</button>
    </div>
  </div>
</template>

<style scoped>
#navbar {
  background-color: aquamarine;
}
</style>