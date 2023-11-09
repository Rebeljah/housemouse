<script setup lang="ts">
</script>

<template>
  <div class="nav-bar">
    <router-link :to="{name: 'homePage'}">Home Page</router-link>
    <router-link :to="{name: 'chores'}">Chores</router-link>
    <router-link :to="{name: 'money'}">Money</router-link>
  </div>
</template>

<style scoped>
.nav-bar {
  background-color: #333; /* Background color for the sidebar */
  color: #fff; /* Text color for links */
  width: 200px; /* Set the width of the sidebar */
  padding: 20px; /* Add some padding for spacing */
}

.nav-bar a {
  text-decoration: none;
  color: #fff; /* Text color for links */
  display: block; /* Display links as block elements for better spacing */
  margin: 10px 0; /* Add margin to separate links */
  font-size: 18px; /* Adjust the font size */
}

/* Style for the active link */
.nav-bar a.router-link-exact-active {
  font-weight: bold; /* Make the active link bold */
  background-color: #555; /* Background color for the active link */
  border-radius: 5px; /* Add rounded corners to the active link */
  padding: 5px; /* Add padding to the active link */
}
</style>