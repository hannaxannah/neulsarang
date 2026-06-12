'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(username)) {
      setError('아이디는 한글을 사용할 수 없습니다.')
      return
    }
    setLoading(true)
    const result = await signIn('credentials', { username, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <style>{`
        .login-input:focus { outline: none; border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(59,74,47,0.12); }
        .login-btn { background: var(--color-primary); transition: background 0.2s; }
        .login-btn:hover:not(:disabled) { background: var(--color-primary-hover); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .back-link { color: var(--color-text-tertiary); transition: color 0.15s; }
        .back-link:hover { color: var(--color-text); }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--font-sans)',
      }}>

        {/* Card */}
        <div className="login-card" style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          borderRadius: 20,
          padding: '40px 36px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.07)',
        }}>

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 500,
              color: 'var(--color-primary)',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}>
              늘사랑교회
            </h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: 0 }}>
              목회돌봄 관리 시스템
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
                아이디
              </label>
              <input
                className="login-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
                style={{
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 14,
                  color: 'var(--color-text)',
                  background: '#fff',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
                비밀번호
              </label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                style={{
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 14,
                  color: 'var(--color-text)',
                  background: '#fff',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--color-danger)', margin: 0, textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{
                marginTop: 4,
                padding: '11px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <Link href="/" className="back-link" style={{
          marginTop: 24,
          fontSize: 13,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          홈으로 돌아가기
        </Link>

      </div>
    </>
  )
}
