"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customers = exports.loyaltyLevels = exports.tables = exports.staff = exports.departments = exports.adminBars = exports.businesses = exports.owners = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.owners = (0, pg_core_1.pgTable)('owners', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('active'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.businesses = (0, pg_core_1.pgTable)('businesses', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    ownerId: (0, pg_core_1.uuid)('owner_id').references(() => exports.owners.id),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    address: (0, pg_core_1.text)('address'),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('active'),
    subscriptionPlan: (0, pg_core_1.varchar)('subscription_plan', { length: 50 }).default('basic'),
    subscriptionStatus: (0, pg_core_1.varchar)('subscription_status', { length: 50 }).default('active'),
    maxTables: (0, pg_core_1.integer)('max_tables').default(20),
    maxStaff: (0, pg_core_1.integer)('max_staff').default(10),
    maxEvents: (0, pg_core_1.integer)('max_events').default(30),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.adminBars = (0, pg_core_1.pgTable)('admin_bars', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    businessId: (0, pg_core_1.uuid)('business_id').references(() => exports.businesses.id),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('active'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.departments = (0, pg_core_1.pgTable)('departments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    businessId: (0, pg_core_1.uuid)('business_id').references(() => exports.businesses.id),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.staff = (0, pg_core_1.pgTable)('staff', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id),
    businessId: (0, pg_core_1.uuid)('business_id').references(() => exports.businesses.id),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)('role', { length: 50 }).default('employee'),
    pin: (0, pg_core_1.varchar)('pin', { length: 10 }),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('active'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.tables = (0, pg_core_1.pgTable)('tables', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    businessId: (0, pg_core_1.uuid)('business_id').references(() => exports.businesses.id),
    number: (0, pg_core_1.integer)('number').notNull(),
    qrCodeUrl: (0, pg_core_1.text)('qr_code_url'),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('available'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.loyaltyLevels = (0, pg_core_1.pgTable)("loyalty_levels", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    businessId: (0, pg_core_1.uuid)("business_id").references(() => exports.businesses.id),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    minPoints: (0, pg_core_1.integer)("min_points").default(0).notNull(),
    maxPoints: (0, pg_core_1.integer)("max_points").default(0).notNull(),
    discountPercentage: (0, pg_core_1.varchar)("discount_percentage", { length: 10 }),
    benefits: (0, pg_core_1.varchar)("benefits", { length: 255 }),
    color: (0, pg_core_1.varchar)("color", { length: 50 }),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.customers = (0, pg_core_1.pgTable)("customers", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    // Relación con negocio
    businessId: (0, pg_core_1.uuid)("business_id").references(() => exports.businesses.id),
    // Relación con niveles de lealtad (puede ser opcional)
    loyaltyLevelId: (0, pg_core_1.uuid)("loyalty_level_id").references(() => exports.loyaltyLevels.id),
    // Datos básicos
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    // Métricas del cliente
    points: (0, pg_core_1.integer)("points").default(0).notNull(),
    totalSpent: (0, pg_core_1.integer)("total_spent").default(0).notNull(),
    visitCount: (0, pg_core_1.integer)("visit_count").default(0).notNull(),
    // Estado
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("active"),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
