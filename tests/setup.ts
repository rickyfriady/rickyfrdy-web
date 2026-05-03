import '@testing-library/jest-dom'
import { createHead } from '@unhead/vue/client'
import { config } from '@vue/test-utils'

// Provide @unhead/vue head instance globally so useHead() works in component tests
const head = createHead()
config.global.plugins.push(head as never)
