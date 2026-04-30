<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const name = ref('')
const email = ref('')
const company = ref('')
const message = ref('')

function onSubmit() {
  toast.success('Brief sent!', {
    description: 'Please also email directly for faster coordination.'
  })
  name.value = ''
  email.value = ''
  company.value = ''
  message.value = ''
}
</script>

<template>
  <section class="container mx-auto px-4 py-12 md:px-8 md:py-20">
    <div class="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <!-- Left -->
      <div v-motion :initial="{ opacity: 0, y: 24 }" :visible="{ opacity: 1, y: 0 }">
        <p class="eyebrow mb-4">Contact</p>
        <h1 class="title-display text-5xl md:text-7xl">Let&rsquo;s Build<br />Something Useful</h1>
        <p class="text-muted mt-6 text-base leading-relaxed md:text-lg">
          Share your current challenge, timeline, and expected outcome. I&rsquo;ll respond with a
          focused recommendation and realistic delivery approach.
        </p>
        <div class="text-muted mt-8 space-y-2 text-sm">
          <p>
            Email:
            <a class="text-accent hover:underline" href="mailto:rickifriadi.dev@gmail.com">
              rickifriadi.dev@gmail.com
            </a>
          </p>
          <p>Timezone: Asia/Jakarta (UTC+7)</p>
        </div>
      </div>

      <!-- Form -->
      <form
        class="border-border rounded-2xl border p-6 md:p-8"
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visible="{ opacity: 1, y: 0 }"
        :delay="100"
        @submit.prevent="onSubmit"
      >
        <h2 class="text-xl font-semibold md:text-2xl">Project Brief</h2>
        <p class="text-muted mt-1 text-sm">Fields marked with * are required.</p>

        <div class="mt-6 space-y-5">
          <div>
            <Label for="contact-name" class="mb-2 block">Name *</Label>
            <Input
              id="contact-name"
              v-model="name"
              name="name"
              autocomplete="name"
              placeholder="Your full name…"
              required
            />
          </div>

          <div>
            <Label for="contact-email" class="mb-2 block">Email *</Label>
            <Input
              id="contact-email"
              v-model="email"
              type="email"
              inputmode="email"
              name="email"
              autocomplete="email"
              spellcheck="false"
              placeholder="you@company.com…"
              required
            />
          </div>

          <div>
            <Label for="contact-company" class="mb-2 block">Company</Label>
            <Input
              id="contact-company"
              v-model="company"
              name="company"
              autocomplete="organization"
              placeholder="Company or team name…"
            />
          </div>

          <div>
            <Label for="contact-message" class="mb-2 block">Project Details *</Label>
            <Textarea
              id="contact-message"
              v-model="message"
              name="message"
              autocomplete="off"
              placeholder="Scope, timeline, and expected outcomes…"
              required
            />
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <Button as="button" type="submit">Send Brief</Button>
          <span class="text-muted text-xs">Response target: 1–2 business days.</span>
        </div>
      </form>
    </div>
  </section>
</template>
