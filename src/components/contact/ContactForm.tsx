import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { ContactFormData } from '@/utils/contactSchema'
import { contactSchema } from '@/utils/contactSchema'

const DRAFT_KEY = 'contact-draft'
const DEBOUNCE_MS = 800

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type FieldErrors = Partial<Record<keyof ContactFormData, string>>

function loadDraft(): Partial<ContactFormData> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveDraft(data: Partial<ContactFormData>) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  } catch {
    /* quota exceeded */
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* noop */
  }
}

function Confetti() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.3,
    color: ['#2563eb', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)]
  }))
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-2 w-2 rounded-full"
          style={{ left: `${p.x}%`, top: '-10px', background: p.color }}
          initial={{ y: -20, opacity: 1, scale: 0 }}
          animate={{
            y: 400,
            opacity: [1, 1, 0],
            scale: [0, 1.5, 0],
            rotate: 360
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState('')

  // Controlled inputs for autosave
  const [name, setName] = useState(() => loadDraft().name ?? '')
  const [email, setEmail] = useState(() => loadDraft().email ?? '')
  const [message, setMessage] = useState(() => loadDraft().message ?? '')

  // Debounced autosave
  useEffect(() => {
    if (state === 'success') return
    const timer = setTimeout(() => {
      saveDraft({ name, email, message })
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [name, email, message, state])

  function getRaw(): Record<string, string> {
    return { name, email, message }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const raw = getRaw()

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
        clearDraft()
        setState('success')
      } else {
        setErrorMessage(json.message ?? 'Submission failed — try again.')
        setState('error')
      }
    } catch {
      setErrorMessage('Network error — please check your connection and try again.')
      setState('error')
    }
  }

  const reset = useCallback(() => {
    setState('idle')
    setErrors({})
    setErrorMessage('')
    setName('')
    setEmail('')
    setMessage('')
  }, [])

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-xl border border-accent/20 bg-accent/5 p-8 text-center overflow-hidden"
      >
        <Confetti />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
        >
          <CheckCircle className="text-accent mx-auto h-10 w-10" />
        </motion.div>
        <p className="text-accent font-display mt-4 text-2xl font-light">Message sent.</p>
        <p className="text-muted mt-2 text-sm">
          Thank you. I&apos;ll get back to you within a few days.
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-accent hover:text-accent-hover mt-5 font-mono text-xs uppercase tracking-wider transition-colors"
        >
          Send another →
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {state === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-500/20 bg-red-500/10 p-4"
        >
          <p className="text-sm text-red-500">{errorMessage}</p>
        </motion.div>
      )}

      {/* Honeypot — invisible to users, bots fill it */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field name="Name" id="name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="Your name"
        />
      </Field>

      <Field name="Email" id="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="your@email.com"
        />
      </Field>

      <Field name="Message" id="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="What's on your mind?"
        />
      </Field>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="bg-accent text-background hover:bg-accent-hover disabled:opacity-50 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {state === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </motion.form>
  )
}

function Field({
  name,
  id,
  error,
  children
}: {
  name: string
  id: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-muted font-mono text-xs tracking-widest uppercase">
        {name}
      </label>
      {children}
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: error ? 1 : 0, height: error ? 'auto' : 0 }}
        className="text-xs text-red-400 overflow-hidden"
      >
        {error ?? ' '}
      </motion.p>
    </div>
  )
}
