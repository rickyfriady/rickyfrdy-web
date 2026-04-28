<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/rickyfrdy' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/rickyfrdy' },
  { name: 'Email', icon: Mail, url: 'mailto:rickifriadi.dev@gmail.com' }
]
</script>

<template>
  <footer class="border-border border-t px-4 py-8">
    <div class="mb-4 flex justify-center gap-5">
      <a
        v-for="social in socialLinks"
        :key="social.name"
        :href="social.url"
        :aria-label="social.name"
        target="_blank"
        rel="noopener noreferrer"
        class="text-muted hover:text-foreground transition-colors duration-200"
      >
        <component :is="social.icon" aria-hidden="true" class="h-4 w-4" />
      </a>
    </div>
    <p class="colophon">
      Ricki Friadi&nbsp;·&nbsp;Built with Vue 3 + Tailwind v4&nbsp;·&nbsp;Jakarta,&nbsp;{{
        currentYear
      }}
    </p>
  </footer>
</template>
