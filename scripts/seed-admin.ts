import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import * as schema from '../lib/db/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function main() {
  const username = 'admin'
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1)

  if (existing) {
    console.log('관리자 계정이 이미 존재합니다:', username)
    process.exit(0)
  }

  const passwordHash = await bcrypt.hash('admin1234!', 12)
  await db.insert(schema.users).values({
    name: '관리자',
    username,
    passwordHash,
    role: 'admin',
  })

  console.log('✅ 관리자 계정 생성 완료')
  console.log('   아이디:', username)
  console.log('   비밀번호: admin1234!')
  console.log('   ⚠️  첫 로그인 후 반드시 비밀번호를 변경하세요.')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
