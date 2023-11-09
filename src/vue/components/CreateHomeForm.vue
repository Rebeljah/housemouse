<script setup lang="ts">
import { ref } from 'vue';

const homeName = ref('')

function submit() {
  
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="submit">
      <label for="homeName">Home name</label>
      <input v-models="homeName" type="text" id="homeName">
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  background-color: #1f1f1f1f;
}
</style>