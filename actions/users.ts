'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { auth } from '@/auth'

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== 'admin') throw new Error('권한이 없습니다.')
}

export type UserFormData = {
  name: string
  username: string
  password: string
  role: string
  cellGroupId?: string | null
}

export async function createUser(data: UserFormData) {
  await requireAdmin()
  const passwordHash = await bcrypt.hash(data.password, 12)
  await db.insert(users).values({
    name: data.name,
    username: data.username,
    passwordHash,
    role: data.role,
    cellGroupId: data.cellGroupId || null,
  })
  revalidatePath('/settings')
}

export async function updateUser(id: string, data: Partial<{ role: string; cellGroupId: string | null; isActive: boolean }>) {
  await requireAdmin()
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id))
  revalidatePath('/settings')
}

export async function resetPassword(id: string, newPassword: string) {
  await requireAdmin()
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, id))
  revalidatePath('/settings')
}
