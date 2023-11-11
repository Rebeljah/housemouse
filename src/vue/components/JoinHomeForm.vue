<script setup lang="ts">
import { ref } from 'vue';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/instances';


const joinHomeWithInviteCode = httpsCallable(functions, 'joinHomeWithInviteCode')
const inviteCode = ref('');

async function onSubmit() {
  if (!inviteCode.value) return;

  try {
    await joinHomeWithInviteCode({inviteCode: inviteCode.value});
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
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