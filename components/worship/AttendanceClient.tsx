'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { ServiceRow } from '@/actions/services'
import { getAttendanceForInput, upsertAttendance, bulkSetAttendance, getAttendanceDatesWithData } from '@/actions/attendance'
import type { AttendanceRow } from '@/actions/attendance'

const DAY_KR = ['일', '월', '화', '수', '목', '금', '토']

/* ── 날짜 유틸 (로컬 타임존 기준) ── */
function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function todayStr(): string {
  return localDateStr(new Date())
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return localDateStr(d)
}

function formatShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_KR[d.getDay()]})`
}

function formatLong(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_KR[d.getDay()]})`
}

/* 1주 전 ~ 15주 후, 총 17개 */
function buildInitialDates(dayOfWeek: number): string[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const anchor = new Date(today)
  anchor.setDate(today.getDate() - (today.getDay() - dayOfWeek + 7) % 7)

  return Array.from({ length: 17 }, (_, i) => {
    const d = new Date(anchor)
    d.setDate(anchor.getDate() + (i - 1) * 7)
    return localDateStr(d)
  })
}

function defaultDateFor(service: ServiceRow): string {
  if (service.dayOfWeek === null || service.dayOfWeek === undefined) return todayStr()
  const today = todayStr()
  const dates = buildInitialDates(service.dayOfWeek)
  return dates.filter(d => d <= today).at(-1) ?? dates[0]
}

function hasDayOfWeek(s: ServiceRow): s is ServiceRow & { dayOfWeek: number } {
  return s.dayOfWeek !== null && s.dayOfWeek !== undefined
}

/* ── 메인 컴포넌트 ── */
export default function AttendanceClient({ services }: { services: ServiceRow[] }) {
  const firstService = services[0]
  const [serviceId, setServiceId] = useState(firstService?.id ?? '')
  const [date, setDate] = useState(() => defaultDateFor(firstService))
  const [windowDates, setWindowDates] = useState<string[]>(() =>
    firstService && hasDayOfWeek(firstService) ? buildInitialDates(firstService.dayOfWeek) : []
  )
  const [rows, setRows] = useState<AttendanceRow[]>([])
  const [loading, setLoading] = useState(false)
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
  const [bulkSaving, setBulkSaving] = useState(false)
  const [datesWithData, setDatesWithData] = useState<Set<string>>(new Set())

  const today = todayStr()

  /* 서비스 탭 전환 */
  function handleServiceChange(newId: string) {
    const svc = services.find(s => s.id === newId)
    if (!svc) return
    setServiceId(newId)
    setDate(defaultDateFor(svc))
    setWindowDates(hasDayOfWeek(svc) ? buildInitialDates(svc.dayOfWeek) : [])
  }

  /* ← : 과거 날짜 하나 추가, 미래 날짜 하나 제거 */
  function handlePrev() {
    if (windowDates.length === 0) { setDate(d => shiftDate(d, -1)); return }
    setWindowDates(prev => [shiftDate(prev[0], -7), ...prev.slice(0, -1)])
  }

  /* → : 미래 날짜 하나 추가, 과거 날짜 하나 제거 */
  function handleNext() {
    if (windowDates.length === 0) { setDate(d => shiftDate(d, 1)); return }
    setWindowDates(prev => [...prev.slice(1), shiftDate(prev[prev.length - 1], 7)])
  }

  /* 출석 데이터 로드 */
  const loadAttendance = useCallback(async () => {
    if (!serviceId) return
    setLoading(true)
    try {
      setRows(await getAttendanceForInput(serviceId, date))
    } finally {
      setLoading(false)
    }
  }, [serviceId, date])

  useEffect(() => { loadAttendance() }, [loadAttendance])

  /* 창 내 날짜 중 출석 데이터 있는 날짜 조회 */
  useEffect(() => {
    if (!serviceId || windowDates.length === 0) return
    getAttendanceDatesWithData(serviceId, windowDates).then(dates => {
      setDatesWithData(new Set(dates))
    })
  }, [serviceId, windowDates])

  /* 개별 토글 (낙관적 업데이트) */
  async function handleToggle(memberId: string, current: boolean) {
    setSavingIds(prev => new Set(prev).add(memberId))
    setRows(prev => prev.map(r => r.memberId === memberId ? { ...r, attended: !current } : r))
    try {
      await upsertAttendance(memberId, serviceId, date, !current)
    } catch {
      setRows(prev => prev.map(r => r.memberId === memberId ? { ...r, attended: current } : r))
    } finally {
      setSavingIds(prev => { const s = new Set(prev); s.delete(memberId); return s })
    }
  }

  /* 전체 설정 */
  async function handleBulkSet(attended: boolean) {
    setBulkSaving(true)
    setRows(prev => prev.map(r => ({ ...r, attended })))
    try {
      await bulkSetAttendance(serviceId, date, rows.map(r => r.memberId), attended)
    } catch {
      await loadAttendance()
    } finally {
      setBulkSaving(false)
    }
  }

  /* 목장별 그룹 */
  const groups = Object.entries(
    rows.reduce<Record<string, AttendanceRow[]>>((acc, r) => {
      const key = r.cellGroupName ?? '목장 미배정'
      ;(acc[key] ??= []).push(r)
      return acc
    }, {}),
  ) as [string, AttendanceRow[]][]

  const attendedCount = rows.filter(r => r.attended).length

  const navBtn: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
    color: '#6E6E73', display: 'flex', alignItems: 'center', borderRadius: 6, flexShrink: 0,
  }

  return (
    <div>
      {/* 예배 탭 */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 16 }}>
        {services.map(s => {
          const active = s.id === serviceId
          return (
            <button key={s.id} onClick={() => handleServiceChange(s.id)} style={{
              padding: '9px 18px', fontSize: 13, fontWeight: active ? 600 : 400,
              color: active ? 'var(--color-primary)' : '#86868B',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: -1, whiteSpace: 'nowrap',
            }}>{s.name}</button>
          )
        })}
      </div>

      {/* 날짜 스트립 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16,
        background: '#fff', borderRadius: 12, padding: '10px 10px',
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
        <button style={navBtn} onClick={handlePrev}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {windowDates.length > 0 ? (
          <div style={{ flex: 1, display: 'flex', gap: 6, overflow: 'hidden' }}>
            {windowDates.map(d => {
              const sel = d === date
              const fadedFuture = d > today && !datesWithData.has(d)
              return (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: 20, fontSize: 13,
                    fontWeight: sel ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap',
                    border: sel ? 'none' : '1px solid rgba(0,0,0,0.1)',
                    background: sel ? 'var(--color-primary)' : 'transparent',
                    color: sel ? '#fff' : fadedFuture ? '#C7C7CC' : '#1D1D1F',
                    boxShadow: sel ? '0 1px 4px rgba(59,74,47,0.18)' : 'none',
                    transition: 'all 0.12s',
                  }}
                >
                  {formatShort(d)}
                </button>
              )
            })}
          </div>
        ) : (
          /* dayOfWeek 미설정 — 날짜 직접 선택 */
          <label style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F' }}>
              {formatLong(date)}
            </span>
            <input
              type="date" value={date}
              onChange={e => e.target.value && setDate(e.target.value)}
              style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer', width: '100%' }}
            />
          </label>
        )}

        <button style={navBtn} onClick={handleNext}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* 액션 바 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#86868B' }}>
          {loading ? '불러오는 중…' : `${attendedCount} / ${rows.length}명 출석`}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => handleBulkSet(true)} disabled={bulkSaving || loading} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: 'rgba(52,199,89,0.1)', color: '#1A8C3E',
            border: '1px solid rgba(52,199,89,0.2)', cursor: 'pointer', opacity: bulkSaving ? 0.5 : 1,
          }}>전체 출석</button>
          <button onClick={() => handleBulkSet(false)} disabled={bulkSaving || loading} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: '#F2F2F7', color: '#86868B',
            border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', opacity: bulkSaving ? 0.5 : 1,
          }}>전체 결석</button>
        </div>
      </div>

      {/* 성도 목록 */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#C7C7CC', margin: 0 }}>불러오는 중…</p>
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#C7C7CC', margin: 0 }}>활동 중인 성도가 없습니다.</p>
          </div>
        ) : (
          groups.map(([groupName, groupRows], gi) => (
            <div key={groupName}>
              <div style={{
                padding: '7px 16px', background: '#F9F9FB',
                borderTop: gi > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#86868B', letterSpacing: '0.3px' }}>
                  {groupName}
                </span>
                <span style={{ fontSize: 11, color: '#AEAEB2' }}>
                  {groupRows.filter(r => r.attended).length}/{groupRows.length}
                </span>
              </div>
              {groupRows.map((row, ri) => {
                const isSaving = savingIds.has(row.memberId)
                return (
                  <div key={row.memberId} style={{
                    display: 'flex', alignItems: 'center', padding: '10px 16px',
                    borderBottom: ri < groupRows.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  }}>
                    <span style={{ flex: 1, fontSize: 14, color: '#1D1D1F' }}>{row.name}</span>
                    <button
                      onClick={() => handleToggle(row.memberId, row.attended)}
                      disabled={isSaving || bulkSaving}
                      style={{
                        padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        border: 'none', cursor: isSaving ? 'default' : 'pointer',
                        background: row.attended ? 'rgba(52,199,89,0.12)' : '#F2F2F7',
                        color: row.attended ? '#1A8C3E' : '#AEAEB2',
                        opacity: isSaving ? 0.5 : 1, minWidth: 56,
                        transition: 'all 0.12s',
                      }}
                    >
                      {isSaving ? '…' : row.attended ? '출석' : '결석'}
                    </button>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function NoServicesPlaceholder() {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)',
      padding: '48px 24px', textAlign: 'center',
    }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#3A3A3C', margin: '0 0 8px' }}>
        등록된 예배가 없습니다
      </p>
      <p style={{ fontSize: 13, color: '#86868B', margin: '0 0 20px' }}>
        출석 체크인을 하려면 먼저 예배 종류를 추가해주세요.
      </p>
      <Link href="/worship/services" style={{
        display: 'inline-block', padding: '8px 18px', borderRadius: 8,
        fontSize: 13, fontWeight: 500,
        background: 'var(--color-primary)', color: '#fff', textDecoration: 'none',
      }}>
        예배 종류 관리로 이동
      </Link>
    </div>
  )
}
