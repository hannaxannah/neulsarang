import {
  pgTable, uuid, varchar, text, boolean, integer,
  date, timestamp, unique,
} from 'drizzle-orm/pg-core'

// ─── 계정 ───────────────────────────────────────────────
export const users = pgTable('users', {
  id:           uuid('id').defaultRandom().primaryKey(),
  name:         varchar('name', { length: 100 }).notNull(),
  username:     varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role:         varchar('role', { length: 20 }).notNull().default('shepherd'), // admin | pastor | shepherd
  cellGroupId:  uuid('cell_group_id'),
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
  updatedAt:    timestamp('updated_at').notNull().defaultNow(),
})

// ─── 성도 ───────────────────────────────────────────────
export const members = pgTable('members', {
  id:           uuid('id').defaultRandom().primaryKey(),
  name:         varchar('name', { length: 100 }).notNull(),
  gender:       varchar('gender', { length: 10 }),             // male | female
  birthDate:    date('birth_date'),
  phone:        varchar('phone', { length: 20 }),
  email:        varchar('email', { length: 255 }),
  address:      text('address'),
  registeredAt: date('registered_at'),
  isBaptized:   boolean('is_baptized').notNull().default(false),
  baptizedAt:   date('baptized_at'),
  cellGroupId:  uuid('cell_group_id'),
  status:       varchar('status', { length: 20 }).notNull().default('active'), // active | inactive | transferred
  photoUrl:     varchar('photo_url', { length: 500 }),
  notes:        text('notes'),
  deletedAt:    timestamp('deleted_at'),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
  updatedAt:    timestamp('updated_at').notNull().defaultNow(),
})

// ─── 직접 입력 가족 ──────────────────────────────────────
export const familyMembers = pgTable('family_members', {
  id:        uuid('id').defaultRandom().primaryKey(),
  memberId:  uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  name:      varchar('name', { length: 100 }).notNull(),
  relation:  varchar('relation', { length: 50 }).notNull(),
  phone:     varchar('phone', { length: 20 }),
  notes:     text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── 성도 간 가족 관계 ───────────────────────────────────
export const memberRelations = pgTable('member_relations', {
  id:           uuid('id').defaultRandom().primaryKey(),
  memberIdA:    uuid('member_id_a').notNull().references(() => members.id, { onDelete: 'cascade' }),
  memberIdB:    uuid('member_id_b').notNull().references(() => members.id, { onDelete: 'cascade' }),
  relationType: varchar('relation_type', { length: 50 }).notNull(), // spouse | parent | child | sibling
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

// ─── 목장 ───────────────────────────────────────────────
export const cellGroups = pgTable('cell_groups', {
  id:        uuid('id').defaultRandom().primaryKey(),
  name:      varchar('name', { length: 100 }).notNull(),
  leaderId:  uuid('leader_id').references(() => members.id),
  isActive:  boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── 목장 이동 이력 ──────────────────────────────────────
export const cellGroupHistory = pgTable('cell_group_history', {
  id:          uuid('id').defaultRandom().primaryKey(),
  memberId:    uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  cellGroupId: uuid('cell_group_id').notNull().references(() => cellGroups.id),
  joinedAt:    date('joined_at').notNull(),
  leftAt:      date('left_at'),
})

// ─── 예배 종류 ───────────────────────────────────────────
export const services = pgTable('services', {
  id:          uuid('id').defaultRandom().primaryKey(),
  name:        varchar('name', { length: 100 }).notNull(),
  dayOfWeek:   integer('day_of_week'),   // 0=일, 1=월 ... 6=토
  time:        varchar('time', { length: 10 }),
  isActive:    boolean('is_active').notNull().default(true),
  sortOrder:   integer('sort_order').notNull().default(0),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

// ─── 성경공부 모임 (목장 귀속) ────────────────────────────
export const bibleStudyGroups = pgTable('bible_study_groups', {
  id:          uuid('id').defaultRandom().primaryKey(),
  cellGroupId: uuid('cell_group_id').notNull().references(() => cellGroups.id, { onDelete: 'cascade' }),
  name:        varchar('name', { length: 100 }).notNull(),
  dayOfWeek:   integer('day_of_week'),
  leaderId:    uuid('leader_id').references(() => members.id),
  isActive:    boolean('is_active').notNull().default(true),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

// ─── 예배 출석 ───────────────────────────────────────────
export const attendanceRecords = pgTable('attendance_records', {
  id:        uuid('id').defaultRandom().primaryKey(),
  memberId:  uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  date:      date('date').notNull(),
  attended:  boolean('attended').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [unique().on(t.memberId, t.serviceId, t.date)])

// ─── 성경공부 참석 ───────────────────────────────────────
export const bibleStudyRecords = pgTable('bible_study_records', {
  id:        uuid('id').defaultRandom().primaryKey(),
  memberId:  uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  groupId:   uuid('group_id').notNull().references(() => bibleStudyGroups.id),
  date:      date('date').notNull(),
  attended:  boolean('attended').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [unique().on(t.memberId, t.groupId, t.date)])

// ─── 목장모임 ────────────────────────────────────────────
export const cellMeetings = pgTable('cell_meetings', {
  id:          uuid('id').defaultRandom().primaryKey(),
  cellGroupId: uuid('cell_group_id').notNull().references(() => cellGroups.id, { onDelete: 'cascade' }),
  date:        date('date').notNull(),
  notes:       text('notes'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

// ─── 목장모임 출석 ───────────────────────────────────────
export const cellMeetingRecords = pgTable('cell_meeting_records', {
  id:            uuid('id').defaultRandom().primaryKey(),
  cellMeetingId: uuid('cell_meeting_id').notNull().references(() => cellMeetings.id, { onDelete: 'cascade' }),
  memberId:      uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  attended:      boolean('attended').notNull().default(false),
}, (t) => [unique().on(t.cellMeetingId, t.memberId)])

// ─── 헌금 종류 (기본: 십일조·주일헌금·감사헌금·선교헌금) ──
export const offeringTypes = pgTable('offering_types', {
  id:        uuid('id').defaultRandom().primaryKey(),
  name:      varchar('name', { length: 100 }).notNull(),
  isActive:  boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── 헌금 내역 ───────────────────────────────────────────
export const offeringRecords = pgTable('offering_records', {
  id:             uuid('id').defaultRandom().primaryKey(),
  memberId:       uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  offeringTypeId: uuid('offering_type_id').notNull().references(() => offeringTypes.id),
  date:           date('date').notNull(),
  amount:         integer('amount').notNull(),  // 원화, 소수점 없음
  notes:          text('notes'),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
})

// ─── 기도제목 ────────────────────────────────────────────
export const prayerRequests = pgTable('prayer_requests', {
  id:            uuid('id').defaultRandom().primaryKey(),
  memberId:      uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  title:         varchar('title', { length: 200 }).notNull(),
  content:       text('content'),
  isAnswered:    boolean('is_answered').notNull().default(false),
  answeredAt:    timestamp('answered_at'),
  answerComment: text('answer_comment'),
  createdAt:     timestamp('created_at').notNull().defaultNow(),
  updatedAt:     timestamp('updated_at').notNull().defaultNow(),
})

// ─── 심방 기록 ───────────────────────────────────────────
export const pastoralVisits = pgTable('pastoral_visits', {
  id:        uuid('id').defaultRandom().primaryKey(),
  memberId:  uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  visitorId: uuid('visitor_id').references(() => users.id),
  visitedAt: date('visited_at').notNull(),
  content:   text('content'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── VIP 전도대상 ─────────────────────────────────────────
export const vipList = pgTable('vip_list', {
  id:        uuid('id').defaultRandom().primaryKey(),
  memberId:  uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  vipName:   varchar('vip_name', { length: 100 }).notNull(),
  relation:  varchar('relation', { length: 50 }),
  phone:     varchar('phone', { length: 20 }),
  status:    varchar('status', { length: 20 }).notNull().default('praying'), // praying | contacted | evangelizing | registered
  notes:     text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── 공지사항 ────────────────────────────────────────────
export const announcements = pgTable('announcements', {
  id:          uuid('id').defaultRandom().primaryKey(),
  title:       varchar('title', { length: 200 }).notNull(),
  content:     text('content').notNull(),
  authorId:    uuid('author_id').references(() => users.id),
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at'),
  expiresAt:   timestamp('expires_at'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
})
