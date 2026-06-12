import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: { role: string; username: string; cellGroupId: string | null } & DefaultSession['user']
  }
}
