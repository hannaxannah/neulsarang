import { notFound } from 'next/navigation'
import { getMemberById, getCellGroups, getFamilyMembers, getMemberRelations } from '@/lib/members'
import MemberDetailPage from '@/components/members/detail/MemberDetailPage'
import PageContainer from '@/components/dashboard/PageContainer'

export default async function MemberDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab = 'basic' } = await searchParams

  const [member, cellGroups, family, relations] = await Promise.all([
    getMemberById(id),
    getCellGroups(),
    getFamilyMembers(id),
    getMemberRelations(id),
  ])

  if (!member) notFound()

  return (
    <PageContainer>
      <MemberDetailPage
        member={member}
        cellGroups={cellGroups}
        family={family}
        relations={relations}
        activeTab={tab}
      />
    </PageContainer>
  )
}
