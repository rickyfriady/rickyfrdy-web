<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue'
import LoadingBar from '@/components/ui/LoadingBar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <LoadingBar />
  <MainLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="page-wipe" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </MainLayout>
</template>

<style scoped>
.page-wipe-enter-active {
  animation: wipe-reveal 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.page-wipe-leave-active {
  animation: wipe-conceal 0.28s ease-in both;
}
</style>
