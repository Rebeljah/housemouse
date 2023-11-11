<script setup lang="ts">
import { ref } from 'vue';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/instances';

const createNewHome = httpsCallable(functions, 'createNewHome');

const homeName = ref('')

async function onSubmit() {
  if (!homeName.value) return;

  try {
    await createNewHome(homeName.value);
  } catch (e) {
    console.error(e);
  }
}

</script>

<template>
  <div class="container">
    <form @submit.prevent="onSubmit">
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