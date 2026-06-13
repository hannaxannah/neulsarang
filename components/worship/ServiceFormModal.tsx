'use client'

import { useState } from 'react'
import type { ServiceRow } from '@/actions/services'
import { createService, updateService } from '@/actions/services'
import FilterChip from '@/components/ui/FilterChip'

const DAY_OPTIONS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map((d, i) => ({
  label: d,
  value: String(i),
}))

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  label: `${String(i).padStart(2, '0')}시`,
  value: String(i).padStart(2, '0'),
}))

const MINUTE_OPTIONS = ['00', '10', '20', '30', '40', '50'].map(m => ({
  label: `${m}분`,
  value: m,
}))

export default function ServiceFormModal({
  service,
  onClose,
}: {
  service?: ServiceRow
  onClose: () => void
}) {
  const [name, setName] = useState(service?.name ?? '')
  const [dayOfWeek, setDayOfWeek] = useState(service?.dayOfWeek?.toString() ?? '')
  const [hour, setHour] = useState(service?.time?.split(':')[0] ?? '')
  const [minute, setMinute] = useState(service?.time?.split(':')[1] ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) { setError('예배명을 입력해주세요.'); return }
    setSaving(true)
    try {
      const data = {
        name: name.trim(),
        dayOfWeek: dayOfWeek !== '' ? parseInt(dayOfWeek) : null,
        time: hour ? `${hour}:${minute || '00'}` : undefined,
      }
      if (service) {
        await updateService(service.id, data)
      } else {
        await createService(data)
      }
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장 중 오류가 발생했습니다.')
      setSaving(false)
    }
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 500, color: '#6E6E73', marginBottom: 8, display: 'block',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 14,
    border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box',
    color: '#1D1D1F', background: '#fff',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff', borderRadius: 16, padding: '28px 28px 24px',
        width: 400, maxWidth: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1D1D1F', margin: '0 0 20px' }}>
          {service ? '예배 수정' : '예배 추가'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>예배명 *</label>
            <input
              style={inputStyle}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="예: 주일 1부 예배"
              autoFocus
            />
          </div>

          <div>
            <label style={labelStyle}>요일</label>
            <FilterChip
              label="요일 선택"
              options={DAY_OPTIONS}
              value={dayOfWeek}
              onChange={setDayOfWeek}
              dropdownZIndex={1100}
            />
          </div>

          <div>
            <label style={labelStyle}>시간</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FilterChip
                label="시"
                options={HOUR_OPTIONS}
                value={hour}
                onChange={setHour}
                dropdownZIndex={1100}
              />
              <span style={{ fontSize: 13, color: '#AEAEB2' }}>:</span>
              <FilterChip
                label="분"
                options={MINUTE_OPTIONS}
                value={minute}
                onChange={setMinute}
                dropdownZIndex={1100}
              />
            </div>
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 12, color: '#FF3B30', margin: '12px 0 0' }}>{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              padding: '9px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: '#F2F2F7', color: '#1D1D1F', border: 'none', cursor: 'pointer',
            }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '9px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: 'var(--color-primary)', color: '#fff', border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? '저장 중…' : service ? '수정' : '추가'}
          </button>
        </div>
      </div>
    </div>
  )
}
