'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const MENU = [
  { href: '/dashboard',     label: '통계 홈',    icon: '📊', roles: ['admin', 'pastor', 'shepherd'] },
  { href: '/members',       label: '성도 관리',   icon: '👥', roles: ['admin', 'pastor', 'shepherd'] },
  { href: '/worship',       label: '예배·출석',   icon: '⛪', roles: ['admin', 'pastor', 'shepherd'] },
  { href: '/cell-groups',   label: '목장',        icon: '🌿', roles: ['admin', 'pastor', 'shepherd'] },
  { href: '/offerings',     label: '헌금',        icon: '💛', roles: ['admin', 'pastor'] },
  { href: '/pastoral',      label: '목양',        icon: '🙏', roles: ['admin', 'pastor', 'shepherd'] },
]

interface SidebarProps {
  role: string
  userName: string
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()

  const roleLabel = { admin: '관리자', pastor: '목회자', shepherd: '목자' }[role] ?? role

  const visible = MENU.filter((m) => m.roles.includes(role))

  return (
    <aside className="flex flex-col h-full w-56 shrink-0" style={{ background: 'var(--navy)', color: '#fff' }}>
      <div className="px-5 py-6 border-b border-white/10">
        <p className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>늘사랑교회</p>
        <p className="text-xs mt-0.5 opacity-50">관리 시스템</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {visible.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={active ? { background: 'var(--gold)', color: 'var(--navy)', fontWeight: 600 } : { color: 'rgba(255,255,255,0.75)' }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs opacity-60 mb-0.5">{roleLabel}</p>
        <p className="text-sm font-medium truncate">{userName}</p>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-3 w-full text-xs py-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
        >
          로그아웃
        </button>
      </div>
    </aside>
  )
}
