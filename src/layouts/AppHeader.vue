<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useScroll } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-vue-next'

const route = useRoute()
const mobileMenuOpen = ref(false)
const { y } = useScroll(window)

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' }
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <header 
    class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm transition-all"
    :class="{ 'shadow-sm': y > 10 }"
  >
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <RouterLink 
          to="/" 
          class="text-xl font-bold text-foreground hover:text-accent transition-colors"
        >
          RF
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-1">
          <RouterLink
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="isActive(item.path) 
              ? 'bg-accent/10 text-accent' 
              : 'text-foreground hover:bg-accent/5 hover:text-accent'"
          >
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- Mobile Menu Button -->
        <Button 
          variant="ghost" 
          size="icon" 
          class="md:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </Button>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav v-if="mobileMenuOpen" class="md:hidden pb-4">
          <div class="flex flex-col space-y-1">
            <RouterLink
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="isActive(item.path) 
                ? 'bg-accent/10 text-accent' 
                : 'text-foreground hover:bg-accent/5 hover:text-accent'"
              @click="mobileMenuOpen = false"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </nav>
      </Transition>
    </div>
  </header>
</template>
