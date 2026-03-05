import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("database.db");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    role TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    questions TEXT NOT NULL, -- JSON string
    answers TEXT NOT NULL,   -- JSON string
    evaluations TEXT NOT NULL, -- JSON string
    totalScore REAL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

const app = express();
app.use(express.json());
app.use(cors());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, hashedPassword);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// --- Interview Routes ---

app.post("/api/interview/save", authenticateToken, (req: any, res) => {
  const { role, difficulty, questions, answers, evaluations, totalScore } = req.body;
  const userId = req.user.id;

  try {
    const stmt = db.prepare(`
      INSERT INTO interviews (userId, role, difficulty, questions, answers, evaluations, totalScore)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      userId,
      role,
      difficulty,
      JSON.stringify(questions),
      JSON.stringify(answers),
      JSON.stringify(evaluations),
      totalScore
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save interview" });
  }
});

app.get("/api/interview/history", authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const history = db.prepare("SELECT * FROM interviews WHERE userId = ? ORDER BY date DESC").all(userId);
  
  const formattedHistory = history.map((h: any) => ({
    ...h,
    questions: JSON.parse(h.questions),
    answers: JSON.parse(h.answers),
    evaluations: JSON.parse(h.evaluations)
  }));

  res.json(formattedHistory);
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
