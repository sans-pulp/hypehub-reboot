import { boolean, integer, json, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const AttributeTypes = {
    STRENGTH: 'strength',
    VITALITY: 'vitality',
    KNOWLEDGE: 'knowledge',
    SOCIAL: 'social',
    WILLPOWER: 'willpower',
}

export type AttributeType = typeof AttributeTypes[keyof typeof AttributeTypes]

export type AttributeReward = {
    type: AttributeType,
    points: number
}

export const profilesTable = pgTable('profiles', {
    id: serial('id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    userEmail: text('user_email').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
})

export const goalsTable = pgTable('goals', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    type: text('type').notNull(),
    isComplete: boolean('is_complete').notNull().default(false),
    attributeRewards: json('attribute_rewards').$type<AttributeReward[]>().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    attributes: text('attributes').array(),
    profileId: integer('profile_id').references(() => profilesTable.id),
    targetDate: timestamp('target_date'),
    completedAt: timestamp('completed_at'),
})

export const attributesTable = pgTable('attributes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    profileId: integer('profile_id').references(() => profilesTable.id).notNull().unique(), //one-to-one,
    strength: integer('strength').notNull().default(0),
    vitality: integer('vitality').notNull().default(0),
    knowledge: integer('knowledge').notNull().default(0),
    social: integer('social').notNull().default(0),
    willpower: integer('willpower').notNull().default(0),
    experience: integer('experience').notNull().default(0),
    level: integer('level').notNull().default(1),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
})

// Insert and Select types for database operations
export type InsertGoal = typeof goalsTable.$inferInsert
export type SelectGoal = typeof goalsTable.$inferSelect

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect

export type InsertAttribute = typeof attributesTable.$inferInsert
export type SelectAttribute = typeof attributesTable.$inferSelect

// Export more descriptive type aliases for use in components and business logic
export type Goal = SelectGoal
export type Profile = SelectProfile
export type Attribute = SelectAttribute
