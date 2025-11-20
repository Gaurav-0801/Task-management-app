const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export interface Task {
  id: number
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`)
  if (!response.ok) throw new Error("Failed to fetch tasks")
  return response.json()
}

export const fetchTask = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`)
  if (!response.ok) throw new Error("Failed to fetch task")
  return response.json()
}

export const createTask = async (data: {
  title: string
  description?: string
  priority?: "low" | "medium" | "high"
}): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create task")
  return response.json()
}

export const updateTask = async (
  id: number,
  data: {
    title?: string
    description?: string
    status?: "pending" | "in-progress" | "completed"
    priority?: "low" | "medium" | "high"
  },
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update task")
  return response.json()
}

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete task")
}
