'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Finova</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Your AI financial advisor</p>
      </div>

      <form onSubmit={handleLogin} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 font-[var(--font-mono)] text-[var(--text-primary)] outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--accent-blue)]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--accent-blue)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[var(--accent-blue)] py-3 font-medium text-white hover:bg-[var(--accent-blue)]/90 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-[var(--accent-red)]">{error}</p>}

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[var(--accent-blue)] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
