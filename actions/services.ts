'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { services, attendanceRecords } from '@/lib/db/schema'
import { asc, count, eq, sql } from 'drizzle-orm'

export type ServiceFormData = {
  name: string
  dayOfWeek?: number | null
  time?: string
}

export type ServiceRow = typeof services.$inferSelect

function revalidate() {
  revalidatePath('/worship')
  revalidatePath('/worship/services')
}

export async function getServices() {
  return db.select().from(services).orderBy(asc(services.sortOrder), asc(services.createdAt))
}

export async function createService(data: ServiceFormData) {
  const [{ maxOrder }] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${services.sortOrder}), 0)::int` })
    .from(services)
  await db.insert(services).values({
    name: data.name,
    dayOfWeek: data.dayOfWeek ?? null,
    time: data.time || null,
    sortOrder: maxOrder + 1,
  })
  revalidate()
}

export async function updateService(id: string, data: ServiceFormData) {
  await db
    .update(services)
    .set({ name: data.name, dayOfWeek: data.dayOfWeek ?? null, time: data.time || null })
    .where(eq(services.id, id))
  revalidate()
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await db.update(services).set({ isActive }).where(eq(services.id, id))
  revalidate()
}

export async function deleteService(id: string) {
  const [{ cnt }] = await db
    .select({ cnt: count() })
    .from(attendanceRecords)
    .where(eq(attendanceRecords.serviceId, id))
  if (cnt > 0) throw new Error('출석 기록이 있는 예배는 삭제할 수 없습니다.')
  await db.delete(services).where(eq(services.id, id))
  revalidate()
}
