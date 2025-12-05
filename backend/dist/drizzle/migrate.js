import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema-multi-level.js';
import dotenv from 'dotenv';
dotenv.config();
const connectionString = process.env.DATABASE_URL || 'postgresql://saas_user:saas_password@localhost:5432/saas_test';
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });
async function migrate() {
    try {
        console.log('🚀 Creando tablas multi-nivel...');
        await client `
      CREATE TABLE IF NOT EXISTS owners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
        await client `
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
    `;
        await client `
      CREATE TABLE IF NOT EXISTS admin_bars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
        await client `
      CREATE TABLE IF NOT EXISTS departments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
        await client `
      CREATE TABLE IF NOT EXISTS staff (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        department_id UUID REFERENCES departments(id),
        business_id UUID REFERENCES businesses(id),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'employee',
        pin VARCHAR(10),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
        await client `
      CREATE TABLE IF NOT EXISTS tables (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id),
        number INTEGER NOT NULL,
        qr_code_url TEXT,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
        await client `
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
    `;
        await client `
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
    `;
        console.log('✅ Tablas multi-nivel creadas exitosamente');
    }
    catch (error) {
        console.error('❌ Error en migración:', error);
        throw error;
    }
    finally {
        await client.end();
    }
}
migrate().then(() => {
    console.log('✅ Migración finalizada');
    process.exit(0);
}).catch((err) => {
    console.error('❌ Error en migración:', err);
    process.exit(1);
});
