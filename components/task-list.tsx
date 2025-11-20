"use client"

import { useEffect, useState, useCallback } from "react"
import { type Task, fetchTasks } from "@/lib/api"
import { TaskItem } from "./task-item"
import { Card } from "@/components/ui/card"

interface TaskListProps {
  refreshTrigger?: number
}

export function TaskList({ refreshTrigger = 0 }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | Task["status"]>("all")

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTasks()
      setTasks(data)
      setError("")
    } catch (err) {
      setError("Failed to load tasks")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks, refreshTrigger])

  const filteredTasks = filterStatus === "all" ? tasks : tasks.filter((t) => t.status === filterStatus)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Tasks</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-3 py-1 border border-input rounded-md bg-background text-foreground text-sm"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>}

      {loading && <Card className="p-8 text-center text-muted-foreground bg-card">Loading tasks...</Card>}

      {!loading && filteredTasks.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground bg-card">
          {filterStatus === "all" ? "No tasks yet. Create one to get started!" : `No ${filterStatus} tasks.`}
        </Card>
      )}

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} onTaskUpdated={loadTasks} />
        ))}
      </div>
    </div>
  )
}
