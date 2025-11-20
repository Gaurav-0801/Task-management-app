"use client"

import type React from "react"

import { useState } from "react"
import { createTask } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TaskFormProps {
  onTaskCreated: () => void
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setLoading(true)
    try {
      await createTask({ title, description, priority })
      setTitle("")
      setDescription("")
      setPriority("medium")
      onTaskCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Create New Task</h2>

        {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)..."
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </Card>
  )
}
