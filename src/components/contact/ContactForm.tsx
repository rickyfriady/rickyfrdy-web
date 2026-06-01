import { useState } from 'react'
import type { ContactFormData } from '@/utils/contactSchema'
import { contactSchema } from '@/utils/contactSchema'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

type FieldErrors = Partial<Record<keyof ContactFormData, string>>

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const raw = Object.fromEntries(new FormData(form))

    const parsed = contactSchema.safeParse(raw)
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      setErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0]
      })
      return
    }

    setErrors({})
    setState('submitting')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.PUBLIC_WEB3FORMS_KEY,
          ...parsed.data
        })
      })
      const json = await res.json()
      if (json.success) {
        setState('success')
        form.reset()
      } else {
        setErrorMessage(json.message ?? 'Submission failed.')
        setState('error')
      }
    } catch {
      setErrorMessage('Network error — please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-8 text-center">
        <p className="text-accent font-display text-2xl font-light">Message sent.</p>
        <p className="text-muted mt-2 text-sm">I'll get back to you within a few days.</p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="text-accent mt-4 font-mono text-xs hover:underline"
        >
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {state === 'error' && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="text-muted font-mono text-xs tracking-widest uppercase">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="Your name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-muted font-mono text-xs tracking-widest uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="your@email.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-muted font-mono text-xs tracking-widest uppercase">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="What's on your mind?"
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="bg-accent text-background hover:bg-accent-hover disabled:opacity-50 inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
      >
        {state === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
