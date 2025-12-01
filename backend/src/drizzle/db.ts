import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema-multi-level.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://saas_user:saas_password@postgres:5432/saas_test';
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });