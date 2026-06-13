import * as XLSX from 'xlsx'

export type ExcelColumn = {
  key: string
  label: string
  required?: boolean
  example?: string
}

export function exportToExcel(
  data: Record<string, string | number | boolean | null | undefined>[],
  columns: { key: string; label: string }[],
  filename: string,
) {
  const header = columns.map(c => c.label)
  const rows = data.map(row => columns.map(c => row[c.key] ?? ''))
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  ws['!cols'] = columns.map(() => ({ wch: 16 }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '데이터')
  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `${filename}_${date}.xlsx`)
}

export function downloadTemplate(columns: ExcelColumn[], filename: string) {
  const header = columns.map(c => c.label)
  const example = columns.map(c => c.example ?? '')

  const ws = XLSX.utils.aoa_to_sheet([header, example])

  // 헤더 행 스타일 (너비 설정)
  ws['!cols'] = columns.map(() => ({ wch: 18 }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '데이터')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function parseExcel(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
          defval: '',
          raw: false,
        })
        resolve(rows)
      } catch {
        reject(new Error('파일을 읽을 수 없습니다.'))
      }
    }
    reader.onerror = () => reject(new Error('파일 읽기 실패'))
    reader.readAsArrayBuffer(file)
  })
}
