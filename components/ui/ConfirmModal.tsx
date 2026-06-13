'use client'

export default function ConfirmModal({
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 360,
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 24px 20px' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: '0 0 8px' }}>{title}</p>
          {description && (
            <p style={{ fontSize: 13, color: '#86868B', margin: 0, lineHeight: 1.6 }}>{description}</p>
          )}
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '14px', fontSize: 14, fontWeight: 500,
              background: 'none', color: '#3A3A3C', border: 'none',
              borderRight: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer',
            }}
          >{cancelLabel}</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '14px', fontSize: 14, fontWeight: 600,
              background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              color: danger ? '#FF3B30' : 'var(--color-primary)',
              opacity: loading ? 0.5 : 1,
            }}
          >{loading ? '처리 중…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
