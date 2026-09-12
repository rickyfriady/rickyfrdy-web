import '@testing-library/jest-dom'
import { JSDOM } from 'jsdom'

// Node 24 defines its own experimental `localStorage` getter that returns
// undefined unless the process was started with --localstorage-file. It sits
// on globalThis, so it shadows the one jsdom installs and every store test
// dies on `localStorage.clear()`. Borrow a real Storage from a throwaway
// jsdom window rather than hand-rolling a shim: it keeps the spec behaviour
// tests rely on (string coercion, length, key()).
const donor = new JSDOM('', { url: 'http://localhost/' }).window

for (const name of ['localStorage', 'sessionStorage'] as const) {
  if (globalThis[name] === undefined) {
    Object.defineProperty(globalThis, name, {
      value: donor[name],
      configurable: true,
      writable: true
    })
  }
}
