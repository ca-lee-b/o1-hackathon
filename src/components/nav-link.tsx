'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`block rounded px-4 py-2 text-sm transition-colors ${
        isActive
          ? 'border-l-2 border-[var(--accent-blue)] bg-[var(--accent-blue)]/5 pl-[14px] text-white'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
