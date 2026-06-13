'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ExcelUploadModal from '@/components/ui/ExcelUploadModal'
import type { ExcelRow } from '@/components/ui/ExcelUploadModal'
import { exportToExcel } from '@/lib/excel'
import { exportMembersAction } from '@/actions/members'

const UPLOAD_COLUMNS = [
  { key: 'name',         label: '이름',     required: true,  example: '홍길동' },
  { key: 'gender',       label: '성별',     required: true,  example: '남' },
  { key: 'birthDate',    label: '생년월일',               example: '1990-01-01' },
  { key: 'phone',        label: '연락처',                 example: '010-1234-5678' },
  { key: 'registeredAt', label: '등록일',                 example: '2024-03-01' },
  { key: 'cellGroup',    label: '목장명',                 example: '1목장' },
  { key: 'isBaptized',   label: '세례여부',               example: 'O' },
]

const DOWNLOAD_COLUMNS = [
  { key: 'name',          label: '이름' },
  { key: 'gender',        label: '성별' },
  { key: 'birthDate',     label: '생년월일' },
  { key: 'phone',         label: '연락처' },
  { key: 'email',         label: '이메일' },
  { key: 'address',       label: '주소' },
  { key: 'cellGroupName', label: '목장명' },
  { key: 'registeredAt',  label: '등록일' },
  { key: 'isBaptized',    label: '세례여부' },
  { key: 'baptizedAt',    label: '세례일' },
  { key: 'status',        label: '상태' },
  { key: 'notes',         label: '메모' },
]

function validateMemberRow(row: ExcelRow) {
  const errors: string[] = []
  if (!row['이름']?.trim()) errors.push('이름 필수')
  if (!['남', '여'].includes(row['성별']?.trim())) errors.push('성별은 남/여')
  return { valid: errors.length === 0, errors }
}

export default function MembersExcelButton() {
  const router = useRouter()
  const sp = useSearchParams()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const rows = await exportMembersAction({
        search:      sp.get('q') ?? undefined,
        cellGroupId: sp.get('cellGroup') ?? undefined,
        gender:      sp.get('gender') ?? undefined,
        ageGroup:    sp.get('ageGroup') ?? undefined,
        year:        sp.get('year') ?? undefined,
        status:      sp.get('status') ?? undefined,
      })
      exportToExcel(rows, DOWNLOAD_COLUMNS, '성도_목록')
    } finally {
      setDownloading(false)
    }
  }

  const btnBase: React.CSSProperties = {
    padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
    background: '#F2F2F7', color: '#3A3A3C',
    border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', whiteSpace: 'nowrap',
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8 }} className="col-mobile-hide">
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{ ...btnBase, opacity: downloading ? 0.6 : 1, cursor: downloading ? 'not-allowed' : 'pointer' }}
        >
          {downloading ? '다운로드 중…' : '엑셀 다운로드'}
        </button>
        <button onClick={() => setUploadOpen(true)} style={btnBase}>
          엑셀 업로드
        </button>
      </div>

      {uploadOpen && (
        <ExcelUploadModal
          title="성도 엑셀 업로드"
          columns={UPLOAD_COLUMNS}
          templateFilename="성도_업로드_템플릿"
          onValidate={validateMemberRow}
          onSave={async (rows) => {
            await new Promise(r => setTimeout(r, 600))
            return { success: rows.length, failed: 0, errors: [] }
          }}
          onClose={() => { setUploadOpen(false); router.refresh() }}
        />
      )}
    </>
  )
}
