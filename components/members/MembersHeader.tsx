'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MemberFormModal from './MemberFormModal'
import type { getCellGroups } from '@/lib/members'

type CellGroup = Awaited<ReturnType<typeof getCellGroups>>[number]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1979 }, (_, i) => CURRENT_YEAR - i)

type FilterOption = { label: string; value: string }

function FilterChip({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: FilterOption[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isActive = !!selected

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '5px 11px', borderRadius: 20, fontSize: 13,
          border: isActive ? 'none' : '1px solid rgba(0,0,0,0.12)',
          background: isActive ? 'var(--color-primary)' : '#fff',
          color: isActive ? '#fff' : '#3A3A3C',
          cursor: 'pointer', fontWeight: isActive ? 500 : 400,
          whiteSpace: 'nowrap',
          boxShadow: isActive ? '0 1px 4px rgba(59,74,47,0.18)' : 'none',
          transition: 'all 0.12s',
        }}
      >
        {selected ? selected.label : label}
        {isActive ? (
          <span
            onClick={e => { e.stopPropagation(); onChange('') }}
            style={{ display: 'flex', alignItems: 'center', marginLeft: 2, opacity: 0.75 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </span>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ opacity: 0.5 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          background: '#fff', borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.07)',
          minWidth: 140, zIndex: 100,
          maxHeight: options.length >= 6 ? 224 : 'none',
          overflowY: options.length >= 6 ? 'auto' : 'visible',
          padding: '4px 0',
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value === value ? '' : opt.value); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '8px 14px', fontSize: 13,
                background: opt.value === value ? 'rgba(59,74,47,0.06)' : 'transparent',
                color: opt.value === value ? 'var(--color-primary)' : '#1D1D1F',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontWeight: opt.value === value ? 500 : 400,
                gap: 8,
              }}
              onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = '#F5F5F7' }}
              onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = 'transparent' }}
            >
              {opt.label}
              {opt.value === value && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

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
