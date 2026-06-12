import { getMembers, getCellGroups, getMemberStats } from '@/lib/members'
import MemberTable from '@/components/members/MemberTable'
import ExcelImport from '@/components/members/ExcelImport'
import MembersHeader from '@/components/members/MembersHeader'
import PageContainer from '@/components/dashboard/PageContainer'

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const [memberList, cellGroups, stats] = await Promise.all([
    getMembers(q),
    getCellGroups(),
    getMemberStats(),
  ])

  return (
    <PageContainer>
      <div className="members-header-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1D1D1F', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
            성도 관리
          </h1>
          <p style={{ fontSize: 13, color: '#86868B', margin: 0, lineHeight: 1.5 }}>
            전체 {stats?.total ?? 0}명
            <span style={{ margin: '0 6px', color: '#D1D1D6' }}>·</span>
            활동 {stats?.active ?? 0}명
            <span style={{ margin: '0 6px', color: '#D1D1D6' }}>·</span>
            세례 {stats?.baptized ?? 0}명
          </p>
        </div>
        <ExcelImport />
      </div>

      <MembersHeader cellGroups={cellGroups} />

      <MemberTable members={memberList} cellGroups={cellGroups} />
    </PageContainer>
  )
}
