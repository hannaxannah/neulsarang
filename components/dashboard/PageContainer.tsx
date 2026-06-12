export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '32px 28px', width: '100%', boxSizing: 'border-box', maxWidth: 1200 }}>
      {children}
    </div>
  )
}
