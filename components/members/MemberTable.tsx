'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { getMembers, getCellGroups } from '@/lib/members'
import MemberFormModal from './MemberFormModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { deleteMember } from '@/actions/members'

type Member = Awaited<ReturnType<typeof getMembers>>['rows'][number]
type CellGroup = Awaited<ReturnType<typeof getCellGroups>>[number]

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  active:      { label: '활동',   color: '#1C8754', bg: '#E8F8EF' },
  inactive:    { label: '비활동', color: '#86868B', bg: '#F2F2F7' },
  transferred: { label: '이전',   color: '#8A6400', bg: '#FFF3CD' },
}

function formatDate(d: string | null) {
  if (!d) return '–'
  return d.slice(0, 10)
}

type SortKey = 'name' | 'registeredAt' | 'cellGroup'

export default function MemberTable({
  members, cellGroups, sort,
}: {
  members: Member[]
  cellGroups: CellGroup[]
  sort: string
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const [editTarget, setEditTarget] = useState<Member | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null)

  function handleSort(key: SortKey) {
    const current = sort
    const isAsc = current === `${key}_asc`
    const next = isAsc ? `${key}_desc` : `${key}_asc`
    const params = new URLSearchParams(sp.toString())
    params.set('sort', next)
    params.delete('page')
    router.push(`/members?${params.toString()}`)
  }

  function getSortIcon(key: SortKey) {
    if (sort === `${key}_asc`) return ' ▲'
    if (sort === `${key}_desc`) return ' ▼'
    return ''
  }

  async function handleDelete(id: string) {
    await deleteMember(id)
    setPendingDelete(null)
  }

  const thBase: React.CSSProperties = {
    textAlign: 'left', padding: '10px 16px',
    fontSize: 11, fontWeight: 500, color: '#86868B',
    letterSpacing: '0.04em', textTransform: 'uppercase',
    background: '#FAFAFA',
  }
  const thSort: React.CSSProperties = { ...thBase, cursor: 'pointer', userSelect: 'none' }

  return (
    <>
      <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <th style={thSort} onClick={() => handleSort('name')}>이름{getSortIcon('name')}</th>
                <th style={thBase}>성별</th>
                <th style={thBase} className="col-mobile-hide">생년월일</th>
                <th style={thSort} onClick={() => handleSort('cellGroup')}>목장{getSortIcon('cellGroup')}</th>
                <th style={thBase} className="col-mobile-hide">연락처</th>
                <th style={thSort} onClick={() => handleSort('registeredAt')} className="col-mobile-hide">등록일{getSortIcon('registeredAt')}</th>
                <th style={thBase}>상태</th>
                <th style={thBase} className="col-mobile-hide">세례</th>
                <th style={thBase} className="col-mobile-hide" />
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 16px', textAlign: 'center', color: '#C7C7CC', fontSize: 13 }}>
                    등록된 성도가 없습니다.
                  </td>
                </tr>
              ) : members.map((m, i) => {
                const s = STATUS[m.status ?? 'active'] ?? STATUS.active
                return (
                  <tr
                    key={m.id}
                    onClick={() => router.push(`/members/${m.id}`)}
                    style={{
                      borderBottom: i < members.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9F9F9')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '11px 16px', fontWeight: 500, color: '#1D1D1F' }}>{m.name}</td>
                    <td style={{ padding: '11px 16px', color: '#3A3A3C' }}>
                      {m.gender === 'male' ? '남' : m.gender === 'female' ? '여' : '–'}
                    </td>
                    <td style={{ padding: '11px 16px', color: '#3A3A3C', fontVariantNumeric: 'tabular-nums' }} className="col-mobile-hide">
                      {formatDate(m.birthDate)}
                    </td>
                    <td style={{ padding: '11px 16px', color: '#3A3A3C' }}>{m.cellGroupName ?? '–'}</td>
                    <td style={{ padding: '11px 16px', color: '#3A3A3C', fontVariantNumeric: 'tabular-nums' }} className="col-mobile-hide">
                      {m.phone ?? '–'}
                    </td>
                    <td style={{ padding: '11px 16px', color: '#3A3A3C', fontVariantNumeric: 'tabular-nums' }} className="col-mobile-hide">
                      {formatDate(m.registeredAt)}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '2px 8px', borderRadius: 20,
                        fontSize: 11, fontWeight: 500,
                        color: s.color, background: s.bg,
                      }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '11px 16px', color: m.isBaptized ? '#1C8754' : '#C7C7CC' }} className="col-mobile-hide">
                      {m.isBaptized
                        ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        : '–'}
                    </td>
                    <td style={{ padding: '11px 16px' }} className="col-mobile-hide" onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => { setEditTarget(m); setShowForm(true) }}
                          style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                            background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer',
                          }}
                        >수정</button>
                        <button
                          onClick={() => setPendingDelete({ id: m.id, name: m.name })}
                          style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                            background: '#FFF2F2', color: '#FF3B30', border: 'none', cursor: 'pointer',
                          }}
                        >삭제</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <MemberFormModal
          member={editTarget}
          cellGroups={cellGroups}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
      {pendingDelete && (
        <ConfirmModal
          title={`${pendingDelete.name} 성도를 삭제하시겠습니까?`}
          description="삭제된 성도는 목록에서 제거되며 복구할 수 없습니다."
          confirmLabel="삭제"
          danger
          onConfirm={() => handleDelete(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  )
}
