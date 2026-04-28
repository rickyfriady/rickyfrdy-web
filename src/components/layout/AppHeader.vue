<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Briefcase, Home, Info, Layers, Mail } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

interface NavItem {
  name: string
  path: string
  icon: typeof Home
  index: string
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home, index: '01' },
  { name: 'About', path: '/about', icon: Info, index: '02' },
  { name: 'Works', path: '/works', icon: Layers, index: '03' },
  { name: 'Projects', path: '/projects', icon: Briefcase, index: '04' },
  { name: 'Contact', path: '/contact', icon: Mail, index: '05' }
]

const isActive = (path: string) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const railLinkClass = (path: string) =>
  isActive(path)
    ? 'border-l-2 border-accent text-foreground bg-secondary'
    : 'border-l-2 border-transparent text-muted hover:text-foreground hover:bg-secondary'
</script>

<template>
  <!-- Desktop: Fixed left rail -->
  <aside
    class="border-border bg-background fixed top-0 left-0 z-50 hidden h-screen w-[220px] flex-col border-r lg:flex"
  >
    <RouterLink to="/" aria-label="Ricki Friadi — Home" class="flex flex-col gap-1 px-6 pt-8 pb-6">
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
        :aria-current="isActive(item.path) ? 'page' : undefined"
        class="focus-visible:ring-accent flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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

  <!-- Mobile: floating pill nav -->
  <nav class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden">
    <div
      class="flex items-center gap-0.5 rounded-full px-1.5 py-1.5"
      style="
        background: color-mix(in oklch, var(--color-background) 85%, transparent);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--color-border);
        box-shadow:
          0 4px 24px oklch(0 0 0 / 0.08),
          0 1px 4px oklch(0 0 0 / 0.06);
      "
    >
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :aria-label="item.name"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        class="relative flex flex-col items-center gap-1 rounded-full px-3.5 py-2 transition-colors duration-200"
        :class="isActive(item.path) ? 'text-accent' : 'text-muted hover:text-foreground'"
      >
        <!-- Active indicator dot -->
        <span
          v-if="isActive(item.path)"
          class="absolute top-1.5 h-1 w-1 rounded-full"
          style="background: var(--color-accent)"
        />
        <component :is="item.icon" class="h-5 w-5" />
        <span class="font-mono text-[9px] tracking-[0.08em] uppercase">{{ item.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
