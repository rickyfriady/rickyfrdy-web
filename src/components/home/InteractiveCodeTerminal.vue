<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Highlighter } from 'shiki'

const codeSnippets = [
  {
    language: 'typescript',
    code: `// Building scalable Node.js APIs
import express, { Request, Response } from 'express';
import { validateToken } from './middleware/auth';

const app = express();

app.get('/api/users', validateToken, async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    where: { active: true },
    select: { id: true, name: true, email: true }
  });
  
  return res.json({ success: true, data: users });
});

app.listen(3000, () => console.log('Server running'));`
  },
  {
    language: 'typescript',
    code: `// Type-safe database operations
interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

async function getUserWithStats(userId: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      orders: { where: { status: 'completed' } }
    }
  });
  
  return user ? transformUserData(user) : null;
}`
  },
  {
    language: 'typescript',
    code: `// Real-time WebSocket implementation
import { Server } from 'socket.io';
import { Redis } from 'ioredis';

const io = new Server(server);
const redis = new Redis();

io.on('connection', (socket) => {
  socket.on('join:room', async (roomId: string) => {
    await socket.join(roomId);
    const members = await redis.smembers(\`room:\${roomId}\`);
    socket.emit('room:members', members);
  });
  
  socket.on('message', (data) => {
    io.to(data.roomId).emit('new:message', data);
  });
});`
  }
]

const currentSnippetIndex = ref(0)
const highlightedCode = ref('')
const isPaused = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null
let highlighter: Highlighter | null = null

async function initHighlighter() {
  const { createHighlighter } = await import('shiki')
  highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript']
  })
  
  await updateHighlightedCode()
}

async function updateHighlightedCode() {
  if (!highlighter) return
  
  const snippet = codeSnippets[currentSnippetIndex.value]
  highlightedCode.value = highlighter.codeToHtml(snippet.code, {
    lang: snippet.language,
    theme: 'github-dark'
  })
}

function nextSnippet() {
  currentSnippetIndex.value = (currentSnippetIndex.value + 1) % codeSnippets.length
  updateHighlightedCode()
}

function prevSnippet() {
  currentSnippetIndex.value = currentSnippetIndex.value === 0 
    ? codeSnippets.length - 1 
    : currentSnippetIndex.value - 1
  updateHighlightedCode()
}

function startAutoRotate() {
  if (intervalId) return
  intervalId = setInterval(() => {
    if (!isPaused.value) {
      nextSnippet()
    }
  }, 5000)
}

function stopAutoRotate() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(async () => {
  await initHighlighter()
  startAutoRotate()
})

onUnmounted(() => {
  stopAutoRotate()
})
</script>

<template>
  <div 
    class="relative rounded-xl border border-border bg-dark-base overflow-hidden"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- Terminal Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-dark-elevated border-b border-border">
      <div class="flex items-center space-x-2">
        <div class="flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span class="text-xs text-muted ml-4">code-examples.ts</span>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="prevSnippet"
          class="text-muted hover:text-primary transition-colors p-1"
          aria-label="Previous code snippet"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span class="text-xs text-muted">
          {{ currentSnippetIndex + 1 }} / {{ codeSnippets.length }}
        </span>
        
        <button
          @click="nextSnippet"
          class="text-muted hover:text-primary transition-colors p-1"
          aria-label="Next code snippet"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Code Display -->
    <div class="relative overflow-x-auto">
      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          :key="currentSnippetIndex"
          class="p-6 text-sm leading-relaxed"
          v-html="highlightedCode"
        />
      </Transition>
    </div>

    <!-- Pause Indicator -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isPaused"
        class="absolute bottom-4 right-4 px-3 py-1 bg-accent/90 text-dark-base text-xs rounded-full"
      >
        Paused
      </div>
    </Transition>
  </div>
</template>

<style scoped>
:deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent !important;
}

:deep(code) {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.7;
}
</style>
