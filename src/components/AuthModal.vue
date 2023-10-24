<script setup lang="ts">
import { ref } from 'vue';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/instances'

// define props and emits
const props = defineProps<{
  mode: "login" | "signup"
}>()
const emit = defineEmits(["close-modal"])

// state
const email = ref('');
const password = ref('');

function close() {
  email.value = '';
  password.value = '';
  emit('close-modal')
}

function submit() {
  if (props.mode === 'login') {
    login()
  } else if (props.mode === 'signup') {
    signup()
  }
}

function signup(){
  console.log("signing up", email.value)

  createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    console.log("signed up user", userCredential)
    close()
  })
  .catch((error) => {
    console.log(error.code, error.message)
  });

  
}

function login(){
  console.log("logging in", email.value)

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("user logged in", userCredential);
      close()
    })
    .catch((error) => {
      console.log("error logging in", error.code, error.message)
    });
    
}
</script>

<template>
  <div id="auth-modal">
    <form action="#" @submit.prevent="">
      <label for="emailInput">email</label>
      <input v-model="email" type="text" id="emailInput">
      <br>
      <label for="passwordInput">password</label>
      <input v-model="password" type="password" id="passwordInput">
      <br>
      <button type="submit" @click="submit">{{props.mode == 'login' ? 'Log in':'Sign up'}}</button>
    </form>
  <button @click="close">close</button>
  </div>
</template>

<style scoped>
#auth-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: cadetblue;
}
</style>../firebase/firebase../firebase/init