const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cookieSession = require("cookie-session");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
const UPLOADS = path.join(ROOT, "uploads");

fs.mkdirSync(UPLOADS, { recursive: true });

const db = new Database(path.join(ROOT, "sir_mahee.db"));

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  class_name TEXT,
  subject TEXT,
  chapter TEXT,
  description TEXT,
  type TEXT,
  filename TEXT,
  stored_name TEXT,
  mime TEXT,
  size INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

/* =========================
   ADMIN ACCOUNT
========================= */

const adminEmail =
  process.env.ADMIN_EMAIL || "admin@sir.mahee.com";

const adminPassword =
  process.env.ADMIN_PASSWORD || "change-this-password";

const existingAdmin = db
  .prepare("SELECT id FROM users WHERE email = ?")
  .get(adminEmail);

if (!existingAdmin) {
  const hash = bcrypt.hashSync(adminPassword, 12);

  db.prepare(`
    INSERT INTO users (email, password_hash)
    VALUES (?, ?)
  `).run(adminEmail, hash);
} else {
  const hash = bcrypt.hashSync(adminPassword, 12);

  db.prepare(`
    UPDATE users
    SET password_hash = ?
    WHERE email = ?
  `).run(hash, adminEmail);
}

/* =========================
   MIDDLEWARE
========================= */

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "sir_mahee_session",
    keys: [
      process.env.SESSION_SECRET || "change-this-session-secret"
    ],
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
);

app.use("/uploads", express.static(UPLOADS));
app.use(express.static(PUBLIC));

/* =========================
   AUTH MIDDLEWARE
========================= */

function auth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }

  return res.status(401).json({
    error: "Login required"
  });
}

/* =========================
   FILE UPLOAD
========================= */

const maxMB = Number(process.env.MAX_FILE_MB || 20);

const storage = multer.diskStorage({
  destination: UPLOADS,

  filename: (req, file, cb) => {
    const safeName =
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 10) +
      "-" +
      file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");

    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxMB * 1024 * 1024
  }
});

/* =========================
   LOGIN
========================= */

app.post("/api/login", (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        error: "Email और Password दोनों भरें"
      });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (!user) {
      return res.status(401).json({
        error: "Email या Password गलत है"
      });
    }

    const valid = bcrypt.compareSync(
      password,
      user.password_hash
    );

    if (!valid) {
      return res.status(401).json({
        error: "Email या Password गलत है"
      });
    }

    req.session.userId = user.id;
    req.session.userEmail = user.email;

    return res.json({
      ok: true
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      error: "Server login error"
    });
  }
});

/* =========================
   LOGOUT
========================= */

app.post("/api/logout", (req, res) => {
  req.session = null;

  res.json({
    ok: true
  });
});

/* =========================
   CURRENT USER
========================= */

app.get("/api/me", (req, res) => {
  res.json({
    loggedIn: !!(req.session && req.session.userId),
    email: req.session?.userEmail || null
  });
});

/* =========================
   GET MATERIALS
========================= */

app.get("/api/materials", (req, res) => {
  try {
    const className = String(req.query.className || "").trim();
    const subject = String(req.query.subject || "").trim();
    const q = String(req.query.q || "").trim();

    let sql = "SELECT * FROM materials WHERE 1=1";
    const args = [];

    if (className) {
      sql += " AND class_name = ?";
      args.push(className);
    }

    if (subject) {
      sql += " AND subject = ?";
      args.push(subject);
    }

    if (q) {
      sql += `
        AND (
          title LIKE ?
          OR chapter LIKE ?
          OR description LIKE ?
        )
      `;

      const search = `%${q}%`;

      args.push(search, search, search);
    }

    sql += " ORDER BY id DESC";

    const rows = db.prepare(sql).all(...args);

    res.json(rows);

  } catch (err) {
    console.error("MATERIAL LIST ERROR:", err);

    res.status(500).json({
      error: "Materials load failed"
    });
  }
});

/* =========================
   UPLOAD MATERIAL
========================= */

app.post(
  "/api/materials",
  auth,
  upload.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "File is required"
        });
      }

      const body = req.body;

      const result = db.prepare(`
        INSERT INTO materials
        (
          title,
          class_name,
          subject,
          chapter,
          description,
          type,
          filename,
          stored_name,
          mime,
          size
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        body.title || "Untitled",
        body.className || "All Classes",
        body.subject || "Other",
        body.chapter || "",
        body.description || "",
        body.type || "Other",
        req.file.originalname,
        req.file.filename,
        req.file.mimetype,
        req.file.size
      );

      res.json({
        ok: true,
        id: result.lastInsertRowid
      });

    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      res.status(500).json({
        error: "Upload failed"
      });
    }
  }
);

/* =========================
   DELETE MATERIAL
========================= */

app.delete(
  "/api/materials/:id",
  auth,
  (req, res) => {
    try {
      const id = Number(req.params.id);

      const material = db
        .prepare("SELECT * FROM materials WHERE id = ?")
        .get(id);

      if (!material) {
        return res.status(404).json({
          error: "Material not found"
        });
      }

      if (material.stored_name) {
        const filePath = path.join(
          UPLOADS,
          material.stored_name
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      db.prepare(
        "DELETE FROM materials WHERE id = ?"
      ).run(id);

      res.json({
        ok: true
      });

    } catch (err) {
      console.error("DELETE ERROR:", err);

      res.status(500).json({
        error: "Delete failed"
      });
    }
  }
);

/* =========================
   ADMIN PAGE
========================= */

app.get("/admin", (req, res) => {
  res.sendFile(
    path.join(PUBLIC, "admin.html")
  );
});

/* =========================
   MAIN WEBSITE
========================= */

app.get("*", (req, res) => {
  res.sendFile(
    path.join(PUBLIC, "index.html")
  );
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Sir Mahee server running on port ${PORT}`
  );
});
