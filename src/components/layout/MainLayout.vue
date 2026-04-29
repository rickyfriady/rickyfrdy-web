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

    <!-- Outer wrapper carries the hatch texture + ambient gradient blobs -->
    <div class="hatch-gutter relative min-h-screen">
      <!-- Sage gradient blobs — give glass surfaces something to blur against -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 overflow-hidden"
        style="
          background:
            radial-gradient(
              ellipse 70% 45% at 50% 0%,
              oklch(0.62 0.09 160 / 0.09) 0%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 55% 40% at 15% 60%,
              oklch(0.62 0.09 160 / 0.06) 0%,
              transparent 65%
            ),
            radial-gradient(
              ellipse 45% 35% at 85% 85%,
              oklch(0.62 0.09 160 / 0.05) 0%,
              transparent 60%
            );
        "
      />
      <!-- Centered column: slightly translucent so blobs show through to glass cards -->
      <div
        class="border-border mx-auto min-h-screen max-w-[680px] border-x pt-14"
        style="background: color-mix(in oklch, var(--color-background) 91%, transparent)"
      >
        <main class="pb-28 sm:pb-8">
          <slot />
        </main>
        <AppFooter />
      </div>
    </div>
  </template>
</template>
