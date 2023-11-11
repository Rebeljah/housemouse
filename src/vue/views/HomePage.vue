<script setup lang="ts">
import TabbedForm from '../components/TabbedForm.vue'
import SignUpForm from '../components/SignUpForm.vue';
import SignInForm from '../components/SignInForm.vue';
import JoinHomeForm from '../components/JoinHomeForm.vue'
import CreateHomeForm from '../components/CreateHomeForm.vue'

// define tabs for tabbed form component
const authTabs = [
  { title: 'Log in', tabComponent: SignInForm },
  { title: 'Create account', tabComponent: SignUpForm },
]
const chooseHomeTabs = [
{ title: 'Join home', tabComponent: JoinHomeForm },
{ title: 'Create Home', tabComponent: CreateHomeForm },
]
</script>

<template>
  <div class="content">
    <div class="banner-area">
      <h1>House Mouse</h1>
      <img src="banner_logo.png" class="banner-logo">
    </div>
    <TabbedForm v-if="uiMode === 'auth'" :tabs="authTabs" />
    <TabbedForm v-else :tabs="chooseHomeTabs"/>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

h1 {
  text-align: center;
}

.banner-logo {
  width: clamp(200px, 50vw, 30dvw);
  aspect-ratio: 1 / 1;
}
</style>