<script setup lang="ts">
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/instances';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

// for updating UI based on errors from firebase auth
const errorEmailInUse = ref(false);
const errorInvalidEmail = ref(false);
const errorWeakPassword = ref(false);
const errorCouldNotSignup = ref(false); // for all other errors

async function submit() {
  if (password.value === '' || email.value === '') {
    alert('Please enter a username and password');
    return;
  };

  if (password.value !== passwordConfirmation.value) {
    alert('The password do not match');
    return;
  };
  if (password.value.length < 6) {
    alert('passwords must be at least 6 characters');
    return;
  };

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
  } catch (e: any) {
    switch (e.code) {
      case 'auth/email-already-in-use': errorEmailInUse.value = true; break;
      case 'auth/invalid-email': errorInvalidEmail.value = true; break;
      case 'auth/weak-password': errorWeakPassword.value = true; break;
      default: errorCouldNotSignup.value = true; throw e;
    }
  };
}

</script>

<template>
  <form @submit.prevent="submit">
    <div class="container">
      <label for="email">E-mail</label>
      <input v-model="email" type="text" id="email">
      <label for="password">Password</label>
      <input v-model="password" type="password" id="password">
      <label for="passwordConfirmation">Confirm password</label>
      <input v-model="passwordConfirmation" type="password" id="passwordConfirmation">
      <button type="submit">Create account</button>
    </div>
  </form>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  background: #1f1f1f1f
}
</style>