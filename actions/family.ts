'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { familyMembers, memberRelations, members, cellGroups } from '@/lib/db/schema'
import { eq, and, isNull, ilike, ne } from 'drizzle-orm'
import { auth } from '@/auth'

async function requireAuth() {
  const session = await auth()
  if (!session?.user) throw new Error('인증이 필요합니다.')
}

// ─── 직접 입력 가족 ─────────────────────────────────────

export async function createFamilyMember(memberId: string, data: {
  name: string; relation: string; phone?: string; notes?: string
}) {
  await requireAuth()
  await db.insert(familyMembers).values({
    memberId, name: data.name, relation: data.relation,
    phone: data.phone || null, notes: data.notes || null,
  })
  revalidatePath(`/members/${memberId}`)
}

export async function updateFamilyMember(id: string, memberId: string, data: {
  name: string; relation: string; phone?: string; notes?: string
}) {
  await requireAuth()
  await db.update(familyMembers).set({
    name: data.name, relation: data.relation,
    phone: data.phone || null, notes: data.notes || null,
  }).where(eq(familyMembers.id, id))
  revalidatePath(`/members/${memberId}`)
}

export async function deleteFamilyMember(id: string, memberId: string) {
  await requireAuth()
  await db.delete(familyMembers).where(eq(familyMembers.id, id))
  revalidatePath(`/members/${memberId}`)
}

// ─── 성도 간 관계 ───────────────────────────────────────

export async function createMemberRelation(memberIdA: string, memberIdB: string, relationType: string) {
  await requireAuth()
  await db.insert(memberRelations).values({ memberIdA, memberIdB, relationType })
  revalidatePath(`/members/${memberIdA}`)
  revalidatePath(`/members/${memberIdB}`)
}

export async function deleteMemberRelation(id: string, memberId: string) {
  await requireAuth()
  await db.delete(memberRelations).where(eq(memberRelations.id, id))
  revalidatePath(`/members/${memberId}`)
}

export async function searchMembersForRelation(query: string, excludeId: string) {
  await requireAuth()
  return db
    .select({ id: members.id, name: members.name, gender: members.gender, cellGroupName: cellGroups.name })
    .from(members)
    .leftJoin(cellGroups, eq(members.cellGroupId, cellGroups.id))
    .where(and(isNull(members.deletedAt), ne(members.id, excludeId), ilike(members.name, `%${query}%`)))
    .limit(10)
}
