'use client'

import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { importMembersFromExcel } from '@/actions/members'

const COLUMNS = ['이름', '성별', '생년월일', '연락처', '이메일', '주소', '등록일', '세례여부', '메모']

export default function ExcelImport() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setStatus('')
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf)
    const ws = wb.Sheets[wb.SheetNames[0]]
    const raw = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' })
    const rows = raw
      .filter((r) => r['이름'])
      .map((r) => ({
        name: String(r['이름'] ?? '').trim(),
        gender: r['성별'] === '남' ? 'male' : r['성별'] === '여' ? 'female' : undefined,
        birthDate: r['생년월일'] ? String(r['생년월일']) : undefined,
        phone: r['연락처'] ? String(r['연락처']) : undefined,
        email: r['이메일'] ? String(r['이메일']) : undefined,
        address: r['주소'] ? String(r['주소']) : undefined,
        registeredAt: r['등록일'] ? String(r['등록일']) : undefined,
        isBaptized: r['세례여부'] === 'O' || r['세례여부'] === '예',
        notes: r['메모'] ? String(r['메모']) : undefined,
      }))
    if (rows.length === 0) {
      setStatus('가져올 데이터가 없습니다.')
      setLoading(false)
      return
    }
    const result = await importMembersFromExcel(rows)
    setStatus(`${result.count}명 완료`)
    setLoading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function downloadTemplate() {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([COLUMNS])
    XLSX.utils.book_append_sheet(wb, ws, '성도명단')
    XLSX.writeFile(wb, '성도_업로드_양식.xlsx')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={downloadTemplate}
        style={{
          padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
          background: '#F2F2F7', color: '#3A3A3C',
          border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer',
        }}
      >
        양식 다운로드
      </button>
      <label style={{ cursor: 'pointer' }}>
        <span style={{
          display: 'inline-block', padding: '7px 12px', borderRadius: 8,
          fontSize: 12, fontWeight: 500,
          background: '#F2F2F7',
          color: loading ? '#86868B' : 'var(--color-text-secondary)',
          border: '1px solid rgba(0,0,0,0.08)',
          cursor: loading ? 'default' : 'pointer',
        }}>
          {loading ? '처리 중…' : '엑셀 업로드'}
        </span>
        <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleFile} disabled={loading} />
      </label>
      {status && (
        <span style={{ fontSize: 12, color: status.includes('완료') ? '#1C8754' : '#FF3B30' }}>
          {status}
        </span>
      )}
    </div>
  )
}
