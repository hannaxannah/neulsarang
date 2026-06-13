'use client'

import { useState, useRef } from 'react'
import { downloadTemplate, parseExcel, type ExcelColumn } from '@/lib/excel'

export type ExcelRow = Record<string, string>

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

type ParsedRow = {
  index: number
  data: ExcelRow
  errors: string[]
}

type SaveResult = {
  success: number
  failed: number
  errors: string[]
}

const MAX_ROWS = 500

export default function ExcelUploadModal({
  title,
  columns,
  templateFilename,
  onValidate,
  onSave,
  onClose,
}: {
  title: string
  columns: ExcelColumn[]
  templateFilename: string
  onValidate: (row: ExcelRow) => ValidationResult
  onSave: (rows: ExcelRow[]) => Promise<SaveResult>
  onClose: () => void
}) {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload')
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [fileError, setFileError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const validRows = parsedRows.filter(r => r.errors.length === 0)
  const invalidRows = parsedRows.filter(r => r.errors.length > 0)

  async function handleFile(file: File) {
    setFileError('')
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls'].includes(ext ?? '')) {
      setFileError('.xlsx 또는 .xls 파일만 업로드할 수 있습니다.')
      return
    }
    setLoading(true)
    try {
      const raw = await parseExcel(file)
      if (raw.length === 0) {
        setFileError('데이터가 없습니다. 템플릿을 확인해주세요.')
        return
      }
      if (raw.length > MAX_ROWS) {
        setFileError(`최대 ${MAX_ROWS}행까지 업로드할 수 있습니다. (현재 ${raw.length}행)`)
        return
      }
      const rows: ParsedRow[] = raw.map((data, index) => {
        const result = onValidate(data)
        return { index: index + 2, data, errors: result.errors }
      })
      setParsedRows(rows)
      setStep('preview')
    } catch (e) {
      setFileError(e instanceof Error ? e.message : '파일 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (validRows.length === 0) return
    setLoading(true)
    try {
      const result = await onSave(validRows.map(r => r.data))
      setSaveResult(result)
      setStep('result')
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%',
        maxWidth: step === 'preview' ? 760 : 480,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden',
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>{title}</p>
            {step === 'upload' && (
              <p style={{ fontSize: 12, color: '#86868B', margin: '2px 0 0' }}>
                템플릿을 다운로드한 뒤 작성하여 업로드해주세요.
              </p>
            )}
            {step === 'preview' && (
              <p style={{ fontSize: 12, color: '#86868B', margin: '2px 0 0' }}>
                총 {parsedRows.length}행 —{' '}
                <span style={{ color: '#1C8754' }}>정상 {validRows.length}건</span>
                {invalidRows.length > 0 && (
                  <span style={{ color: '#FF3B30' }}> · 오류 {invalidRows.length}건</span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#86868B', padding: 4 }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 바디 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Step 1: 업로드 */}
          {step === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* 템플릿 다운로드 */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: '#F5F7F5', borderRadius: 10,
                border: '1px solid rgba(59,74,47,0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: 'rgba(59,74,47,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-primary)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1D1D1F', margin: 0 }}>엑셀 템플릿</p>
                    <p style={{ fontSize: 11, color: '#86868B', margin: 0 }}>
                      {columns.map(c => c.label).join(', ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => downloadTemplate(columns, templateFilename)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer',
                  }}
                >다운로드</button>
              </div>

              {/* 파일 드롭존 */}
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(0,0,0,0.12)', borderRadius: 12,
                  padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
                  background: '#FAFAFA', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
              >
                {loading ? (
                  <p style={{ fontSize: 13, color: '#86868B', margin: 0 }}>파일 처리 중…</p>
                ) : (
                  <>
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#C7C7CC" strokeWidth={1.5} style={{ marginBottom: 12 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#3A3A3C', margin: '0 0 4px' }}>
                      파일을 드래그하거나 클릭하여 업로드
                    </p>
                    <p style={{ fontSize: 12, color: '#86868B', margin: 0 }}>.xlsx / .xls · 최대 500행</p>
                  </>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
              />

              {fileError && (
                <p style={{ fontSize: 13, color: '#FF3B30', margin: 0, padding: '10px 14px', background: '#FFF2F2', borderRadius: 8 }}>
                  {fileError}
                </p>
              )}
            </div>
          )}

          {/* Step 2: 미리보기 */}
          {step === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {invalidRows.length > 0 && (
                <div style={{ padding: '10px 14px', background: '#FFF8ED', borderRadius: 8, border: '1px solid rgba(255,149,0,0.2)' }}>
                  <p style={{ fontSize: 12, color: '#8A6400', margin: 0 }}>
                    ⚠️ 오류 행({invalidRows.length}건)은 저장에서 제외됩니다. 빨간 행을 확인해주세요.
                  </p>
                </div>
              )}
              <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: '#86868B', fontWeight: 500, whiteSpace: 'nowrap' }}>행</th>
                      {columns.map(c => (
                        <th key={c.key} style={{ padding: '8px 12px', textAlign: 'left', color: '#86868B', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {c.label}{c.required && <span style={{ color: '#FF3B30' }}>*</span>}
                        </th>
                      ))}
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: '#86868B', fontWeight: 500 }}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, i) => {
                      const hasError = row.errors.length > 0
                      return (
                        <tr
                          key={i}
                          style={{
                            borderBottom: i < parsedRows.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                            background: hasError ? '#FFF5F5' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '7px 12px', color: '#86868B' }}>{row.index}</td>
                          {columns.map(c => (
                            <td key={c.key} style={{ padding: '7px 12px', color: '#1D1D1F', whiteSpace: 'nowrap' }}>
                              {row.data[c.label] || <span style={{ color: '#C7C7CC' }}>–</span>}
                            </td>
                          ))}
                          <td style={{ padding: '7px 12px', whiteSpace: 'nowrap' }}>
                            {hasError ? (
                              <span style={{ fontSize: 11, color: '#FF3B30' }} title={row.errors.join(', ')}>
                                ✕ {row.errors[0]}{row.errors.length > 1 ? ` 외 ${row.errors.length - 1}건` : ''}
                              </span>
                            ) : (
                              <span style={{ fontSize: 11, color: '#1C8754' }}>✓ 정상</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 3: 결과 */}
          {step === 'result' && saveResult && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '16px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: saveResult.success > 0 ? '#E8F8EF' : '#FFF2F2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {saveResult.success > 0 ? (
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1C8754" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#FF3B30" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: '0 0 6px' }}>업로드 완료</p>
                <p style={{ fontSize: 13, color: '#86868B', margin: 0 }}>
                  성공 <strong style={{ color: '#1C8754' }}>{saveResult.success}건</strong>
                  {saveResult.failed > 0 && (
                    <> · 실패 <strong style={{ color: '#FF3B30' }}>{saveResult.failed}건</strong></>
                  )}
                </p>
              </div>
              {saveResult.errors.length > 0 && (
                <div style={{
                  width: '100%', padding: '12px 14px', background: '#FFF5F5',
                  borderRadius: 8, border: '1px solid rgba(255,59,48,0.15)',
                }}>
                  {saveResult.errors.slice(0, 5).map((e, i) => (
                    <p key={i} style={{ fontSize: 12, color: '#FF3B30', margin: i > 0 ? '4px 0 0' : 0 }}>{e}</p>
                  ))}
                  {saveResult.errors.length > 5 && (
                    <p style={{ fontSize: 12, color: '#86868B', margin: '4px 0 0' }}>외 {saveResult.errors.length - 5}건</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', flexShrink: 0,
        }}>
          {step === 'upload' && (
            <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer' }}>
              취소
            </button>
          )}
          {step === 'preview' && (
            <>
              <button
                onClick={() => { setStep('upload'); setParsedRows([]); if (inputRef.current) inputRef.current.value = '' }}
                style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer' }}
              >다시 선택</button>
              <button
                onClick={handleSave}
                disabled={validRows.length === 0 || loading}
                style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: validRows.length === 0 ? '#C7C7CC' : 'var(--color-primary)',
                  color: '#fff', border: 'none',
                  cursor: validRows.length === 0 || loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '저장 중…' : `${validRows.length}건 저장`}
              </button>
            </>
          )}
          {step === 'result' && (
            <button
              onClick={onClose}
              style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
            >닫기</button>
          )}
        </div>
      </div>
    </div>
  )
}
