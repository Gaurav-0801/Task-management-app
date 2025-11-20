#!/usr/bin/env ts-node
/**
 * Database initialization script for Neon PostgreSQL
 * Run this script to create the tasks table in your Neon database
 * 
 * Usage: npx ts-node scripts/init-neon-db.ts
 * Or: npm run db:init (if script is added to package.json)
 */

import "dotenv/config"
import { neon } from "@neondatabase/serverless"

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set")
    console.error("Please set DATABASE_URL in your .env file or environment variables")
    process.exit(1)
  }

  console.log("🔌 Connecting to Neon database...")
  const sql = neon<false, false>(databaseUrl)

  try {
    // Check if tasks table exists using template literal
    const checkTable = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'tasks'
    `
    
    const tableExists = Array.isArray(checkTable) && checkTable.length > 0

    if (tableExists) {
      console.log("✅ Tasks table already exists")
      return
    }

    console.log("📝 Creating tasks table...")

    // Create tasks table using template literal
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("📝 Creating indexes...")

    // Create indexes using template literals
    await sql`
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)
    `

    // Verify table was created
    const verifyResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'tasks'
    `
    
    if (Array.isArray(verifyResult) && verifyResult.length > 0) {
      console.log("✅ Tasks table verified successfully!")
    } else {
      console.log("⚠️  Warning: Could not verify tasks table creation")
    }

    console.log("🎉 Database initialization complete!")
  } catch (error: any) {
    console.error("❌ Error initializing database:", error?.message || error)
    console.error(error)
    process.exit(1)
  }
}

initDatabase()

