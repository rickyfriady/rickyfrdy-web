<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Briefcase, Home, Info, Layers, Mail } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'Home', path: '/', icon: Home, index: '01' },
  { name: 'About', path: '/about', icon: Info, index: '02' },
  { name: 'Works', path: '/works', icon: Layers, index: '03' },
  { name: 'Projects', path: '/projects', icon: Briefcase, index: '04' },
  { name: 'Contact', path: '/contact', icon: Mail, index: '05' }
]

const isActive = (path: string) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const railLinkClass = computed(
  () => (path: string) =>
    isActive(path)
      ? 'border-l-2 border-accent text-foreground bg-secondary'
      : 'border-l-2 border-transparent text-muted hover:text-foreground hover:bg-secondary'
)
</script>

<template>
  <!-- Desktop: Fixed left rail -->
  <aside
    class="border-border bg-background fixed top-0 left-0 z-50 hidden h-screen w-[220px] flex-col border-r lg:flex"
  >
    <RouterLink to="/" class="flex flex-col gap-1 px-6 pt-8 pb-6">
      <span class="title-display text-2xl leading-none">Ricki</span>
      <span
        class="text-muted hover:text-accent font-mono text-[10px] tracking-[0.22em] uppercase transition-colors duration-200"
      >
        Friadi
      </span>
    </RouterLink>

    <nav class="flex flex-col gap-0.5 px-3" aria-label="Primary navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200"
        :class="railLinkClass(item.path)"
      >
        <span class="text-muted/50 w-5 font-mono text-[10px]">{{ item.index }}</span>
        {{ item.name }}
      </RouterLink>
    </nav>

    <div class="flex-1" />

    <div class="px-4 pb-8">
      <Button as="a" href="/contact" variant="outline" size="sm" class="w-full text-xs">
        Start a Project
      </Button>
    </div>
  </aside>

  <!-- Mobile: Bottom tab bar -->
  <nav
    class="border-border bg-background/95 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-stretch border-t backdrop-blur-sm lg:hidden"
    style="padding-bottom: env(safe-area-inset-bottom)"
    aria-label="Mobile navigation"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200"
      :class="isActive(item.path) ? 'text-accent' : 'text-muted hover:text-foreground'"
    >
      <component :is="item.icon" class="h-5 w-5" />
      <span class="text-[10px] font-medium">{{ item.name }}</span>
    </RouterLink>
  </nav>
</template>
