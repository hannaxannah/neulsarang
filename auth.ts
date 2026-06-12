import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: '아이디', type: 'text' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) return null

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.username, credentials.username as string))
            .limit(1)

          if (!user || !user.isActive) return null

          const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
          if (!valid) return null

          return { id: user.id, name: user.name, email: user.username, role: user.role }
        } catch (e) {
          console.error('[auth] authorize error:', e)
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role
        // email 필드에 username 값이 담겨 있음 (NextAuth 호환성)
        token.username = token.email ?? ''
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.username = token.username as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
})
