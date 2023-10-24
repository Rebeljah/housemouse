<script setup lang="ts">
import { auth } from '../firebase/instances'
import { ref } from 'vue'

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
      <button @click="auth.signOut">Log out</button>
    </div>
  </div>
</template>

<style scoped>
#navbar {
  background-color: aquamarine;
}
</style>../firebase/firebase../firebase/init