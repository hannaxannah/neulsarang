'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MemberFormModal from './MemberFormModal'
import FilterChip from '@/components/ui/FilterChip'
import type { getCellGroups } from '@/lib/members'

type CellGroup = Awaited<ReturnType<typeof getCellGroups>>[number]
type FilterOption = { label: string; value: string }

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1979 }, (_, i) => CURRENT_YEAR - i)

export default function MembersHeader({ cellGroups }: { cellGroups: CellGroup[] }) {
  const router = useRouter()
  const sp = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState(sp.get('q') ?? '')

  const activeFilterCount = ['cellGroup', 'gender', 'ageGroup', 'year', 'status'].filter(k => sp.get(k)).length

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(sp.toString())
    if (query) params.set('q', query)
    else params.delete('q')
    params.delete('page')
    router.push(`/members?${params.toString()}`)
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(sp.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/members?${params.toString()}`)
  }

  function clearFilters() {
    const params = new URLSearchParams()
    if (sp.get('q')) params.set('q', sp.get('q')!)
    if (sp.get('sort')) params.set('sort', sp.get('sort')!)
    router.push(`/members?${params.toString()}`)
  }

  const cellGroupOptions: FilterOption[] = cellGroups.map(cg => ({ label: cg.name, value: cg.id }))
  const genderOptions: FilterOption[] = [{ label: '남', value: 'male' }, { label: '여', value: 'female' }]
  const ageOptions: FilterOption[] = [
    { label: '10대', value: '10s' }, { label: '20대', value: '20s' },
    { label: '30대', value: '30s' }, { label: '40대', value: '40s' },
    { label: '50대', value: '50s' }, { label: '60대 이상', value: '60plus' },
  ]
  const yearOptions: FilterOption[] = YEARS.map(y => ({ label: `${y}년`, value: String(y) }))
  const statusOptions: FilterOption[] = [
    { label: '활동', value: 'active' }, { label: '비활동', value: 'inactive' }, { label: '이전', value: 'transferred' },
  ]

  return (
    <>
      {/* 검색 + 등록 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#AEAEB2', pointerEvents: 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z" />
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="이름 또는 연락처 검색"
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8,
                padding: '7px 12px 7px 30px', fontSize: 13, color: '#1D1D1F',
                outline: 'none', background: '#fff',
              }}
            />
          </div>
          <button type="submit" style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'var(--color-text)', color: '#fff', border: 'none', cursor: 'pointer',
          }}>검색</button>
          {sp.get('q') && (
            <button type="button" onClick={() => { setQuery(''); updateFilter('q', '') }} style={{
              padding: '7px 12px', borderRadius: 8, fontSize: 13,
              background: '#F2F2F7', color: '#86868B', border: 'none', cursor: 'pointer',
            }}>초기화</button>
          )}
        </form>
        <button onClick={() => setShowForm(true)} style={{
          padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>+ 성도 등록</button>
      </div>

      {/* 필터 칩 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 16 }}>
        <FilterChip label="목장" options={cellGroupOptions} value={sp.get('cellGroup') ?? ''} onChange={v => updateFilter('cellGroup', v)} />
        <FilterChip label="성별" options={genderOptions} value={sp.get('gender') ?? ''} onChange={v => updateFilter('gender', v)} />
        <FilterChip label="연령대" options={ageOptions} value={sp.get('ageGroup') ?? ''} onChange={v => updateFilter('ageGroup', v)} />
        <FilterChip label="등록연도" options={yearOptions} value={sp.get('year') ?? ''} onChange={v => updateFilter('year', v)} />
        <FilterChip label="상태" options={statusOptions} value={sp.get('status') ?? ''} onChange={v => updateFilter('status', v)} />

        {activeFilterCount > 0 && (
          <button onClick={clearFilters} style={{
            padding: '5px 11px', borderRadius: 20, fontSize: 12,
            background: 'none', color: '#86868B',
            border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer',
          }}>전체 초기화</button>
        )}
      </div>

      {showForm && (
        <MemberFormModal member={null} cellGroups={cellGroups} onClose={() => setShowForm(false)} />
      )}
    </>
  )
}
