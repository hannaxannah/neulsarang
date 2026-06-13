import Link from 'next/link'

export default function PageHeader({
  title,
  titleSuffix,
  description,
  actions,
  backHref,
  backLabel,
}: {
  title: string
  titleSuffix?: React.ReactNode
  description?: string
  actions?: React.ReactNode
  backHref?: string
  backLabel?: string
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      {backHref && (
        <Link
          href={backHref}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 13, color: '#86868B', textDecoration: 'none',
            marginBottom: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          {backLabel ?? '뒤로'}
        </Link>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.3px' }}>
              {title}
            </h1>
            {titleSuffix}
          </div>
          {description && (
            <p style={{ fontSize: 13, color: '#86868B', margin: '3px 0 0' }}>{description}</p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
