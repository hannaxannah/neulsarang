'use client'

import { useState } from 'react'
import { createMember, updateMember } from '@/actions/members'
import type { getMembers, getCellGroups } from '@/lib/members'

type Member = Awaited<ReturnType<typeof getMembers>>['rows'][number]
type CellGroup = Awaited<ReturnType<typeof getCellGroups>>[number]

export default function MemberFormModal({
  member,
  cellGroups,
  onClose,
}: {
  member: Member | null
  cellGroups: CellGroup[]
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!member

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get('name') as string,
      gender: (fd.get('gender') as string) || undefined,
      birthDate: (fd.get('birthDate') as string) || undefined,
      phone: (fd.get('phone') as string) || undefined,
      email: (fd.get('email') as string) || undefined,
      address: (fd.get('address') as string) || undefined,
      registeredAt: (fd.get('registeredAt') as string) || undefined,
      isBaptized: fd.get('isBaptized') === 'on',
      baptizedAt: (fd.get('baptizedAt') as string) || undefined,
      cellGroupId: (fd.get('cellGroupId') as string) || undefined,
      status: (fd.get('status') as string) || 'active',
      notes: (fd.get('notes') as string) || undefined,
    }
    if (isEdit) {
      await updateMember(member!.id, data)
    } else {
      await createMember(data)
    }
    setLoading(false)
    onClose()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8,
    padding: '8px 12px', fontSize: 13, color: '#1D1D1F',
    background: '#fff', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 500, color: '#3A3A3C',
    marginBottom: 4, display: 'block',
  }
  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '16px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0,
          background: '#fff', zIndex: 1,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>
            {isEdit ? '성도 수정' : '성도 등록'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#AEAEB2', fontSize: 18, lineHeight: 1, padding: 4,
          }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* 이름 + 성별 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>이름 *</label>
              <input name="name" required defaultValue={member?.name} style={inputStyle} placeholder="홍길동" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>성별</label>
              <select name="gender" defaultValue={member?.gender ?? ''} style={inputStyle}>
                <option value="">선택</option>
                <option value="male">남</option>
                <option value="female">여</option>
              </select>
            </div>
          </div>

          {/* 생년월일 + 연락처 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>생년월일</label>
              <input name="birthDate" type="date" defaultValue={member?.birthDate ?? ''} style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>연락처</label>
              <input name="phone" defaultValue={member?.phone ?? ''} style={inputStyle} placeholder="010-0000-0000" />
            </div>
          </div>

          {/* 이메일 + 등록일 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>이메일</label>
              <input name="email" type="email" defaultValue={member?.email ?? ''} style={inputStyle} placeholder="example@email.com" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>등록일</label>
              <input name="registeredAt" type="date" defaultValue={member?.registeredAt ?? ''} style={inputStyle} />
            </div>
          </div>

          {/* 목장 + 상태 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>목장</label>
              <select name="cellGroupId" defaultValue={member?.cellGroupId ?? ''} style={inputStyle}>
                <option value="">미배정</option>
                {cellGroups.map((cg) => (
                  <option key={cg.id} value={cg.id}>{cg.name}</option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>상태</label>
              <select name="status" defaultValue={member?.status ?? 'active'} style={inputStyle}>
                <option value="active">활동</option>
                <option value="inactive">비활동</option>
                <option value="transferred">이전</option>
              </select>
            </div>
          </div>

          {/* 주소 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>주소</label>
            <input name="address" defaultValue={member?.address ?? ''} style={inputStyle} placeholder="도로명 주소" />
          </div>

          {/* 세례 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1D1D1F', cursor: 'pointer', flexShrink: 0 }}>
              <input name="isBaptized" type="checkbox" defaultChecked={member?.isBaptized ?? false}
                style={{ width: 14, height: 14, accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
              세례 여부
            </label>
            <div style={{ flex: 1 }}>
              <input name="baptizedAt" type="date" defaultValue={member?.baptizedAt ?? ''} style={inputStyle} />
            </div>
          </div>

          {/* 메모 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>메모</label>
            <textarea name="notes" rows={2} defaultValue={member?.notes ?? ''} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* 버튼 */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '9px', borderRadius: 8, fontSize: 13,
              background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer',
            }}>
              취소
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '9px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: 'var(--color-primary)', color: '#fff', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            }}>
              {loading ? '저장 중…' : isEdit ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
