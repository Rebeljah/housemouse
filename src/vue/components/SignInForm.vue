<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/instances';
import { ref } from 'vue';

const email = ref('');
const password = ref('');

// for updating UI based on errors from firebase auth
const errorInvalidEmail = ref(false);
const errorWrongPassword = ref(false);
const errorCouldNotSignin = ref(false); // for all other errors

async function submit() {
  if (password.value === '' || email.value === '') {
    alert('Please enter a username and password');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
  } catch (e: any) {
    switch (e.code) {
      case 'auth/invalid-email': errorInvalidEmail.value = true; break;
      case 'auth/wrong-password': errorWrongPassword.value = true; break;
      default: errorCouldNotSignin.value = true; break;
    }
  }

  
}

</script>

<template>
  <form @submit.prevent="submit">
    <div class="container">
      <label for="email">E-mail</label>
      <input v-model="email" type="text" id="email">
      <label for="password">Password</label>
      <input v-model="password" type="password" id="password">
      <p v-if="errorInvalidEmail">Invalid email.</p>
      <p v-else-if="errorWrongPassword">Wrong password.</p>
      <p v-else-if="errorCouldNotSignin">An error occurred, try again.</p>
      <button type="submit">Login</button>
    </div>
  </form>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  background-color: #1f1f1f1f;
}
</style>