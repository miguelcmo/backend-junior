import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

// -------- AUTH SIMPLE --------

const PASSWORD = "bootcamp123"
const TOKEN = "react-students-token"

function authMiddleware(req, res, next) {

    const token = req.headers.authorization

    if (token === `Bearer ${TOKEN}`) {
        next()
    } else {
        res.status(401).json({ error: "Unauthorized" })
    }

}

// -------- LOGIN --------

app.post("/login", (req, res) => {

    const { password } = req.body

    if (password === PASSWORD) {
        return res.json({
            token: TOKEN,
            message: "Login successful"
        })
    }

    res.status(401).json({ error: "Invalid password" })

})


// -------- DUMMY DATA --------

const tasks = [

    {
        id: 1,
        title: "Build React Components",
        description: "Create reusable UI components using JSX and props",
        status: "in-progress",
        priority: "high",
        emoji: "⚛️"
    },

    {
        id: 2,
        title: "Deploy API to Vercel",
        description: "Create serverless endpoints and connect them to React",
        status: "todo",
        priority: "medium",
        emoji: "🚀"
    },

    {
        id: 3,
        title: "Learn useEffect",
        description: "Fetch data from an external API when the component loads",
        status: "todo",
        priority: "high",
        emoji: "🧠"
    },

    {
        id: 4,
        title: "Style the App",
        description: "Create a beautiful UI with responsive cards",
        status: "done",
        priority: "low",
        emoji: "🎨"
    },

    {
        id: 5,
        title: "Add Fake Data Generator",
        description: "Use Faker to generate tasks dynamically",
        status: "todo",
        priority: "medium",
        emoji: "🤖"
    },
    {
        id: 6,
        title: "Setup Database",
        description: "Configure MongoDB and create schemas",
        status: "todo",
        priority: "high",
        emoji: "🗄️"
    },
    {
        id: 7,
        title: "Write Unit Tests",
        description: "Create tests for API endpoints",
        status: "todo",
        priority: "medium",
        emoji: "🧪"
    },
    {
        id: 8,
        title: "Implement Pagination",
        description: "Add pagination to task list endpoints",
        status: "in-progress",
        priority: "medium",
        emoji: "📄"
    },
    {
        id: 9,
        title: "Add Error Handling",
        description: "Implement comprehensive error handling with proper status codes",
        status: "in-progress",
        priority: "high",
        emoji: "⚠️"
    },
    {
        id: 10,
        title: "Create Documentation",
        description: "Write API documentation with examples",
        status: "todo",
        priority: "low",
        emoji: "📚"
    },
    {
        id: 11,
        title: "Optimize Queries",
        description: "Add indexing and optimize database queries",
        status: "todo",
        priority: "medium",
        emoji: "⚡"
    },
    {
        id: 12,
        title: "Setup CI/CD Pipeline",
        description: "Configure GitHub Actions for automated testing and deployment",
        status: "todo",
        priority: "high",
        emoji: "🔄"
    },
    {
        id: 13,
        title: "Add Authentication Refresh",
        description: "Implement token refresh mechanism",
        status: "todo",
        priority: "medium",
        emoji: "🔐"
    },
    {
        id: 14,
        title: "Performance Monitoring",
        description: "Setup APM tools to monitor API performance",
        status: "todo",
        priority: "low",
        emoji: "📊"
    },
    {
        id: 15,
        title: "Security Audit",
        description: "Perform security review and fix vulnerabilities",
        status: "done",
        priority: "high",
        emoji: "🛡️"
    }
]


// -------- ENDPOINTS --------

// health check
app.get("/", (req, res) => {
    res.json({ message: "Task API running ⚡" })
})


// get tasks
app.get("/tasks", authMiddleware, (req, res) => {
    res.json(tasks)
})


// get task by id
app.get("/tasks/:id", authMiddleware, (req, res) => {

    const task = tasks.find(t => t.id == req.params.id)

    if (!task) {
        return res.status(404).json({ error: "Task not found" })
    }

    res.json(task)

})

export default app