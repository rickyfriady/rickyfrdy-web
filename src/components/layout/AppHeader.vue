<script setup lang="ts">
import { Briefcase, FileText, Home, Info, Layers, Mail } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

interface NavItem {
  name: string
  path: string
  icon: typeof Home
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Experience', path: '/experience', icon: FileText },
  { name: 'Works', path: '/works', icon: Layers },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Contact', path: '/contact', icon: Mail }
]

const isActive = (path: string) => (path === '/' ? route.path === '/' : route.path.startsWith(path))
</script>

<template>
  <!-- Skip to main content (screen readers + keyboard users) -->
  <a
    href="#main-content"
    class="bg-accent text-background sr-only fixed top-2 left-2 z-[9999] rounded-md px-4 py-2 text-sm font-semibold focus:not-sr-only focus:outline-none"
  >
    Skip to main content
  </a>

  <!-- Sticky horizontal top bar — glass matching the mobile pill nav -->
  <header
    class="fixed top-0 right-0 left-0 z-50 h-14"
    style="
      background: color-mix(in oklch, var(--color-background) 78%, transparent);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid color-mix(in oklch, var(--color-border) 65%, transparent);
      box-shadow:
        0 1px 20px oklch(0 0 0 / 0.06),
        0 0.5px 4px oklch(0 0 0 / 0.04),
        inset 0 1px 0 oklch(1 0 0 / 0.08);
    "
  >
    <div class="mx-auto flex h-full max-w-[680px] items-center justify-between px-4">
      <!-- Logo -->
      <RouterLink to="/" aria-label="Ricki Friadi — Home" class="flex items-baseline gap-1.5">
        <span class="title-display text-xl leading-none">Ricki</span>
        <span
          class="text-muted hover:text-accent font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
        >
          Friadi
        </span>
      </RouterLink>

      <!-- Nav links — hidden below sm breakpoint (pill nav handles mobile) -->
      <nav class="hidden items-center gap-0.5 sm:flex" aria-label="Primary navigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :aria-current="isActive(item.path) ? 'page' : undefined"
          class="nav-link focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          :class="isActive(item.path) ? 'is-active border-accent' : ''"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </header>

  <!-- Mobile: floating pill nav (visible below sm breakpoint) -->
  <nav class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 sm:hidden">
    <div
      class="flex items-center gap-0.5 rounded-full px-1.5 py-1.5"
      style="
        background: color-mix(in oklch, var(--color-background) 88%, transparent);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--color-border);
        box-shadow:
          0 4px 24px oklch(0 0 0 / 0.06),
          0 1px 4px oklch(0 0 0 / 0.04);
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
        <span
          v-if="isActive(item.path)"
          aria-hidden="true"
          class="absolute top-1.5 h-1 w-1 rounded-full"
          style="background: var(--color-accent)"
        />
        <component :is="item.icon" class="h-5 w-5" />
        <span class="font-mono text-[9px] tracking-[0.08em] uppercase">{{ item.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
