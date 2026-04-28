<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'

const route = useRoute()
const isImmersiveRoute = computed(() => route.path === '/works')
</script>

<template>
  <div class="relative min-h-screen overflow-x-clip">
    <AppHeader v-if="!isImmersiveRoute" />
    <main class="relative flex-1" :class="!isImmersiveRoute ? 'pb-28 lg:pb-0 lg:pl-[220px]' : ''">
      <slot />
    </main>
    <AppFooter v-if="!isImmersiveRoute" />
  </div>
</template>
