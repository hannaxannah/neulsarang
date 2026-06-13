'use client'

import { useState } from 'react'
import { updateUser } from '@/actions/users'
import UserFormModal from './UserFormModal'

type User = {
  id: string
  name: string
  username: string
  role: string
  cellGroupId: string | null
  isActive: boolean
  createdAt: Date
}

type CellGroup = { id: string; name: string }

const ROLE_LABEL: Record<string, string> = { admin: '관리자', pastor: '목회자', shepherd: '목자' }
const ROLE_COLOR: Record<string, string> = {
  admin: '#3B4A2F',
  pastor: '#1C6EA4',
  shepherd: '#7C5C2E',
}

export default function UserTable({ users, cellGroups }: { users: User[]; cellGroups: CellGroup[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)

  async function handleToggleActive(user: User) {
    await updateUser(user.id, { isActive: !user.isActive })
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >
          + 계정 생성
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#FAFAFA', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {['이름', '아이디', '역할', '담당 목장', '상태', ''].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: '#86868B', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const group = cellGroups.find((g) => g.id === u.cellGroupId)
              return (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1D1D1F' }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', color: '#3A3A3C', fontFamily: 'monospace' }}>{u.username}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                      background: ROLE_COLOR[u.role] + '18', color: ROLE_COLOR[u.role],
                    }}>
                      {ROLE_LABEL[u.role] ?? u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: group ? '#3A3A3C' : '#C7C7CC' }}>
                    {group?.name ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                      background: u.isActive ? '#1C875418' : '#F2F2F7',
                      color: u.isActive ? '#1C8754' : '#AEAEB2',
                    }}>
                      {u.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => { setEditing(u); setShowForm(true) }}
                        style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, background: '#F2F2F7', color: '#3A3A3C', border: 'none', cursor: 'pointer' }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleToggleActive(u)}
                        style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 12, border: 'none', cursor: 'pointer',
                          background: u.isActive ? '#FFF0F0' : '#F2F2F7',
                          color: u.isActive ? '#FF3B30' : '#AEAEB2',
                        }}
                      >
                        {u.isActive ? '비활성화' : '활성화'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <UserFormModal
          user={editing}
          cellGroups={cellGroups}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </>
  )
}
