'use client'

import { useState } from 'react'
import { createUser, updateUser, resetPassword } from '@/actions/users'

type User = { id: string; name: string; username: string; role: string; cellGroupId: string | null; isActive: boolean }
type CellGroup = { id: string; name: string }

export default function UserFormModal({
  user,
  cellGroups,
  onClose,
}: {
  user: User | null
  cellGroups: CellGroup[]
  onClose: () => void
}) {
  const isEdit = !!user
  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(user?.role ?? 'shepherd')
  const [cellGroupId, setCellGroupId] = useState(user?.cellGroupId ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('이름을 입력하세요.'); return }
    if (!isEdit && !username.trim()) { setError('아이디를 입력하세요.'); return }
    if (!isEdit && password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return }
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(username)) { setError('아이디는 한글을 사용할 수 없습니다.'); return }

    setLoading(true)
    try {
      if (isEdit) {
        await updateUser(user.id, { role, cellGroupId: cellGroupId || null })
        if (password) await resetPassword(user.id, password)
      } else {
        await createUser({ name, username, password, role, cellGroupId: cellGroupId || null })
      }
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8,
    padding: '8px 12px', fontSize: 13, color: '#1D1D1F', background: '#fff',
  }
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: '#3A3A3C', marginBottom: 4, display: 'block' }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px 28px 24px', width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1D1D1F', margin: '0 0 20px' }}>
          {isEdit ? '계정 수정' : '계정 생성'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>이름</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" disabled={isEdit} />
          </div>

          <div>
            <label style={labelStyle}>아이디</label>
            <input style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="영문·숫자" disabled={isEdit} />
          </div>

          <div>
            <label style={labelStyle}>{isEdit ? '새 비밀번호 (변경 시만 입력)' : '비밀번호'}</label>
            <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEdit ? '변경하지 않으면 비워두세요' : '6자 이상'} />
          </div>

          <div>
            <label style={labelStyle}>역할</label>
            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="shepherd">목자</option>
              <option value="pastor">목회자</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          {role === 'shepherd' && (
            <div>
              <label style={labelStyle}>담당 목장</label>
              <select style={inputStyle} value={cellGroupId} onChange={(e) => setCellGroupId(e.target.value)}>
                <option value="">— 미배정 —</option>
                {cellGroups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p style={{ fontSize: 12, color: '#FF3B30', margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer' }}>
              취소
            </button>
            <button type="submit" disabled={loading} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? '처리 중…' : isEdit ? '저장' : '생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
