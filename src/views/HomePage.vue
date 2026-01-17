<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          Ricki Friadi
        </h1>
        <p class="text-xl md:text-2xl text-muted mb-8">
          Fullstack Developer specializing in Node.js & TypeScript
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" as="a" href="#projects">
            View My Work
          </Button>
          <Button size="lg" variant="outline" as="a" href="/contact">
            Let's Talk
          </Button>
        </div>
      </div>
    </section>

    <!-- Component Demo Section -->
    <section class="container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold mb-8 text-center">UI Components Demo</h2>
      
      <!-- Buttons -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-4">Buttons</h3>
        <div class="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <!-- Badges -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-4">Badges</h3>
        <div class="flex flex-wrap gap-2">
          <Badge>Node.js</Badge>
          <Badge>TypeScript</Badge>
          <Badge>Vue 3</Badge>
          <Badge variant="secondary">React</Badge>
          <Badge variant="outline">PostgreSQL</Badge>
        </div>
      </div>

      <!-- Cards -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-4">Cards</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project 1</CardTitle>
              <CardDescription>E-commerce Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm mb-4">
                Built a scalable e-commerce platform handling 10K+ daily transactions.
              </p>
              <div class="flex flex-wrap gap-2">
                <Badge>Node.js</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>Vue 3</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project 2</CardTitle>
              <CardDescription>API Gateway</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm mb-4">
                Microservices API gateway with rate limiting and authentication.
              </p>
              <div class="flex flex-wrap gap-2">
                <Badge>Express</Badge>
                <Badge>Redis</Badge>
                <Badge>Docker</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project 3</CardTitle>
              <CardDescription>Real-time Dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm mb-4">
                Analytics dashboard with WebSocket updates and data visualization.
              </p>
              <div class="flex flex-wrap gap-2">
                <Badge>Socket.io</Badge>
                <Badge>Chart.js</Badge>
                <Badge>MongoDB</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Skeleton Loaders -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-4">Skeleton Loaders</h3>
        <div class="space-y-4 max-w-md">
          <Skeleton class="h-12 w-full" />
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-4 w-1/2" />
        </div>
      </div>
    </section>
  </div>
</template>
