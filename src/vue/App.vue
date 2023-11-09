<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar v-show="$route.name != 'homePage'"/>
  <router-view></router-view>
</template>
./currentUser