'use client'

import { useState } from 'react'
import { createMember, updateMember } from '@/actions/members'
import type { getMembers, getCellGroups } from '@/lib/members'

type Member = Awaited<ReturnType<typeof getMembers>>[number]
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
      gender: fd.get('gender') as string || undefined,
      birthDate: fd.get('birthDate') as string || undefined,
      phone: fd.get('phone') as string || undefined,
      email: fd.get('email') as string || undefined,
      address: fd.get('address') as string || undefined,
      registeredAt: fd.get('registeredAt') as string || undefined,
      isBaptized: fd.get('isBaptized') === 'on',
      baptizedAt: fd.get('baptizedAt') as string || undefined,
      cellGroupId: fd.get('cellGroupId') as string || undefined,
      status: fd.get('status') as string || 'active',
      notes: fd.get('notes') as string || undefined,
    }
    if (isEdit) {
      await updateMember(member!.id, data)
    } else {
      await createMember(data)
    }
    setLoading(false)
    onClose()
  }

  const inputCls = 'border rounded-lg px-3 py-1.5 text-sm w-full outline-none focus:ring-1'
  const inputStyle = { borderColor: '#e2e8f0' }
  const labelCls = 'text-xs font-medium mb-0.5 block'
  const labelStyle = { color: '#64748b' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
          <h2 className="font-bold" style={{ color: 'var(--navy)' }}>{isEdit ? '성도 수정' : '성도 등록'}</h2>
          <button onClick={onClose} className="text-xl leading-none" style={{ color: '#94a3b8' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>이름 *</label>
              <input name="name" required defaultValue={member?.name} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>성별</label>
              <select name="gender" defaultValue={member?.gender ?? ''} className={inputCls} style={inputStyle}>
                <option value="">선택</option>
                <option value="male">남</option>
                <option value="female">여</option>
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>생년월일</label>
              <input name="birthDate" type="date" defaultValue={member?.birthDate ?? ''} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>연락처</label>
              <input name="phone" defaultValue={member?.phone ?? ''} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>이메일</label>
              <input name="email" type="email" defaultValue={member?.email ?? ''} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>등록일</label>
              <input name="registeredAt" type="date" defaultValue={member?.registeredAt ?? ''} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>목장</label>
              <select name="cellGroupId" defaultValue={member?.cellGroupId ?? ''} className={inputCls} style={inputStyle}>
                <option value="">미배정</option>
                {cellGroups.map((cg) => (
                  <option key={cg.id} value={cg.id}>{cg.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>상태</label>
              <select name="status" defaultValue={member?.status ?? 'active'} className={inputCls} style={inputStyle}>
                <option value="active">활동</option>
                <option value="inactive">비활동</option>
                <option value="transferred">이전</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>주소</label>
            <input name="address" defaultValue={member?.address ?? ''} className={inputCls} style={inputStyle} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input name="isBaptized" type="checkbox" defaultChecked={member?.isBaptized ?? false} />
              세례 여부
            </label>
            <div className="flex-1">
              <input name="baptizedAt" type="date" defaultValue={member?.baptizedAt ?? ''} className={inputCls} style={inputStyle} placeholder="세례일" />
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>메모</label>
            <textarea name="notes" rows={2} defaultValue={member?.notes ?? ''} className={inputCls} style={inputStyle} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm border" style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: 'var(--navy)' }}
            >
              {loading ? '저장 중...' : isEdit ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
