<script setup lang="ts">
import { ref, Ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import AuthModal from '../components/AuthModal.vue'

const showAuthModal: Ref<Boolean> = ref(false)
const authModalMode: Ref<'login' | 'signup'> = ref('login')

function displayAuthModal(mode: 'login' | 'signup') {
  showAuthModal.value = true
  authModalMode.value = mode
}

</script>

<template>
  <div>
    <NavBar 
      @click-login="displayAuthModal('login')" 
      @click-signup="displayAuthModal('signup')"
    />
    <AuthModal v-if="showAuthModal" :mode="authModalMode" @close-modal="showAuthModal = false"/>
  </div>
</template>
