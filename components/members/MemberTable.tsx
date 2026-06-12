'use client'

import { useState } from 'react'
import type { getMembers, getCellGroups } from '@/lib/members'
import MemberFormModal from './MemberFormModal'
import { deleteMember } from '@/actions/members'

type Member = Awaited<ReturnType<typeof getMembers>>[number]
type CellGroup = Awaited<ReturnType<typeof getCellGroups>>[number]

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  active:      { label: '활동',   color: '#1C8754', bg: '#E8F8EF' },
  inactive:    { label: '비활동', color: '#86868B', bg: '#F2F2F7' },
  transferred: { label: '이전',   color: '#8A6400', bg: '#FFF3CD' },
}

const COLS = ['이름', '성별', '연락처', '목장', '상태', '세례', '']

export default function MemberTable({ members, cellGroups }: { members: Member[]; cellGroups: CellGroup[] }) {
  const [editTarget, setEditTarget] = useState<Member | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`${name} 성도를 삭제하시겠습니까?`)) return
    await deleteMember(id)
  }

  return (
    <>
      <div className="members-table-scroll" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {COLS.map((h) => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 16px',
                  fontSize: 11, fontWeight: 500, color: '#86868B',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  background: '#FAFAFA',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: '#C7C7CC', fontSize: 13 }}>
                  등록된 성도가 없습니다.
                </td>
              </tr>
            ) : members.map((m, i) => {
              const s = STATUS[m.status ?? 'active'] ?? STATUS.active
              return (
                <tr
                  key={m.id}
                  style={{ borderBottom: i < members.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                >
                  <td style={{ padding: '11px 16px', fontWeight: 500, color: '#1D1D1F' }}>{m.name}</td>
                  <td style={{ padding: '11px 16px', color: '#3A3A3C' }}>
                    {m.gender === 'male' ? '남' : m.gender === 'female' ? '여' : '–'}
                  </td>
                  <td style={{ padding: '11px 16px', color: '#3A3A3C', fontVariantNumeric: 'tabular-nums' }}>
                    {m.phone ?? '–'}
                  </td>
                  <td style={{ padding: '11px 16px', color: '#3A3A3C' }}>{m.cellGroupName ?? '–'}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 8px', borderRadius: 20,
                      fontSize: 11, fontWeight: 500,
                      color: s.color, background: s.bg,
                    }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', color: m.isBaptized ? '#1C8754' : '#C7C7CC' }}>
                    {m.isBaptized
                      ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      : '–'}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => { setEditTarget(m); setShowForm(true) }}
                        style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                          background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer',
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                          background: '#FFF2F2', color: '#FF3B30', border: 'none', cursor: 'pointer',
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <MemberFormModal
          member={editTarget}
          cellGroups={cellGroups}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
    </>
  )
}
