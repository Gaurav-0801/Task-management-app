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
import * as fs from "fs"
import * as path from "path"

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
    // Read the SQL initialization file
    const sqlPath = path.join(__dirname, "init-db.sql")
    const sqlContent = fs.readFileSync(sqlPath, "utf-8")
    
    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql(statement)
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`)
        } catch (error: any) {
          // Ignore "already exists" errors
          if (error?.message?.includes("already exists") || error?.message?.includes("duplicate")) {
            console.log(`ℹ️  Skipped (already exists): ${statement.substring(0, 50)}...`)
          } else {
            throw error
          }
        }
      }
    }

    // Verify table was created
    const result = await sql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks'")
    
    if (Array.isArray(result) && result.length > 0) {
      console.log("✅ Tasks table verified successfully!")
    } else if (result && typeof result === 'object' && 'rows' in result && (result as any).rows?.length > 0) {
      console.log("✅ Tasks table verified successfully!")
    } else {
      console.log("⚠️  Warning: Could not verify tasks table creation")
    }

    console.log("🎉 Database initialization complete!")
  } catch (error: any) {
    console.error("❌ Error initializing database:", error.message)
    console.error(error)
    process.exit(1)
  }
}

initDatabase()

