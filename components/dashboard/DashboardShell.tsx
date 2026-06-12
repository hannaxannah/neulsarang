'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

export default function DashboardShell({
  role,
  userName,
  children,
}: {
  role: string
  userName: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F5F5F7' }}>
      {/* Desktop sidebar */}
      <div className="dashboard-sidebar-desktop">
        <Sidebar role={role} userName={userName} />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="dashboard-sidebar-mobile"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Sidebar role={role} userName={userName} onClose={() => setOpen(false)} />
      </div>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile topbar */}
        <div className="dashboard-topbar-mobile" style={{
          display: 'none',
          alignItems: 'center', gap: 12,
          padding: '0 16px', height: 56,
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#1D1D1F', display: 'flex' }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F' }}>늘사랑교회</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
