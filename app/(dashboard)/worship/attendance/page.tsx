import { getServices } from '@/actions/services'
import PageContainer from '@/components/dashboard/PageContainer'
import PageHeader from '@/components/dashboard/PageHeader'
import AttendanceClient, { NoServicesPlaceholder } from '@/components/worship/AttendanceClient'

export default async function AttendancePage() {
  const services = await getServices()
  const activeServices = services.filter(s => s.isActive)

  return (
    <PageContainer>
      <PageHeader
        title="출석 입력"
        backHref="/worship"
        backLabel="예배·출석"
      />
      {activeServices.length === 0 ? (
        <NoServicesPlaceholder />
      ) : (
        <AttendanceClient services={activeServices} />
      )}
    </PageContainer>
  )
}
