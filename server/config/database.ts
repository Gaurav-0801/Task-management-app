import { neon, sql as neonSql } from "@neondatabase/serverless"

type SqlClient = {
  query: (query: string, params?: any[]) => Promise<Record<string, any>[]>
}

type TaskRecord = {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  created_at: string
  updated_at: string
}

class InMemorySqlClient implements SqlClient {
  private tasks: TaskRecord[] = []
  private nextId = 1

  private cloneTasks() {
    return this.tasks.map((task) => ({ ...task }))
  }

  async query(query: string, params: any[] = []): Promise<Record<string, any>[]> {
    const normalized = query.trim().replace(/\s+/g, " ").toUpperCase()

    if (normalized.startsWith("SELECT * FROM TASKS ORDER BY")) {
      return this.cloneTasks().sort((a, b) => b.created_at.localeCompare(a.created_at))
    }

    if (normalized.startsWith("SELECT * FROM TASKS WHERE ID = $1")) {
      const id = Number(params[0])
      return this.cloneTasks().filter((task) => task.id === id)
    }

    if (normalized.startsWith("INSERT INTO TASKS")) {
      const [title, description, priority] = params
      const now = new Date().toISOString()
      const task: TaskRecord = {
        id: this.nextId++,
        title,
        description: description ?? null,
        priority: priority ?? "medium",
        status: "pending",
        created_at: now,
        updated_at: now,
      }
      this.tasks = [task, ...this.tasks]
      return [task]
    }

    if (normalized.startsWith("UPDATE TASKS SET")) {
      const id = Number(params[params.length - 1])
      const task = this.tasks.find((t) => t.id === id)
      if (!task) return []

      const setClause = query.slice(query.toUpperCase().indexOf("SET") + 3, query.toUpperCase().indexOf("WHERE")).trim()
      const assignments = setClause.split(",").map((assignment) => assignment.trim())

      assignments.forEach((assignment) => {
        const paramMatch = assignment.match(/^([a-z_]+)\s*=\s*\$(\d+)/i)

        if (paramMatch) {
          const [, column, paramIndex] = paramMatch
          const value = params[Number(paramIndex) - 1]
          ;(task as Record<string, any>)[column.toLowerCase()] = value
        } else if (/updated_at\s*=\s*current_timestamp/i.test(assignment)) {
          task.updated_at = new Date().toISOString()
        }
      })

      return [task]
    }

    if (normalized.startsWith("DELETE FROM TASKS WHERE ID = $1")) {
      const id = Number(params[0])
      const index = this.tasks.findIndex((task) => task.id === id)
      if (index === -1) return []

      const [deleted] = this.tasks.splice(index, 1)
      return [{ ...deleted }]
    }

    throw new Error(`Unsupported in-memory query: ${query}`)
  }
}

// Wrapper for Neon client to match SqlClient interface
const createNeonClient = (connectionString: string): SqlClient => {
  const client = neon(connectionString)
  
  return {
    query: async (queryString: string, params: any[] = []): Promise<Record<string, any>[]> => {
      try {
        // Neon client uses template literals, so we need to convert our parameterized query
        // We'll replace $1, $2, etc. with actual values in the query string
        // This is a simplified approach - for production, consider using a query builder
        
        let processedQuery = queryString
        if (params && params.length > 0) {
          // Replace $1, $2, etc. with the actual parameter values
          // Escape single quotes in string values
          params.forEach((param, index) => {
            const placeholder = `$${index + 1}`
            let value: string
            if (param === null || param === undefined) {
              value = 'NULL'
            } else if (typeof param === 'string') {
              // Escape single quotes and wrap in quotes
              value = `'${param.replace(/'/g, "''")}'`
            } else if (typeof param === 'number' || typeof param === 'boolean') {
              value = String(param)
            } else {
              value = `'${JSON.stringify(param).replace(/'/g, "''")}'`
            }
            // Replace $1, $2, etc. (but not $10, $11, etc. when we're replacing $1)
            const regex = new RegExp(`\\$${index + 1}(?![0-9])`, 'g')
            processedQuery = processedQuery.replace(regex, value)
          })
        }
        
        // Execute the query - Neon client supports being called as a function
        // We'll use the client directly with the processed query
        // Type assertion needed because TypeScript types expect template literals
        const result = await (client as any)(processedQuery)
        
        // Neon returns an array of rows directly
        if (Array.isArray(result)) {
          return result
        }
        // Fallback: if result is an object with rows property
        if (result && typeof result === 'object' && 'rows' in result) {
          return (result as any).rows || []
        }
        // If result is a single object, wrap it in an array
        if (result && typeof result === 'object') {
          return [result]
        }
        return []
      } catch (error: any) {
        console.error("Database query error:", error?.message || error)
        // Re-throw with more context
        throw new Error(`Database error: ${error?.message || String(error)}`)
      }
    }
  }
}

const sql: SqlClient = process.env.DATABASE_URL
  ? createNeonClient(process.env.DATABASE_URL)
  : new InMemorySqlClient()

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Using in-memory data store for development.")
} else {
  console.log("Using Neon database connection")
}

export default sql
