import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'
import { NavLink } from '@/components/nav-link'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email || 'User'
  const plan = profile?.plan || 'free'

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <aside className="flex w-64 flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="border-b border-[var(--border)] p-6">
          <h1 className="text-xl font-bold tracking-tight text-white">Finova</h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">AI Financial Advisor</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/transactions">Transactions</NavLink>
          <NavLink href="/goals">Goals</NavLink>
          <NavLink href="/plan">Plan</NavLink>
          <NavLink href="/recommendations">Recommendations</NavLink>
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="truncate text-sm text-white">{displayName}</p>
              <span
                className={`font-[var(--font-mono)] text-xs px-2 py-0.5 rounded uppercase tracking-wider ${
                  plan === 'premium'
                    ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                }`}
              >
                {plan === 'premium' ? 'PRO' : 'FREE'}
              </span>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left text-sm text-[var(--text-secondary)] transition-colors hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
