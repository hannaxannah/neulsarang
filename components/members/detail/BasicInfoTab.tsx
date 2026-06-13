'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MemberRow, CellGroupRow } from '@/lib/members'
import MemberFormModal from '../MemberFormModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { deleteMember } from '@/actions/members'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <span style={{ fontSize: 12, color: '#86868B', fontWeight: 500, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#1D1D1F' }}>{value || <span style={{ color: '#C7C7CC' }}>–</span>}</span>
    </div>
  )
}

export default function BasicInfoTab({ member, cellGroups }: { member: MemberRow; cellGroups: CellGroupRow[] }) {
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await deleteMember(member.id)
    router.push('/members')
  }

  const cellGroupName = cellGroups.find(cg => cg.id === member.cellGroupId)?.name

  return (
    <>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* 카드 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F' }}>기본 정보</span>
          <button
            onClick={() => setShowEdit(true)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer',
            }}
          >수정하기</button>
        </div>

        {/* 정보 목록 */}
        <div style={{ padding: '4px 20px 12px' }}>
          <Row label="이름" value={member.name} />
          <Row label="성별" value={member.gender === 'male' ? '남' : member.gender === 'female' ? '여' : null} />
          <Row label="생년월일" value={member.birthDate} />
          <Row label="연락처" value={member.phone} />
          <Row label="이메일" value={member.email} />
          <Row label="주소" value={member.address} />
          <Row label="등록일" value={member.registeredAt} />
          <Row label="소속 목장" value={cellGroupName} />
          <Row label="세례 여부" value={
            member.isBaptized
              ? `세례 완료${member.baptizedAt ? ` (${member.baptizedAt})` : ''}`
              : '미세례'
          } />
          <Row label="활동 상태" value={
            { active: '활동', inactive: '비활동', transferred: '이전' }[member.status] ?? member.status
          } />
          {member.notes && <Row label="메모" value={<span style={{ whiteSpace: 'pre-wrap' }}>{member.notes}</span>} />}
        </div>
      </div>

      {/* 위험 구역 */}
      <div style={{ marginTop: 24, padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,59,48,0.2)', background: '#FFF8F8' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#FF3B30', margin: '0 0 4px' }}>위험 구역</p>
        <p style={{ fontSize: 12, color: '#86868B', margin: '0 0 12px' }}>삭제된 성도는 목록에서 제거되며 복구할 수 없습니다.</p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
          style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: '#FF3B30', color: '#fff', border: 'none',
            cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1,
          }}
        >{deleting ? '삭제 중…' : '성도 삭제'}</button>
      </div>

      {showEdit && (
        <MemberFormModal
          member={member}
          cellGroups={cellGroups}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmModal
          title={`${member.name} 성도를 삭제하시겠습니까?`}
          description="삭제된 성도는 목록에서 제거되며 복구할 수 없습니다."
          confirmLabel="삭제"
          danger
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  )
}
