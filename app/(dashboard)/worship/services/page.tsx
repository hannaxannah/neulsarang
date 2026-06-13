import { getServices } from '@/actions/services'
import PageContainer from '@/components/dashboard/PageContainer'
import PageHeader from '@/components/dashboard/PageHeader'
import ServicesClient from '@/components/worship/ServicesClient'

export default async function ServicesPage() {
  const data = await getServices()
  return (
    <PageContainer>
      <PageHeader
        title="예배 종류 관리"
        description="예배 종류를 추가하고 출석 체크인에 사용할 수 있도록 관리합니다."
        backHref="/worship"
        backLabel="예배·출석"
      />
      <ServicesClient services={data} />
    </PageContainer>
  )
}
