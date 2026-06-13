import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users, cellGroups } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import PageContainer from '@/components/dashboard/PageContainer'
import UserTable from '@/components/settings/UserTable'

export default async function SettingsPage() {
  const session = await auth()
  if (session?.user?.role !== 'admin') redirect('/dashboard')

  const [allUsers, allGroups] = await Promise.all([
    db.select({
      id: users.id,
      name: users.name,
      username: users.username,
      role: users.role,
      cellGroupId: users.cellGroupId,
      isActive: users.isActive,
      createdAt: users.createdAt,
    }).from(users).orderBy(users.createdAt),
    db.select({ id: cellGroups.id, name: cellGroups.name })
      .from(cellGroups)
      .where(eq(cellGroups.isActive, true))
      .orderBy(cellGroups.name),
  ])

  return (
    <PageContainer>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>계정 관리</h1>
        <p style={{ fontSize: 13, color: '#86868B', margin: '4px 0 0' }}>로그인 계정을 생성하고 역할·목장을 배정합니다.</p>
      </div>
      <UserTable users={allUsers} cellGroups={allGroups} />
    </PageContainer>
  )
}
