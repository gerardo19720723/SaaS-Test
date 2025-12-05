"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("../drizzle/db.js"); // única instancia centralizada
const schema = __importStar(require("../drizzle/schema-multi-level.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
async function migrateMultiLevel() {
    try {
        console.log('🚀 Creando tablas multi-nivel...');
        /* ---------- owners ---------- */
        await db_js_1.db.execute(`
      CREATE TABLE IF NOT EXISTS owners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        /* ---------- businesses ---------- */
        await db_js_1.db.execute(`
      CREATE TABLE IF NOT EXISTS businesses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id UUID REFERENCES owners(id),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        subscription_plan VARCHAR(50) DEFAULT 'basic',
        subscription_status VARCHAR(50) DEFAULT 'active',
        max_tables INTEGER DEFAULT 20,
        max_staff INTEGER DEFAULT 10,
        max_events INTEGER DEFAULT 30,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        /* ---------- admin_bars ---------- */
        await db_js_1.db.execute(`
      CREATE TABLE IF NOT EXISTS admin_bars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        /* ---------- departments ---------- */
        await db_js_1.db.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        /* ---------- staff ---------- */
        await db_js_1.db.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        department_id UUID REFERENCES departments(id),
        business_id UUID REFERENCES businesses(id),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'employee',
        pin VARCHAR(10),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        /* ---------- tables ---------- */
        await db_js_1.db.execute(`
      CREATE TABLE IF NOT EXISTS tables (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id),
        number INTEGER NOT NULL,
        qr_code_url TEXT,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        /* ---------- loyalty_levels ---------- */
        await db_js_1.db.execute(`
      CREATE TABLE IF NOT EXISTS loyalty_levels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id),
        name VARCHAR(50) NOT NULL,
        min_points INTEGER NOT NULL,
        max_points INTEGER NOT NULL,
        discount_percentage NUMERIC(5,2) NOT NULL,
        benefits TEXT,
        color VARCHAR(7),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        /* ---------- customers ---------- */
        await db_js_1.db.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id),
        loyalty_level_id UUID REFERENCES loyalty_levels(id),
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        name VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 0,
        total_spent NUMERIC(12,2) DEFAULT 0,
        visit_count INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        /* ---------- inserts mínimos ---------- */
        await db_js_1.db.insert(schema.owners).values({
            email: 'system@localhost',
            password: await bcrypt_1.default.hash('system', 12),
            name: 'Sistema',
            status: 'active',
        });
        await db_js_1.db.insert(schema.businesses).values({
            ownerId: '00000000-0000-0000-0000-000000000000',
            name: 'Sistema',
            type: 'system',
            status: 'active',
            subscriptionPlan: 'enterprise',
            maxTables: 999,
            maxStaff: 999,
            maxEvents: 999,
        });
        await db_js_1.db.insert(schema.loyaltyLevels).values([
            {
                businessId: 'ae387908-8e35-4103-ba3c-9a2fe3fcd816',
                name: 'bronze',
                minPoints: 0,
                maxPoints: 999,
                discountPercentage: '5.00',
                benefits: '["5% descuento", "Acceso eventos generales"]',
                color: '#CD7F32'
            },
            {
                businessId: 'ae387908-8e35-4103-ba3c-9a2fe3fcd816',
                name: 'silver',
                minPoints: 1000,
                maxPoints: 4999,
                discountPercentage: '10.00',
                benefits: '["10% descuento", "Eventos especiales", "Acceso prioritario"]',
                color: '#C0C0C0'
            },
            {
                businessId: 'ae387908-8e35-4103-ba3c-9a2fe3fcd816',
                name: 'gold',
                minPoints: 5000,
                maxPoints: 999999,
                discountPercentage: '15.00',
                benefits: '["15% descuento", "Eventos VIP", "Pre-ventas exclusivas", "Menciones especiales"]',
                color: '#FFD700'
            }
        ]);
        console.log('✅ Tablas multi-nivel creadas exitosamente');
        console.log('✅ Niveles de fidelidad creados');
    }
    catch (error) {
        console.error('❌ Error en migración multi-nivel:', error);
        throw error;
    }
}
migrateMultiLevel();
