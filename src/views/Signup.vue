<script setup lang="ts">
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'

const email = ref('');
const password = ref('');

function signUp(){
  console.log("signing up", email.value)

  createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    console.log("signed up user", userCredential)
  })
  .catch((error) => {
    console.log(error.code, error.message)
  });

  email.value = '';
  password.value = '';
}
</script>

<template>
  <p>signup using your email and password</p>
  <form action="#" @submit.prevent="">
    <label for="emailInput">email</label>
    <input v-model="email" type="text" id="emailInput">
    <br>
    <label for="passwordInput">password</label>
    <input v-model="password" type="password" id="passwordInput">
    <br>
    <button type="submit" @click="signUp">sign up</button>
  </form>
</template>