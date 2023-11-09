<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue'


interface TabInfo { title: string, tabComponent: Component }

const props = defineProps<{
  tabs: TabInfo[]
}>()

const activeTabTitle = ref(props.tabs[0].title)
function setActive(tab: TabInfo) {
  activeTabTitle.value = tab.title
}

const activeTabComponent = computed(() => {
  return props.tabs.filter(tab => tab.title === activeTabTitle.value)[0].tabComponent
})

const tabClasses = computed(() => {
  const res: any = {}
  props.tabs.forEach((info) => {
    res[info.title] = {
    'tab-button': true,
    'tab-button-active': info.title === activeTabTitle.value,
    'tab-button-inactive': info.title !== activeTabTitle.value
  }
  })
  return res
})

</script>

<template>
  <div class="tabbed-form-container">
    <div class="buttons-container">
      <button v-for="tab in tabs" :key="tab.title" @click="setActive(tab)" :class="tabClasses[tab.title]">{{ tab.title }}</button>
    </div>
    <component :is="activeTabComponent" />
  </div>
</template>

<style scoped>
.tabbed-form-container {
  display: grid;
  grid-template-rows: min-content 1fr;
}

.buttons-container {
  display: flex;
  flex-direction: row;
}

.tab-button {
  background-color: hsl(0, 0%, 83%);
  flex: 1;
  height: 40px;
  margin: 0px;
  border-radius: 0px;
  border-style: none;
}

.tab-button-active {
  border-style: ridge;
  border-color: black;
  border-bottom: none;
}
</style>
