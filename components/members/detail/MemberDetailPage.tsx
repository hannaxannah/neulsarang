'use client'

import { useRouter } from 'next/navigation'
import type { MemberRow, CellGroupRow, getFamilyMembers, getMemberRelations } from '@/lib/members'
import BasicInfoTab from './BasicInfoTab'
import FamilyTab from './FamilyTab'
import PageHeader from '@/components/dashboard/PageHeader'

type FamilyMember = Awaited<ReturnType<typeof getFamilyMembers>>[number]
type MemberRelation = Awaited<ReturnType<typeof getMemberRelations>>[number]

const TABS = [
  { key: 'basic',      label: '기본정보' },
  { key: 'family',     label: '가족정보' },
  { key: 'attendance', label: '출석' },
  { key: 'offering',   label: '헌금' },
  { key: 'pastoral',   label: '목양' },
]

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active:      { label: '활동',   color: '#1C8754', bg: '#E8F8EF' },
  inactive:    { label: '비활동', color: '#86868B', bg: '#F2F2F7' },
  transferred: { label: '이전',   color: '#8A6400', bg: '#FFF3CD' },
}

export default function MemberDetailPage({
  member, cellGroups, family, relations, activeTab,
}: {
  member: MemberRow
  cellGroups: CellGroupRow[]
  family: FamilyMember[]
  relations: MemberRelation[]
  activeTab: string
}) {
  const router = useRouter()
  const status = STATUS_MAP[member.status] ?? STATUS_MAP.active

  function switchTab(tab: string) {
    router.push(`/members/${member.id}?tab=${tab}`)
  }

  return (
    <div style={{ padding: '0 0 40px' }}>
      <PageHeader
        backHref="/members"
        backLabel="성도 관리"
        title={member.name}
        titleSuffix={
          <span style={{
            padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500,
            color: status.color, background: status.bg,
          }}>{status.label}</span>
        }
      />

      {/* 탭 */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid rgba(0,0,0,0.08)',
        marginBottom: 24,
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              style={{
                padding: '10px 18px', fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : '#86868B',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color 0.1s',
              }}
            >{tab.label}</button>
          )
        })}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'basic' && (
        <BasicInfoTab member={member} cellGroups={cellGroups} />
      )}
      {activeTab === 'family' && (
        <FamilyTab memberId={member.id} family={family} relations={relations} />
      )}
      {(activeTab === 'attendance' || activeTab === 'offering' || activeTab === 'pastoral') && (
        <div style={{
          padding: '48px 24px', textAlign: 'center',
          background: '#FAFAFA', borderRadius: 12,
          border: '1px dashed rgba(0,0,0,0.1)',
        }}>
          <p style={{ fontSize: 13, color: '#C7C7CC', margin: 0 }}>
            {activeTab === 'attendance' && '출석 기록은 4단계에서 구현됩니다.'}
            {activeTab === 'offering' && '헌금 내역은 5단계에서 구현됩니다.'}
            {activeTab === 'pastoral' && '목양 기록은 5단계에서 구현됩니다.'}
          </p>
        </div>
      )}
    </div>
  )
}
