<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BlogArticle {
  slug: string
  title: string
  publishedAt: string
  readTime: string
  intro: string
  points: string[]
}

const route = useRoute()

const articles: BlogArticle[] = [
  {
    slug: 'service-boundaries-with-typescript',
    title: 'Service Boundaries With TypeScript Contracts',
    publishedAt: 'April 2026',
    readTime: '7 min read',
    intro:
      'Strong contracts keep service ownership clear. The key is versioning interfaces as intentionally as you version APIs.',
    points: [
      'Keep contracts in an independent package with semantic versioning.',
      'Expose compatibility tests in CI for every downstream consumer.',
      'Promote breaking changes behind feature flags before hard migrations.'
    ]
  },
  {
    slug: 'shipping-fast-without-regressions',
    title: 'Shipping Fast Without Regression Debt',
    publishedAt: 'March 2026',
    readTime: '6 min read',
    intro:
      'Fast delivery only works when quality checks are automated and meaningful, not broad and noisy.',
    points: [
      'Gate deployments with selective tests aligned to changed modules.',
      'Use progressive rollout and error budgets instead of all-or-nothing launches.',
      'Make rollback frictionless with immutable build artifacts.'
    ]
  },
  {
    slug: 'ui-systems-that-scale',
    title: 'UI Systems That Scale Across Teams',
    publishedAt: 'February 2026',
    readTime: '8 min read',
    intro:
      'A durable UI system is less about aesthetics and more about operational consistency under change.',
    points: [
      'Define token intent before token values to reduce theme churn.',
      'Treat accessibility requirements as component API contracts.',
      'Track performance and contrast regressions in pull request checks.'
    ]
  }
]

const article = computed(() => articles.find((item) => item.slug === route.params.slug))
</script>

<template>
  <section class="container mx-auto px-4 py-16 md:px-8 md:py-20">
    <article v-if="article" class="mx-auto max-w-3xl">
      <p class="eyebrow mb-4 inline-flex">Article</p>
      <h1 class="title-display text-5xl leading-tight md:text-7xl">{{ article.title }}</h1>
      <p class="text-muted mt-4 font-mono text-xs tracking-[0.16em] uppercase">
        {{ article.publishedAt }} • {{ article.readTime }}
      </p>
      <p class="text-muted mt-8 text-base leading-relaxed md:text-lg">{{ article.intro }}</p>

      <section class="soft-panel mt-8 p-5 md:p-6">
        <h2 class="title-display text-3xl">Key Takeaways</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="point in article.points"
            :key="point"
            class="text-muted text-sm leading-relaxed md:text-base"
          >
            {{ point }}
          </li>
        </ul>
      </section>

      <div class="mt-8">
        <Button as="a" href="/blog" variant="outline">Back To Blog</Button>
      </div>
    </article>

    <article v-else class="mx-auto max-w-2xl text-center">
      <h1 class="title-display text-5xl md:text-6xl">Article Not Found</h1>
      <p class="text-muted mt-4 text-base leading-relaxed md:text-lg">
        The requested post is not available. Browse the latest notes in the blog index.
      </p>
      <div class="mt-8">
        <Button as="a" href="/blog">Open Blog Index</Button>
      </div>
    </article>
  </section>
</template>
