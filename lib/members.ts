import { db } from '@/lib/db'
import { members, cellGroups } from '@/lib/db/schema'
import { eq, isNull, ilike, or, sql } from 'drizzle-orm'

export type MemberRow = typeof members.$inferSelect
export type CellGroupRow = typeof cellGroups.$inferSelect

export async function getMembers(search?: string) {
  const base = db
    .select({
      id: members.id,
      name: members.name,
      gender: members.gender,
      birthDate: members.birthDate,
      phone: members.phone,
      email: members.email,
      address: members.address,
      status: members.status,
      isBaptized: members.isBaptized,
      baptizedAt: members.baptizedAt,
      cellGroupId: members.cellGroupId,
      cellGroupName: cellGroups.name,
      registeredAt: members.registeredAt,
      notes: members.notes,
    })
    .from(members)
    .leftJoin(cellGroups, eq(members.cellGroupId, cellGroups.id))
    .where(
      search
        ? or(
            ilike(members.name, `%${search}%`),
            ilike(members.phone, `%${search}%`),
          )
        : isNull(members.deletedAt)
    )
    .orderBy(members.name)

  return base
}

export async function getMemberById(id: string) {
  const [row] = await db
    .select()
    .from(members)
    .where(eq(members.id, id))
    .limit(1)
  return row ?? null
}

export async function getCellGroups() {
  return db.select().from(cellGroups).where(eq(cellGroups.isActive, true)).orderBy(cellGroups.name)
}

export async function getMemberStats() {
  const [result] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${members.status} = 'active')::int`,
      baptized: sql<number>`count(*) filter (where ${members.isBaptized} = true)::int`,
    })
    .from(members)
    .where(isNull(members.deletedAt))

  return result
}
