"use client"

import { useState } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Task Manager</h1>
          <p className="text-muted-foreground">Organize and track your tasks efficiently</p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form section */}
          <div className="lg:col-span-1">
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>

          {/* Tasks list section */}
          <div className="lg:col-span-2">
            <TaskList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </main>
  )
}
