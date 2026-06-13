import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import * as schema from '../lib/db/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const CELL_GROUPS = [
  { name: '사랑목장' },
  { name: '은혜목장' },
  { name: '소망목장' },
  { name: '믿음목장' },
  { name: '기쁨목장' },
]

const MEMBERS = [
  // 사랑목장
  { name: '김민준', gender: 'male',   birthDate: '1985-03-12', phone: '010-1234-5678', registeredAt: '2015-03-01', isBaptized: true,  baptizedAt: '2016-04-10', status: 'active',      cellGroup: '사랑목장' },
  { name: '이서연', gender: 'female', birthDate: '1990-07-22', phone: '010-2345-6789', registeredAt: '2017-09-10', isBaptized: true,  baptizedAt: '2018-04-08', status: 'active',      cellGroup: '사랑목장' },
  { name: '박지훈', gender: 'male',   birthDate: '1978-11-05', phone: '010-3456-7890', registeredAt: '2010-01-15', isBaptized: true,  baptizedAt: '2011-04-24', status: 'active',      cellGroup: '사랑목장' },
  { name: '최수아', gender: 'female', birthDate: '1995-05-18', phone: '010-4567-8901', registeredAt: '2020-06-07', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: '사랑목장' },
  { name: '정하은', gender: 'female', birthDate: '2002-08-30', phone: '010-5678-9012', registeredAt: '2022-03-13', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: '사랑목장' },
  // 은혜목장
  { name: '강도현', gender: 'male',   birthDate: '1982-12-01', phone: '010-6789-0123', registeredAt: '2013-11-20', isBaptized: true,  baptizedAt: '2014-04-20', status: 'active',      cellGroup: '은혜목장' },
  { name: '윤지민', gender: 'female', birthDate: '1993-04-14', phone: '010-7890-1234', registeredAt: '2019-02-28', isBaptized: true,  baptizedAt: '2020-04-12', status: 'active',      cellGroup: '은혜목장' },
  { name: '임현우', gender: 'male',   birthDate: '1975-09-27', phone: '010-8901-2345', registeredAt: '2008-05-11', isBaptized: true,  baptizedAt: '2009-04-19', status: 'active',      cellGroup: '은혜목장' },
  { name: '한소희', gender: 'female', birthDate: '1998-02-09', phone: '010-9012-3456', registeredAt: '2021-10-04', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: '은혜목장' },
  { name: '오승민', gender: 'male',   birthDate: '1988-06-16', phone: '010-0123-4567', registeredAt: '2016-07-22', isBaptized: true,  baptizedAt: '2017-04-16', status: 'inactive',    cellGroup: '은혜목장' },
  // 소망목장
  { name: '서지안', gender: 'female', birthDate: '1992-10-03', phone: '010-1111-2222', registeredAt: '2018-04-01', isBaptized: true,  baptizedAt: '2019-04-21', status: 'active',      cellGroup: '소망목장' },
  { name: '노태현', gender: 'male',   birthDate: '1970-01-25', phone: '010-2222-3333', registeredAt: '2005-08-14', isBaptized: true,  baptizedAt: '2006-04-09', status: 'active',      cellGroup: '소망목장' },
  { name: '배유나', gender: 'female', birthDate: '2000-12-07', phone: '010-3333-4444', registeredAt: '2023-01-08', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: '소망목장' },
  { name: '황민석', gender: 'male',   birthDate: '1965-04-19', phone: '010-4444-5555', registeredAt: '2003-03-30', isBaptized: true,  baptizedAt: '2004-04-11', status: 'active',      cellGroup: '소망목장' },
  { name: '조예린', gender: 'female', birthDate: '1987-08-23', phone: '010-5555-6666', registeredAt: '2014-12-05', isBaptized: true,  baptizedAt: '2015-04-05', status: 'transferred', cellGroup: '소망목장' },
  // 믿음목장
  { name: '신동혁', gender: 'male',   birthDate: '1980-02-14', phone: '010-6666-7777', registeredAt: '2011-06-18', isBaptized: true,  baptizedAt: '2012-04-08', status: 'active',      cellGroup: '믿음목장' },
  { name: '류다인', gender: 'female', birthDate: '1996-11-29', phone: '010-7777-8888', registeredAt: '2022-08-21', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: '믿음목장' },
  { name: '문재원', gender: 'male',   birthDate: '1973-07-08', phone: '010-8888-9999', registeredAt: '2007-02-03', isBaptized: true,  baptizedAt: '2008-04-13', status: 'active',      cellGroup: '믿음목장' },
  { name: '권나연', gender: 'female', birthDate: '2001-05-12', phone: '010-9999-0000', registeredAt: '2023-09-17', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: '믿음목장' },
  { name: '홍성준', gender: 'male',   birthDate: '1991-03-06', phone: '010-1212-3434', registeredAt: '2019-05-25', isBaptized: true,  baptizedAt: '2021-04-04', status: 'inactive',    cellGroup: '믿음목장' },
  // 기쁨목장
  { name: '송미래', gender: 'female', birthDate: '1983-09-17', phone: '010-2323-4545', registeredAt: '2012-10-09', isBaptized: true,  baptizedAt: '2013-04-07', status: 'active',      cellGroup: '기쁨목장' },
  { name: '안재호', gender: 'male',   birthDate: '1968-12-31', phone: '010-3434-5656', registeredAt: '2001-07-16', isBaptized: true,  baptizedAt: '2002-04-14', status: 'active',      cellGroup: '기쁨목장' },
  { name: '전혜원', gender: 'female', birthDate: '1999-06-04', phone: '010-4545-6767', registeredAt: '2023-04-02', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: '기쁨목장' },
  { name: '남궁철', gender: 'male',   birthDate: '1977-10-20', phone: '010-5656-7878', registeredAt: '2009-11-28', isBaptized: true,  baptizedAt: '2010-04-18', status: 'active',      cellGroup: '기쁨목장' },
  { name: '백수진', gender: 'female', birthDate: '1994-01-15', phone: '010-6767-8989', registeredAt: '2020-12-14', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: '기쁨목장' },
  // 미배정
  { name: '장우진', gender: 'male',   birthDate: '2003-07-11', phone: '010-7878-9090', registeredAt: '2024-02-18', isBaptized: false, baptizedAt: null,          status: 'active',      cellGroup: null },
  { name: '김하늘', gender: 'female', birthDate: '1986-05-29', phone: '010-8989-0101', registeredAt: '2015-08-03', isBaptized: true,  baptizedAt: '2016-04-03', status: 'inactive',    cellGroup: null },
  { name: '이도윤', gender: 'male',   birthDate: '1972-03-08', phone: '010-0101-2323', registeredAt: '2006-04-22', isBaptized: true,  baptizedAt: '2007-04-15', status: 'active',      cellGroup: null },
]

async function main() {
  console.log('🌱 목데이터 시드 시작...')

  // 기존 목데이터 삭제 (members만, admin 계정은 유지)
  const existingMembers = await db.select().from(schema.members).limit(1)
  if (existingMembers.length > 0) {
    console.log('  기존 성도 데이터 초기화 중...')
    await db.delete(schema.members)
  }

  const existingGroups = await db.select().from(schema.cellGroups).limit(1)
  if (existingGroups.length > 0) {
    console.log('  기존 목장 데이터 초기화 중...')
    await db.delete(schema.cellGroups)
  }

  // 목장 생성
  console.log('  목장 생성 중...')
  const createdGroups: Record<string, string> = {}
  for (const cg of CELL_GROUPS) {
    const [row] = await db.insert(schema.cellGroups).values({ name: cg.name }).returning({ id: schema.cellGroups.id })
    createdGroups[cg.name] = row.id
  }
  console.log(`  ✅ 목장 ${CELL_GROUPS.length}개 생성`)

  // 성도 생성
  console.log('  성도 생성 중...')
  for (const m of MEMBERS) {
    await db.insert(schema.members).values({
      name:        m.name,
      gender:      m.gender,
      birthDate:   m.birthDate,
      phone:       m.phone,
      registeredAt: m.registeredAt,
      isBaptized:  m.isBaptized,
      baptizedAt:  m.baptizedAt ?? undefined,
      status:      m.status,
      cellGroupId: m.cellGroup ? createdGroups[m.cellGroup] : undefined,
    })
  }
  console.log(`  ✅ 성도 ${MEMBERS.length}명 생성`)

  console.log('\n🎉 시드 완료!')
  console.log('   목장: 사랑·은혜·소망·믿음·기쁨목장 (5개)')
  console.log(`   성도: 총 ${MEMBERS.length}명 (활동 23·비활동 3·이전 1·미배정 3)`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
