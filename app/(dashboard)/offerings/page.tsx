import PageContainer from '@/components/dashboard/PageContainer'
import PageHeader from '@/components/dashboard/PageHeader'

const TITLES: Record<string, string> = {
  'worship': '예배·출석',
  'cell-groups': '목장',
  'offerings': '헌금',
  'pastoral': '목양',
}

export default function Page() {
  const title = TITLES['offerings'] ?? ''
  return (
    <PageContainer>
      <PageHeader title={title} />
      <div style={{
        background: '#FFFFFF', borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.06)',
        minHeight: 320, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ fontSize: 13, color: '#C7C7CC' }}>{title} 기능은 다음 단계에서 구현됩니다.</p>
      </div>
    </PageContainer>
  )
}
