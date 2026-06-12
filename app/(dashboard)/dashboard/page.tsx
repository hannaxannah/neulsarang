import { auth } from '@/auth'

export default async function DashboardPage() {
  const session = await auth()
  const roleLabel = { admin: '관리자', pastor: '목회자', shepherd: '목자' }[session?.user?.role ?? ''] ?? ''

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>통계 홈</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          {session?.user?.name} ({roleLabel}) 님 환영합니다
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: '전체 성도', value: '-', color: '#0f2744' },
          { label: '이번 주 출석', value: '-', color: '#c9a84c' },
          { label: '목장 수', value: '-', color: '#0f2744' },
          { label: '이번 달 헌금', value: '-', color: '#c9a84c' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-medium mb-2" style={{ color: '#94a3b8' }}>{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-sm" style={{ color: '#94a3b8' }}>통계 차트는 5단계에서 구현됩니다.</p>
      </div>
    </div>
  )
}
