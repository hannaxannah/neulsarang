import { db } from '@/lib/db'
import { members, cellGroups } from '@/lib/db/schema'
import { eq, isNull, ilike, or, sql, and, asc, desc } from 'drizzle-orm'
import { PAGE_SIZE } from './members/constants'

export type MemberRow = typeof members.$inferSelect
export type CellGroupRow = typeof cellGroups.$inferSelect

export type MemberFilters = {
  search?: string
  cellGroupId?: string
  gender?: string
  ageGroup?: string
  year?: string
  status?: string
  sort?: string
  page?: number
}

const AGE_RANGES: Record<string, [number, number]> = {
  '10s':    [10, 19],
  '20s':    [20, 29],
  '30s':    [30, 39],
  '40s':    [40, 49],
  '50s':    [50, 59],
  '60plus': [60, 150],
}

export async function getMembers(filters: MemberFilters = {}) {
  const { search, cellGroupId, gender, ageGroup, year, status, sort = 'name_asc', page = 1 } = filters
  const currentYear = new Date().getFullYear()

  const ageFilter = ageGroup && AGE_RANGES[ageGroup]
    ? and(
        sql`${members.birthDate} IS NOT NULL`,
        sql`EXTRACT(YEAR FROM ${members.birthDate}::date) BETWEEN ${currentYear - AGE_RANGES[ageGroup][1]} AND ${currentYear - AGE_RANGES[ageGroup][0]}`,
      )
    : undefined

  const yearFilter = year
    ? and(
        sql`${members.registeredAt} IS NOT NULL`,
        sql`EXTRACT(YEAR FROM ${members.registeredAt}::date) = ${parseInt(year)}`,
      )
    : undefined

  const whereClause = and(
    isNull(members.deletedAt),
    search ? or(ilike(members.name, `%${search}%`), ilike(members.phone, `%${search}%`)) : undefined,
    cellGroupId ? eq(members.cellGroupId, cellGroupId) : undefined,
    gender ? eq(members.gender, gender) : undefined,
    status ? eq(members.status, status) : undefined,
    ageFilter,
    yearFilter,
  )

  const orderBy = {
    name_asc:           asc(members.name),
    name_desc:          desc(members.name),
    registeredAt_asc:   asc(members.registeredAt),
    registeredAt_desc:  desc(members.registeredAt),
    cellGroup_asc:      asc(cellGroups.name),
    cellGroup_desc:     desc(cellGroups.name),
  }[sort] ?? asc(members.name)

  const offset = (page - 1) * PAGE_SIZE

  const selectFields = {
    id:            members.id,
    name:          members.name,
    gender:        members.gender,
    birthDate:     members.birthDate,
    phone:         members.phone,
    email:         members.email,
    address:       members.address,
    status:        members.status,
    isBaptized:    members.isBaptized,
    baptizedAt:    members.baptizedAt,
    cellGroupId:   members.cellGroupId,
    cellGroupName: cellGroups.name,
    registeredAt:  members.registeredAt,
    notes:         members.notes,
  }

  const [rows, countResult] = await Promise.all([
    db.select(selectFields)
      .from(members)
      .leftJoin(cellGroups, eq(members.cellGroupId, cellGroups.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` })
      .from(members)
      .leftJoin(cellGroups, eq(members.cellGroupId, cellGroups.id))
      .where(whereClause),
  ])

  return { rows, total: countResult[0]?.count ?? 0 }
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
      total:    sql<number>`count(*)::int`,
      active:   sql<number>`count(*) filter (where ${members.status} = 'active')::int`,
      baptized: sql<number>`count(*) filter (where ${members.isBaptized} = true)::int`,
    })
    .from(members)
    .where(isNull(members.deletedAt))

  return result
}
