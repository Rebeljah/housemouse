<script setup lang="ts">
import { ref } from 'vue';

const inviteCode = ref('')

function submit() {

}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="container">
      <label for="inviteCode">Invite Code</label>
      <input v-models="inviteCode" type="text" id="inviteCode">
      <button type="submit">Join</button>
    </div>
  </form>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  background-color: #1f1f1f1f;
}
</style>