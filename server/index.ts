import "dotenv/config"
import express from "express"
import cors from "cors"
import tasksRouter from "./routes/tasks"

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/tasks", tasksRouter)

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
