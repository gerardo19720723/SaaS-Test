import { pgTable, uuid, varchar, text, timestamp, integer, numeric, } from 'drizzle-orm/pg-core';

export const owners = pgTable('owners', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


export const businesses = pgTable('businesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => owners.id),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  status: varchar('status', { length: 50 }).default('active'),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }).default('basic'),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('active'),
  maxTables: integer('max_tables').default(20),
  maxStaff: integer('max_staff').default(10),
  maxEvents: integer('max_events').default(30),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const adminBars = pgTable('admin_bars', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const staff = pgTable('staff', {
  id: uuid('id').primaryKey().defaultRandom(),
  departmentId: uuid('department_id').references(() => departments.id),
  businessId: uuid('business_id').references(() => businesses.id),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('employee'),
  pin: varchar('pin', { length: 10 }),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tables = pgTable('tables', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id),
  number: integer('number').notNull(),
  qrCodeUrl: text('qr_code_url'),
  status: varchar('status', { length: 50 }).default('available'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const loyaltyLevels = pgTable("loyalty_levels", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id),
  name: varchar("name", { length: 100 }).notNull(),
  minPoints: integer("min_points").default(0).notNull(),
  maxPoints: integer("max_points").default(0).notNull(),
  discountPercentage: varchar("discount_percentage", { length: 10 }),
  benefits: varchar("benefits", { length: 255 }),
  color: varchar("color", { length: 50 }),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relación con negocio
  businessId: uuid("business_id").references(() => businesses.id),

  // Relación con niveles de lealtad (puede ser opcional)
  loyaltyLevelId: uuid("loyalty_level_id").references(() => loyaltyLevels.id),

  // Datos básicos
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  name: varchar("name", { length: 255 }).notNull(),

  // Métricas del cliente
  points: integer("points").default(0).notNull(),
  totalSpent: integer("total_spent").default(0).notNull(),
  visitCount: integer("visit_count").default(0).notNull(),

  // Estado
  status: varchar("status", { length: 50 }).default("active"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

