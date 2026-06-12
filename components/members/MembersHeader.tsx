'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MemberFormModal from './MemberFormModal'
import type { getCellGroups } from '@/lib/members'

type CellGroup = Awaited<ReturnType<typeof getCellGroups>>[number]

export default function MembersHeader({ cellGroups }: { cellGroups: CellGroup[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    router.push(`/members?${params.toString()}`)
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg
              width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#AEAEB2', pointerEvents: 'none' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 또는 연락처 검색"
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 8, padding: '7px 12px 7px 30px',
                fontSize: 13, color: '#1D1D1F', outline: 'none',
                background: '#FFFFFF',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: 'var(--color-text)', color: '#FFFFFF', border: 'none', cursor: 'pointer',
            }}
          >
            검색
          </button>
          {searchParams.get('q') && (
            <button
              type="button"
              onClick={() => { setQuery(''); router.push('/members') }}
              style={{
                padding: '7px 12px', borderRadius: 8, fontSize: 13,
                background: '#F2F2F7', color: '#86868B', border: 'none', cursor: 'pointer',
              }}
            >
              초기화
            </button>
          )}
        </form>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'var(--color-primary)', color: '#FFFFFF', border: 'none', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          + 성도 등록
        </button>
      </div>

      {showForm && (
        <MemberFormModal member={null} cellGroups={cellGroups} onClose={() => setShowForm(false)} />
      )}
    </>
  )
}
