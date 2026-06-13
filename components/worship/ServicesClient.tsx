'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ServiceRow } from '@/actions/services'
import { deleteService, toggleServiceActive } from '@/actions/services'
import ServiceFormModal from './ServiceFormModal'
import ConfirmModal from '@/components/ui/ConfirmModal'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function ServicesClient({ services }: { services: ServiceRow[] }) {
  const router = useRouter()
  const [editTarget, setEditTarget] = useState<ServiceRow | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<ServiceRow | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function handleToggle(s: ServiceRow) {
    setTogglingId(s.id)
    try {
      await toggleServiceActive(s.id, !s.isActive)
      router.refresh()
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteService(pendingDelete.id)
      setPendingDelete(null)
      router.refresh()
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : '삭제 중 오류가 발생했습니다.')
      setDeleting(false)
    }
  }

  const btnPrimary: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
    background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer',
  }
  const btnGray: React.CSSProperties = {
    padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
    background: '#F2F2F7', color: '#3A3A3C',
    border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer',
  }
  const btnDanger: React.CSSProperties = {
    ...btnGray, color: '#FF3B30', background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)',
  }
  const th: React.CSSProperties = {
    padding: '10px 16px', fontSize: 12, fontWeight: 500,
    color: '#86868B', textAlign: 'left',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => setShowCreate(true)} style={btnPrimary}>+ 예배 추가</button>
      </div>

      {services.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)',
          minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <p style={{ fontSize: 13, color: '#C7C7CC' }}>등록된 예배가 없습니다. 예배를 추가해주세요.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9F9FB' }}>
                <th style={th}>예배명</th>
                <th style={th}>요일</th>
                <th style={th}>시간</th>
                <th style={th}>상태</th>
                <th style={{ ...th, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < services.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#1D1D1F' }}>
                    {s.name}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#3A3A3C' }}>
                    {s.dayOfWeek !== null ? DAYS[s.dayOfWeek!] + '요일' : '-'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#3A3A3C' }}>
                    {s.time ?? '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleToggle(s)}
                      disabled={togglingId === s.id}
                      style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                        border: 'none', cursor: togglingId === s.id ? 'default' : 'pointer',
                        background: s.isActive ? 'rgba(52,199,89,0.12)' : '#F2F2F7',
                        color: s.isActive ? '#1A8C3E' : '#86868B',
                      }}
                    >
                      {togglingId === s.id ? '…' : s.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditTarget(s)} style={btnGray}>수정</button>
                      <button onClick={() => { setPendingDelete(s); setDeleteError('') }} style={btnDanger}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showCreate || editTarget) && (
        <ServiceFormModal
          service={editTarget ?? undefined}
          onClose={() => {
            setShowCreate(false)
            setEditTarget(null)
            router.refresh()
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmModal
          title={`"${pendingDelete.name}" 예배를 삭제하시겠습니까?`}
          description={deleteError || '삭제된 예배는 복구할 수 없습니다.'}
          confirmLabel="삭제"
          danger
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => { setPendingDelete(null); setDeleteError('') }}
        />
      )}
    </>
  )
}
