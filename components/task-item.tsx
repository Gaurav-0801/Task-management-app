"use client"

import { useState } from "react"
import { type Task, updateTask, deleteTask } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskItemProps {
  task: Task
  onTaskUpdated: () => void
}

export function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(task.status)
  const [priority, setPriority] = useState(task.priority)
  const [loading, setLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await updateTask(task.id, { status, priority })
      onTaskUpdated()
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to update task:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteTask(task.id)
      onTaskUpdated()
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error("Failed to delete task:", err)
    } finally {
      setLoading(false)
    }
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }

  const statusColors = {
    pending: "text-muted-foreground",
    "in-progress": "text-blue-600 dark:text-blue-400",
    completed: "text-green-600 dark:text-green-400 line-through",
  }

  return (
    <Card className="p-4 bg-card border border-border">
      <div className="space-y-3">
        <div>
          <h3 className={`text-lg font-semibold ${statusColors[task.status]}`}>{task.title}</h3>
          {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
          <span className="text-xs text-muted-foreground">{new Date(task.created_at).toLocaleDateString()}</span>
        </div>

        {isEditing ? (
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="px-2 py-1 border border-input rounded text-sm bg-background text-foreground"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="px-2 py-1 border border-input rounded text-sm bg-background text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="flex-1"
            >
              Edit
            </Button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  className="flex-1 text-destructive hover:text-destructive bg-transparent"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action permanently removes `{task.title}`. You can&apos;t undo this.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={loading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </Card>
  )
}
