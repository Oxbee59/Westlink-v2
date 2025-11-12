import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
const SECRET = "westlink_secret_key";

// Data file paths
const usersFile = path.join(__dirname, "data/users.json");
const productsFile = path.join(__dirname, "data/products.json");
const cartFile = path.join(__dirname, "data/carts.json");
const aboutFile = path.join(__dirname, "data/about.json");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Helper functions
const readData = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : []);
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ================== AUTH ROUTES ==================

// Register
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  const users = readData(usersFile);

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashedPassword, isAdmin: false };
  users.push(newUser);
  writeData(usersFile, users);

  res.json({ message: "Registration successful" });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const users = readData(usersFile);
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET, { expiresIn: "2h" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
});

// Profile
app.get("/api/profile/:id", (req, res) => {
  const users = readData(usersFile);
  const user = users.find((u) => u.id == req.params.id);
  user ? res.json(user) : res.status(404).json({ message: "User not found" });
});

// ================== PRODUCT ROUTES ==================
app.get("/api/products", (req, res) => res.json(readData(productsFile)));

app.post("/api/products", upload.single("image"), (req, res) => {
  const products = readData(productsFile);
  const { name, price, category } = req.body;

  const newProduct = {
    id: Date.now(),
    name,
    price: Number(price),
    category,
    image: req.file ? `/uploads/${req.file.filename}` : "",
  };

  products.push(newProduct);
  writeData(productsFile, products);
  res.json(newProduct);
});

app.put("/api/products/:id", upload.single("image"), (req, res) => {
  const products = readData(productsFile);
  const index = products.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  const updated = {
    ...products[index],
    name: req.body.name || products[index].name,
    price: req.body.price || products[index].price,
    category: req.body.category || products[index].category,
    image: req.file ? `/uploads/${req.file.filename}` : products[index].image,
  };

  products[index] = updated;
  writeData(productsFile, products);
  res.json(updated);
});

app.delete("/api/products/:id", (req, res) => {
  let products = readData(productsFile);
  products = products.filter((p) => p.id != req.params.id);
  writeData(productsFile, products);
  res.json({ message: "Product deleted" });
});

// ================== CART ROUTES ==================
app.get("/api/cart/:userId", (req, res) => {
  const carts = readData(cartFile);
  const userCart = carts.filter((item) => item.userId == req.params.userId);
  res.json(userCart);
});

app.post("/api/cart", (req, res) => {
  const carts = readData(cartFile);
  const { userId, productId, quantity } = req.body;

  const existing = carts.find((item) => item.userId == userId && item.productId == productId);
  if (existing) existing.quantity += quantity;
  else carts.push({ id: Date.now(), userId, productId, quantity });

  writeData(cartFile, carts);
  res.json({ message: "Added to cart" });
});

// ================== ABOUT PAGE IMAGES ==================
app.get("/api/about", (req, res) => res.json(readData(aboutFile)));

app.post("/api/about", upload.single("image"), (req, res) => {
  const aboutImages = readData(aboutFile);
  const newImage = { id: Date.now(), image: `/uploads/${req.file.filename}` };
  aboutImages.push(newImage);
  writeData(aboutFile, aboutImages);
  res.json(newImage);
});

// ================== SERVER ==================
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// Ensure folder exists
const aboutUploadsDir = path.join(__dirname, "uploads/about");
if (!fs.existsSync(aboutUploadsDir)) fs.mkdirSync(aboutUploadsDir, { recursive: true });

// Multer setup for About images
const aboutStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, aboutUploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const aboutUpload = multer({ storage: aboutStorage });

// ================== ABOUT ROUTES ==================

// Get all About images
app.get("/api/about-images", (req, res) => {
  const aboutImages = readData(aboutFile);
  res.json(aboutImages);
});

// Upload new About image
app.post("/api/about-images", aboutUpload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const aboutImages = readData(aboutFile);
  const newImage = { id: Date.now(), image: `/uploads/about/${req.file.filename}` };
  aboutImages.push(newImage);
  writeData(aboutFile, aboutImages);

  res.json(newImage);
});

// Delete About image
app.delete("/api/about-images/:id", (req, res) => {
  let aboutImages = readData(aboutFile);
  const imageToDelete = aboutImages.find(img => img.id == req.params.id);
  if (!imageToDelete) return res.status(404).json({ message: "Image not found" });

  // Remove file from disk
  const filePath = path.join(__dirname, imageToDelete.image);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  // Remove from JSON
  aboutImages = aboutImages.filter(img => img.id != req.params.id);
  writeData(aboutFile, aboutImages);

  res.json({ message: "Deleted" });
});
