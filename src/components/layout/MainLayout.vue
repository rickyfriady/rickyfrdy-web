<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'

const route = useRoute()
const isImmersiveRoute = computed(() => route.path === '/works')
</script>

<template>
  <!-- Immersive route (/works): full-screen, no chrome -->
  <template v-if="isImmersiveRoute">
    <main class="relative min-h-screen">
      <slot />
    </main>
  </template>

  <!-- Normal routes: hatch bg + centered 680px column -->
  <template v-else>
    <AppHeader />

    <!-- Outer wrapper carries the hatch texture as the page background -->
    <div class="hatch-gutter relative min-h-screen">
      <!-- Centered column: white bg, left+right border, sits on the hatch -->
      <div class="border-border bg-background mx-auto min-h-screen max-w-[680px] border-x pt-14">
        <main class="pb-28 sm:pb-8">
          <slot />
        </main>
        <AppFooter />
      </div>
    </div>
  </template>
</template>
