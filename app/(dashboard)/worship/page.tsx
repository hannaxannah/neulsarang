import Link from 'next/link'
import PageContainer from '@/components/dashboard/PageContainer'
import PageHeader from '@/components/dashboard/PageHeader'

const CARDS = [
  {
    href: '/worship/services',
    label: '예배 종류 관리',
    desc: '예배 목록 추가·수정·비활성화',
    ready: true,
  },
  {
    href: '/worship/attendance',
    label: '출석 입력',
    desc: '날짜·예배별 출석 체크인',
    ready: true,
  },
  {
    href: '/worship/stats',
    label: '출석 현황',
    desc: '예배별·성도별 출석률 통계',
    ready: false,
  },
]

export default function WorshipPage() {
  return (
    <PageContainer>
      <PageHeader title="예배·출석" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {CARDS.map(card => (
          card.ready ? (
            <Link
              key={card.href}
              href={card.href}
              style={{
                background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)',
                padding: '20px 20px 18px', textDecoration: 'none',
                display: 'block', transition: 'border-color 0.15s',
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F', margin: '0 0 4px' }}>{card.label}</p>
              <p style={{ fontSize: 12, color: '#86868B', margin: 0 }}>{card.desc}</p>
            </Link>
          ) : (
            <div
              key={card.href}
              style={{
                background: '#F9F9FB', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)',
                padding: '20px 20px 18px', opacity: 0.6,
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F', margin: '0 0 4px' }}>{card.label}</p>
              <p style={{ fontSize: 12, color: '#86868B', margin: '0 0 6px' }}>{card.desc}</p>
              <span style={{ fontSize: 11, color: '#AEAEB2' }}>준비 중</span>
            </div>
          )
        ))}
      </div>
    </PageContainer>
  )
}
