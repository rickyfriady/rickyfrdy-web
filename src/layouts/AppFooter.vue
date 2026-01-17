<script setup lang="ts">
import { Github, Linkedin, Twitter, Mail } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'

const currentYear = new Date().getFullYear()

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/rickyfrdy' },
  { name: 'LinkedIn', icon: Linkedin, url: '#' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'Email', icon: Mail, url: 'mailto:contact@example.com' }
]

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' }
]
</script>

<template>
  <footer class="border-t border-border bg-background">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand & Description -->
        <div>
          <h3 class="text-lg font-bold mb-2">Ricki Friadi</h3>
          <p class="text-sm text-muted mb-4">
            Fullstack Developer specializing in Node.js & TypeScript with 4 years of experience building scalable systems.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-sm font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.path">
              <RouterLink 
                :to="link.path"
                class="text-sm text-muted hover:text-accent transition-colors"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Social Links -->
        <div>
          <h4 class="text-sm font-semibold mb-4">Connect</h4>
          <div class="flex space-x-4">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted hover:text-accent transition-colors"
              :aria-label="social.name"
            >
              <component :is="social.icon" class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <Separator class="my-8" />

      <div class="text-center text-sm text-muted">
        <p>© {{ currentYear }} Ricki Friadi. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
