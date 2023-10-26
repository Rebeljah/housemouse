<script setup lang="ts">
import { auth } from '../firebase/instances'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { Ref, ref } from 'vue'

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const selectedTab: Ref<'signin' | 'signup'> = ref('signin')

function submit() {
  if (selectedTab.value == 'signin') {
    signIn()
  } else {
    signUp()
  }
}

function signIn() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch(console.log)
    .then(() => alert('oops, we could not log you in'))
}

function signUp() {
  if (password.value !== passwordConfirmation.value) {
    alert('The passwords do not match')
    return
  }
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .catch(console.log)
    .then(() => alert('oops, we failed to create your account'))
}
</script>

<template>
  <div class="form-content">
    <div class="form-tabs">
      <button @click="selectedTab = 'signin'" class="tab" :class="{ 'tab-active': selectedTab == 'signin' }">Login</button>
      <button @click="selectedTab = 'signup'" class="tab" :class="{ 'tab-active': selectedTab == 'signup' }">Signup</button>
    </div>
    <div class="form-container">
      <form @submit.prevent="submit">
        <div class="form-fields">
          <label for="email">E-mail</label>
          <input v-model="email" type="text" id="email">
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password">
          <label v-show="selectedTab == 'signup'" for="passwordConfirmation">Confirm password</label>
          <input v-show="selectedTab == 'signup'" v-model="passwordConfirmation" type="password" id="passwordConfirmation">
          <button type="submit">{{ selectedTab == 'signup' ? 'Create new account' : 'Login' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(211, 211, 211);
}

.form-tabs {
  display: flex;
  width: 100%;
}

.tab {
  background-color: rgb(211, 211, 211);
  flex: 1;
  height: 40px;
  margin: 0px;
  border-radius: 0px;
  border-style: none;
}

.tab.tab-active {
  border-style: solid;
  border-color: bisque;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-fields {
  display: flex;
  flex-direction: column;
}</style>
