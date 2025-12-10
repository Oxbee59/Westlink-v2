// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pkg from "pg";

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------- DATABASE ----------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// create tables if not exist
async function initTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      is_admin BOOLEAN DEFAULT false
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT,
      price NUMERIC,
      category TEXT,
      image TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS carts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      product_id INTEGER,
      quantity INTEGER
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      full_name TEXT,
      phone TEXT,
      delivery_address TEXT,
      products JSONB,
      total_price NUMERIC,
      status TEXT DEFAULT 'pending'
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS about_images (
      id SERIAL PRIMARY KEY,
      image TEXT
    );
  `);

  console.log("📌 PostgreSQL tables ready");
}
initTables();

// ---------- CORS ----------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://westlink-frontend.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ---------- FILE UPLOADS ----------
const uploadsDir = path.join(__dirname, "uploads");
const aboutUploadsDir = path.join(uploadsDir, "about");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(aboutUploadsDir)) fs.mkdirSync(aboutUploadsDir);

app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

const aboutStorage = multer.diskStorage({
  destination: aboutUploadsDir,
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const aboutUpload = multer({ storage: aboutStorage });

// ---------- AUTH ----------

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = bcrypt.hashSync(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id,name,email,is_admin",
      [name, email, hashed]
    );

    res.json({ message: "Registration successful", user: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Email already registered" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.is_admin },
      process.env.SECRET || "westlink_secret_key",
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        is_staff: user.is_admin,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PROFILE
app.get("/api/profile/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT id,name,email,is_admin FROM users WHERE id=$1",
    [req.params.id]
  );
  if (!result.rows.length) return res.status(404).json({ message: "User not found" });
  res.json(result.rows[0]);
});

// ---------- PRODUCTS ----------

// GET all products
app.get("/api/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  res.json(result.rows);
});

// ADD product
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const result = await pool.query(
      `INSERT INTO products (name, price, category, image)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, price, category, image]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE product
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const existing = await pool.query("SELECT * FROM products WHERE id=$1", [
      req.params.id,
    ]);

    if (!existing.rows.length)
      return res.status(404).json({ message: "Product not found" });

    const image = req.file ? `/uploads/${req.file.filename}` : existing.rows[0].image;

    const result = await pool.query(
      `UPDATE products SET name=$1, price=$2, category=$3, image=$4 WHERE id=$5 RETURNING *`,
      [name, price, category, image, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- CART ----------
app.get("/api/cart/:userId", async (req, res) => {
  const result = await pool.query("SELECT * FROM carts WHERE user_id=$1", [
    req.params.userId,
  ]);
  res.json(result.rows);
});

app.post("/api/cart", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existing = await pool.query(
      "SELECT * FROM carts WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    if (existing.rows.length) {
      await pool.query(
        "UPDATE carts SET quantity = quantity + $1 WHERE id=$2",
        [quantity, existing.rows[0].id]
      );
    } else {
      await pool.query(
        "INSERT INTO carts (user_id, product_id, quantity) VALUES ($1,$2,$3)",
        [userId, productId, quantity]
      );
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- ORDERS ----------

// PLACE ORDER
app.post("/api/orders", async (req, res) => {
  try {
    const { userId, fullName, phone, deliveryAddress, products } = req.body;

    const total = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const result = await pool.query(
      `INSERT INTO orders (user_id, full_name, phone, delivery_address, products, total_price)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [userId, fullName, phone, deliveryAddress, JSON.stringify(products), total]
    );

    res.json({ message: "Order placed", order: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all orders (admin)
app.get("/api/orders", async (req, res) => {
  const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
  res.json(result.rows);
});

// UPDATE order status
app.put("/api/orders/:id", async (req, res) => {
  const result = await pool.query(
    "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
    [req.body.status, req.params.id]
  );
  res.json(result.rows[0]);
});

// GET orders for specific user
app.get("/api/orders/user/:userId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC",
    [req.params.userId]
  );
  res.json(result.rows);
});

// ---------- ABOUT IMAGES ----------
app.get("/api/about-images", async (req, res) => {
  const result = await pool.query("SELECT * FROM about_images ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/api/about-images", aboutUpload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });

  const result = await pool.query(
    "INSERT INTO about_images (image) VALUES ($1) RETURNING *",
    [`/uploads/about/${req.file.filename}`]
  );
  res.json(result.rows[0]);
});

app.delete("/api/about-images/:id", async (req, res) => {
  await pool.query("DELETE FROM about_images WHERE id=$1", [req.params.id]);
  res.json({ message: "Deleted" });
});

// ---------- START ----------
app.listen(process.env.PORT || 5000, () =>
  console.log("🚀 Server running with PostgreSQL")
);
