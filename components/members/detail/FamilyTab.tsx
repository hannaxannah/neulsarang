'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { getFamilyMembers, getMemberRelations } from '@/lib/members'
import { createFamilyMember, updateFamilyMember, deleteFamilyMember, createMemberRelation, deleteMemberRelation, searchMembersForRelation } from '@/actions/family'
import ConfirmModal from '@/components/ui/ConfirmModal'

type FamilyMember = Awaited<ReturnType<typeof getFamilyMembers>>[number]
type MemberRelation = Awaited<ReturnType<typeof getMemberRelations>>[number]

const RELATION_LABELS: Record<string, string> = {
  spouse: '배우자', parent: '부모', child: '자녀', sibling: '형제/자매',
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8,
  padding: '8px 12px', fontSize: 13, color: '#1D1D1F',
  background: '#fff', outline: 'none',
}
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: '#3A3A3C', marginBottom: 4, display: 'block' }

function FamilyMemberForm({
  initial, onSave, onCancel,
}: {
  initial?: FamilyMember
  onSave: (data: { name: string; relation: string; phone: string; notes: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [relation, setRelation] = useState(initial?.relation ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  return (
    <div style={{ padding: '14px 16px', background: '#F9F9F9', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>이름 *</label><input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="홍길동" /></div>
        <div><label style={labelStyle}>관계 *</label><input value={relation} onChange={e => setRelation(e.target.value)} style={inputStyle} placeholder="아버지, 배우자 등" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>연락처</label><input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} placeholder="010-0000-0000" /></div>
        <div><label style={labelStyle}>메모</label><input value={notes} onChange={e => setNotes(e.target.value)} style={inputStyle} /></div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer' }}>취소</button>
        <button
          onClick={() => { if (name && relation) onSave({ name, relation, phone, notes }) }}
          style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
        >저장</button>
      </div>
    </div>
  )
}

function MemberSearchInput({ memberId, onSelect }: { memberId: string; onSelect: (id: string, name: string) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ id: string; name: string; gender: string | null; cellGroupName: string | null }[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 1) { setResults([]); setOpen(false); return }
    const rows = await searchMembersForRelation(q, memberId)
    setResults(rows)
    setOpen(true)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        value={query}
        onChange={e => handleSearch(e.target.value)}
        style={inputStyle}
        placeholder="성도 이름 검색"
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#fff', borderRadius: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.07)',
          zIndex: 50, overflow: 'hidden',
        }}>
          {results.map(r => (
            <button key={r.id} onClick={() => { onSelect(r.id, r.name); setQuery(r.name); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '9px 14px', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F5F5F7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <span style={{ fontWeight: 500 }}>{r.name}</span>
              <span style={{ fontSize: 12, color: '#86868B' }}>{r.cellGroupName ?? '미배정'}</span>
            </button>
          ))}
        </div>
      )}
      {open && results.length === 0 && query && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.07)', zIndex: 50, padding: '12px 14px' }}>
          <span style={{ fontSize: 13, color: '#C7C7CC' }}>검색 결과가 없습니다.</span>
        </div>
      )}
    </div>
  )
}

export default function FamilyTab({ memberId, family, relations }: { memberId: string; family: FamilyMember[]; relations: MemberRelation[] }) {
  const router = useRouter()
  const [showFamilyForm, setShowFamilyForm] = useState(false)
  const [editFamily, setEditFamily] = useState<FamilyMember | null>(null)
  const [showRelationForm, setShowRelationForm] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [relationType, setRelationType] = useState('spouse')
  const [pendingDeleteFamily, setPendingDeleteFamily] = useState<string | null>(null)
  const [pendingDeleteRelation, setPendingDeleteRelation] = useState<string | null>(null)

  async function handleCreateFamily(data: { name: string; relation: string; phone: string; notes: string }) {
    await createFamilyMember(memberId, data)
    setShowFamilyForm(false)
    router.refresh()
  }

  async function handleUpdateFamily(data: { name: string; relation: string; phone: string; notes: string }) {
    if (!editFamily) return
    await updateFamilyMember(editFamily.id, memberId, data)
    setEditFamily(null)
    router.refresh()
  }

  async function handleDeleteFamily(id: string) {
    await deleteFamilyMember(id, memberId)
    setPendingDeleteFamily(null)
    router.refresh()
  }

  async function handleCreateRelation() {
    if (!selectedMemberId) return
    await createMemberRelation(memberId, selectedMemberId, relationType)
    setShowRelationForm(false)
    setSelectedMemberId('')
    router.refresh()
  }

  async function handleDeleteRelation(id: string) {
    await deleteMemberRelation(id, memberId)
    setPendingDeleteRelation(null)
    router.refresh()
  }

  const sectionHeader = (title: string, onAdd: () => void) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F' }}>{title}</span>
      <button onClick={onAdd} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>+ 추가</button>
    </div>
  )

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 직계 가족 (직접 입력) */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', padding: '16px 20px' }}>
        {sectionHeader('직계 가족', () => { setShowFamilyForm(true); setEditFamily(null) })}

        {showFamilyForm && !editFamily && (
          <div style={{ marginBottom: 12 }}>
            <FamilyMemberForm onSave={handleCreateFamily} onCancel={() => setShowFamilyForm(false)} />
          </div>
        )}

        {family.length === 0 && !showFamilyForm ? (
          <p style={{ fontSize: 13, color: '#C7C7CC', textAlign: 'center', padding: '20px 0', margin: 0 }}>등록된 가족 정보가 없습니다.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {family.map(f => (
              editFamily?.id === f.id ? (
                <FamilyMemberForm key={f.id} initial={f} onSave={handleUpdateFamily} onCancel={() => setEditFamily(null)} />
              ) : (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F9F9F9', borderRadius: 8 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1D1D1F' }}>{f.name}</span>
                    <span style={{ fontSize: 12, color: '#86868B', background: '#F2F2F7', padding: '2px 8px', borderRadius: 20 }}>{f.relation}</span>
                    {f.phone && <span style={{ fontSize: 12, color: '#86868B' }}>{f.phone}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditFamily(f)} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer' }}>수정</button>
                    <button onClick={() => setPendingDeleteFamily(f.id)} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, background: '#FFF2F2', color: '#FF3B30', border: 'none', cursor: 'pointer' }}>삭제</button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* 성도 간 관계 */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', padding: '16px 20px' }}>
        {sectionHeader('성도 간 관계', () => setShowRelationForm(true))}

        {showRelationForm && (
          <div style={{ padding: '14px 16px', background: '#F9F9F9', borderRadius: 10, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>성도 검색 *</label>
                <MemberSearchInput memberId={memberId} onSelect={(id) => setSelectedMemberId(id)} />
              </div>
              <div>
                <label style={labelStyle}>관계 유형 *</label>
                <select value={relationType} onChange={e => setRelationType(e.target.value)} style={inputStyle}>
                  {Object.entries(RELATION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRelationForm(false)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer' }}>취소</button>
              <button onClick={handleCreateRelation} disabled={!selectedMemberId} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: !selectedMemberId ? 'not-allowed' : 'pointer', opacity: !selectedMemberId ? 0.5 : 1 }}>연결</button>
            </div>
          </div>
        )}

        {relations.length === 0 && !showRelationForm ? (
          <p style={{ fontSize: 13, color: '#C7C7CC', textAlign: 'center', padding: '20px 0', margin: 0 }}>연결된 성도가 없습니다.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {relations.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F9F9F9', borderRadius: 8 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1D1D1F' }}>{r.relatedName}</span>
                  <span style={{ fontSize: 12, color: '#86868B', background: '#F2F2F7', padding: '2px 8px', borderRadius: 20 }}>{RELATION_LABELS[r.relationType] ?? r.relationType}</span>
                  {r.cellGroupName && <span style={{ fontSize: 12, color: '#86868B' }}>{r.cellGroupName}</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => router.push(`/members/${r.relatedId}`)} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer' }}>상세</button>
                  <button onClick={() => setPendingDeleteRelation(r.id)} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, background: '#FFF2F2', color: '#FF3B30', border: 'none', cursor: 'pointer' }}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {pendingDeleteFamily && (
      <ConfirmModal
        title="가족 정보를 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        onConfirm={() => handleDeleteFamily(pendingDeleteFamily)}
        onCancel={() => setPendingDeleteFamily(null)}
      />
    )}
    {pendingDeleteRelation && (
      <ConfirmModal
        title="성도 관계를 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        onConfirm={() => handleDeleteRelation(pendingDeleteRelation)}
        onCancel={() => setPendingDeleteRelation(null)}
      />
    )}
    </>
  )
}
