'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getMembersForExport, type MemberFilters } from '@/lib/members'

export type MemberFormData = {
  name: string
  gender?: string
  birthDate?: string
  phone?: string
  email?: string
  address?: string
  registeredAt?: string
  isBaptized?: boolean
  baptizedAt?: string
  cellGroupId?: string
  status?: string
  notes?: string
}

export async function createMember(data: MemberFormData) {
  await db.insert(members).values({
    name: data.name,
    gender: data.gender || null,
    birthDate: data.birthDate || null,
    phone: data.phone || null,
    email: data.email || null,
    address: data.address || null,
    registeredAt: data.registeredAt || null,
    isBaptized: data.isBaptized ?? false,
    baptizedAt: data.baptizedAt || null,
    cellGroupId: data.cellGroupId || null,
    status: data.status ?? 'active',
    notes: data.notes || null,
  })
  revalidatePath('/members')
}

export async function updateMember(id: string, data: MemberFormData) {
  await db
    .update(members)
    .set({
      name: data.name,
      gender: data.gender || null,
      birthDate: data.birthDate || null,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      registeredAt: data.registeredAt || null,
      isBaptized: data.isBaptized ?? false,
      baptizedAt: data.baptizedAt || null,
      cellGroupId: data.cellGroupId || null,
      status: data.status ?? 'active',
      notes: data.notes || null,
      updatedAt: new Date(),
    })
    .where(eq(members.id, id))
  revalidatePath('/members')
}

export async function deleteMember(id: string) {
  await db
    .update(members)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(members.id, id))
  revalidatePath('/members')
}

export async function exportMembersAction(filters: Omit<MemberFilters, 'page' | 'sort'>) {
  const rows = await getMembersForExport(filters)
  return rows.map(r => ({
    name:          r.name,
    gender:        r.gender === 'male' ? '남' : r.gender === 'female' ? '여' : '',
    birthDate:     r.birthDate ?? '',
    phone:         r.phone ?? '',
    email:         r.email ?? '',
    address:       r.address ?? '',
    cellGroupName: r.cellGroupName ?? '',
    registeredAt:  r.registeredAt ?? '',
    isBaptized:    r.isBaptized ? 'O' : 'X',
    baptizedAt:    r.baptizedAt ?? '',
    status:        ({ active: '활동', inactive: '비활동', transferred: '이전' } as Record<string, string>)[r.status ?? ''] ?? '',
    notes:         r.notes ?? '',
  }))
}

export async function importMembersFromExcel(rows: MemberFormData[]) {
  if (rows.length === 0) return { count: 0 }

  await db.insert(members).values(
    rows.map((r) => ({
      name: r.name,
      gender: r.gender || null,
      birthDate: r.birthDate || null,
      phone: r.phone || null,
      email: r.email || null,
      address: r.address || null,
      registeredAt: r.registeredAt || null,
      isBaptized: r.isBaptized ?? false,
      status: r.status ?? 'active',
      notes: r.notes || null,
    }))
  )
  revalidatePath('/members')
  return { count: rows.length }
}
