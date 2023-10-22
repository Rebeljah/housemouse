<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');

function login(){
  console.log("logging in" ,username.value, password.value)
  username.value = '';
  password.value = '';
}

function signUp(){
  console.log("signing up", username.value, password.value)
  username.value = '';
  password.value = '';
}
</script>

<template>
  <p>login using your email and password</p>
  <form action="#" @submit.prevent="">
    <label for="usernameInput">username</label>
    <input v-model="username" type="text" id="usernameInput">
    <br>
    <label for="passwordInput">password</label>
    <input v-model="password" type="password" id="passwordInput">
    <br>
    <button type="submit" @click="login">login</button>
    <button type="submit" @click="signUp">sign up</button>
  </form>
</template>