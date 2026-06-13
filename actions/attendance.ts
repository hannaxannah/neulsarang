'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { members, cellGroups, attendanceRecords } from '@/lib/db/schema'
import { and, asc, eq, inArray, isNull } from 'drizzle-orm'

export type AttendanceRow = {
  memberId: string
  name: string
  cellGroupName: string | null
  attended: boolean
}

export async function getAttendanceForInput(serviceId: string, date: string): Promise<AttendanceRow[]> {
  const rows = await db
    .select({
      memberId:      members.id,
      name:          members.name,
      cellGroupName: cellGroups.name,
      attended:      attendanceRecords.attended,
    })
    .from(members)
    .leftJoin(cellGroups, eq(members.cellGroupId, cellGroups.id))
    .leftJoin(
      attendanceRecords,
      and(
        eq(attendanceRecords.memberId, members.id),
        eq(attendanceRecords.serviceId, serviceId),
        eq(attendanceRecords.date, date),
      ),
    )
    .where(and(isNull(members.deletedAt), eq(members.status, 'active')))
    .orderBy(asc(cellGroups.name), asc(members.name))

  return rows.map(r => ({ ...r, attended: r.attended ?? false }))
}

export async function upsertAttendance(
  memberId: string,
  serviceId: string,
  date: string,
  attended: boolean,
) {
  await db
    .insert(attendanceRecords)
    .values({ memberId, serviceId, date, attended })
    .onConflictDoUpdate({
      target: [attendanceRecords.memberId, attendanceRecords.serviceId, attendanceRecords.date],
      set: { attended },
    })
}

export async function getAttendanceDatesWithData(serviceId: string, dates: string[]): Promise<string[]> {
  if (dates.length === 0) return []
  const rows = await db
    .selectDistinct({ date: attendanceRecords.date })
    .from(attendanceRecords)
    .where(and(
      eq(attendanceRecords.serviceId, serviceId),
      inArray(attendanceRecords.date, dates),
    ))
  return rows.map(r => r.date!)
}

export async function bulkSetAttendance(
  serviceId: string,
  date: string,
  memberIds: string[],
  attended: boolean,
) {
  if (memberIds.length === 0) return
  await db
    .insert(attendanceRecords)
    .values(memberIds.map(memberId => ({ memberId, serviceId, date, attended })))
    .onConflictDoUpdate({
      target: [attendanceRecords.memberId, attendanceRecords.serviceId, attendanceRecords.date],
      set: { attended },
    })
  revalidatePath('/worship/attendance')
}
