'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PAGE_SIZE } from '@/lib/members/constants'

export default function MemberPagination({
  currentPage, totalPages, total,
}: {
  currentPage: number
  totalPages: number
  total: number
}) {
  const router = useRouter()
  const sp = useSearchParams()

  function goTo(page: number) {
    const params = new URLSearchParams(sp.toString())
    params.set('page', String(page))
    router.push(`/members?${params.toString()}`)
  }

  const from = (currentPage - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage * PAGE_SIZE, total)

  // 최대 5개 페이지 번호 표시
  const delta = 2
  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  const btnBase: React.CSSProperties = {
    minWidth: 32, height: 32, borderRadius: 8, fontSize: 13,
    border: '1px solid rgba(0,0,0,0.1)', background: '#FFFFFF',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: '#3A3A3C',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
      <p style={{ fontSize: 13, color: '#86868B', margin: 0 }}>
        전체 {total}명 · {from}–{to}명 표시
      </p>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ ...btnBase, opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
        >‹</button>

        {pages.map((p, i) =>
          p === '...'
            ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#86868B', fontSize: 13 }}>…</span>
            : <button
                key={p}
                onClick={() => goTo(p)}
                style={{
                  ...btnBase,
                  background: p === currentPage ? 'var(--color-primary)' : '#FFFFFF',
                  color: p === currentPage ? '#FFFFFF' : '#3A3A3C',
                  border: p === currentPage ? 'none' : '1px solid rgba(0,0,0,0.1)',
                  fontWeight: p === currentPage ? 500 : 400,
                }}
              >{p}</button>
        )}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ ...btnBase, opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
        >›</button>
      </div>
    </div>
  )
}
