import { describe, expect, it } from 'vitest'
import { alternatePath, isIdPath, stripLocale } from '@/i18n/path'

describe('alternatePath()', () => {
  it.each([
    ['/', '/id'],
    ['/about', '/id/about'],
    ['/projects', '/id/projects'],
    ['/id', '/'],
    ['/id/about', '/about'],
    ['/id/projects', '/projects']
  ])('maps the twin %s to %s', (from, to) => {
    expect(alternatePath(from)).toBe(to)
  })

  it.each([
    ['/blog', '/id'],
    ['/blog/microservices-with-nestjs', '/id'],
    ['/projects/singel-app', '/id/projects'],
    ['/changelog', '/id']
  ])('sends the English-only %s to %s', (from, to) => {
    expect(alternatePath(from)).toBe(to)
  })
})

describe('locale helpers', () => {
  it('recognises Indonesian paths without matching look-alikes', () => {
    expect(isIdPath('/id')).toBe(true)
    expect(isIdPath('/id/about')).toBe(true)
    expect(isIdPath('/idea')).toBe(false)
  })

  it('strips the locale', () => {
    expect(stripLocale('/id')).toBe('/')
    expect(stripLocale('/id/about')).toBe('/about')
    expect(stripLocale('/about')).toBe('/about')
  })
})
