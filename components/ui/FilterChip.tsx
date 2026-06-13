'use client'

import { useState, useRef, useEffect } from 'react'

export type FilterOption = { label: string; value: string }

export default function FilterChip({
  label,
  options,
  value,
  onChange,
  dropdownZIndex = 100,
  dropdownAlign = 'left',
}: {
  label: string
  options: FilterOption[]
  value: string
  onChange: (v: string) => void
  dropdownZIndex?: number
  dropdownAlign?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)
  const isActive = !!selected

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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
          position: 'absolute', top: 'calc(100% + 6px)',
          ...(dropdownAlign === 'right' ? { right: 0 } : { left: 0 }),
          background: '#fff', borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.07)',
          minWidth: 130, zIndex: dropdownZIndex,
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
                fontWeight: opt.value === value ? 500 : 400, gap: 8,
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
