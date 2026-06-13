import { getMembers, getCellGroups, getMemberStats } from '@/lib/members'
import { PAGE_SIZE } from '@/lib/members/constants'
import MemberTable from '@/components/members/MemberTable'
import ExcelImport from '@/components/members/ExcelImport'
import MembersHeader from '@/components/members/MembersHeader'
import MemberPagination from '@/components/members/MemberPagination'
import PageContainer from '@/components/dashboard/PageContainer'

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    cellGroup?: string
    gender?: string
    ageGroup?: string
    year?: string
    status?: string
    sort?: string
    page?: string
  }>
}) {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? '1') || 1)

  const [{ rows: memberList, total }, cellGroups, stats] = await Promise.all([
    getMembers({
      search:      sp.q,
      cellGroupId: sp.cellGroup,
      gender:      sp.gender,
      ageGroup:    sp.ageGroup,
      year:        sp.year,
      status:      sp.status,
      sort:        sp.sort,
      page,
    }),
    getCellGroups(),
    getMemberStats(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <PageContainer>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
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

      <MemberTable members={memberList} cellGroups={cellGroups} sort={sp.sort ?? 'name_asc'} />

      {totalPages > 1 && (
        <MemberPagination currentPage={page} totalPages={totalPages} total={total} />
      )}
    </PageContainer>
  )
}
