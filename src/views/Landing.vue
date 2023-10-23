<script setup lang="ts">

import { auth } from '../firebase'

const userHomes: string[] = ["home 1", "home 2"];

</script>

<template>
  <h1>You are in landing page view</h1>
  <div v-if="auth.currentUser !== null">
    <p>Select a home</p>
    <ul>
      <li v-for="home in userHomes">
        {{ home }}
      </li>
    </ul>
  </div>
  <div v-else>
    <router-link :to="{ name: 'login' }">sign in</router-link>
    <br>
    <router-link :to="{ name: 'signup' }">sign up</router-link>
  </div>
</template>