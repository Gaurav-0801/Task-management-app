import * as api from "@/lib/api"
import { jest } from "@jest/globals"

// Mock fetch
global.fetch = jest.fn()

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("fetchTasks", () => {
    it("should fetch all tasks", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Test Task",
          status: "pending" as const,
          priority: "high" as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      })

      const tasks = await api.fetchTasks()
      expect(tasks).toEqual(mockTasks)
    })

    it("should throw error on failed response", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      })

      await expect(api.fetchTasks()).rejects.toThrow("Failed to fetch tasks")
    })
  })

  describe("createTask", () => {
    it("should create a new task", async () => {
      const mockTask = {
        id: 1,
        title: "New Task",
        status: "pending" as const,
        priority: "medium" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTask,
      })

      const task = await api.createTask({ title: "New Task" })
      expect(task).toEqual(mockTask)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks"),
        expect.objectContaining({ method: "POST" }),
      )
    })
  })

  describe("updateTask", () => {
    it("should update an existing task", async () => {
      const mockTask = {
        id: 1,
        title: "Updated Task",
        status: "completed" as const,
        priority: "high" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTask,
      })

      const task = await api.updateTask(1, { status: "completed" })
      expect(task).toEqual(mockTask)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks/1"),
        expect.objectContaining({ method: "PUT" }),
      )
    })
  })

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      await api.deleteTask(1)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks/1"),
        expect.objectContaining({ method: "DELETE" }),
      )
    })
  })
})
