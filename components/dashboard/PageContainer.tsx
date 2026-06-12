export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-container" style={{ padding: '32px 28px', width: '100%', boxSizing: 'border-box' }}>
      {children}
    </div>
  )
}
