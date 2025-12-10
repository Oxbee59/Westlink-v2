// server.js
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

// Allow local dev and deployed frontend origin(s)
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

// ensure required directories exist
const uploadsDir = path.join(__dirname, "uploads");
const aboutUploadsDir = path.join(uploadsDir, "about");
const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(aboutUploadsDir)) fs.mkdirSync(aboutUploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// serve static uploads
app.use("/uploads", express.static(uploadsDir));

// data file paths
const usersFile = path.join(dataDir, "users.json");
const productsFile = path.join(dataDir, "products.json");
const cartFile = path.join(dataDir, "carts.json");
const aboutFile = path.join(dataDir, "about.json");
const ordersFile = path.join(dataDir, "orders.json"); // <-- new orders file

// ensure json files exist
for (const f of [usersFile, productsFile, cartFile, aboutFile, ordersFile]) {
  if (!fs.existsSync(f)) fs.writeFileSync(f, "[]", "utf-8");
}

// helpers
const readData = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : []);
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");

const PORT = process.env.PORT || 5000;
const SECRET = process.env.SECRET || "westlink_secret_key";

// multer storage (general uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// multer storage for about images (saved to /uploads/about)
const aboutStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, aboutUploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const aboutUpload = multer({ storage: aboutStorage });

// ---------------- AUTH ----------------

// register
app.post("/api/register", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const users = readData(usersFile);
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashedPassword, isAdmin: false };
    users.push(newUser);
    writeData(usersFile, users);

    res.json({ message: "Registration successful", user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// login
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readData(usersFile);

    const user = users.find((u) => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      SECRET,
      { expiresIn: "2h" }
    );

    // FIX: include is_staff for admin detection
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        is_staff: user.isAdmin
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// get profile
app.get("/api/profile/:id", (req, res) => {
  const users = readData(usersFile);
  const user = users.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin });
});

// ---------------- PRODUCTS ----------------

app.get("/api/products", (req, res) => {
  const products = readData(productsFile);
  res.json(products);
});

app.post("/api/products", upload.single("image"), (req, res) => {
  try {
    const products = readData(productsFile);
    const { name, price, category } = req.body;
    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price || 0),
      category: category || "Other Materials",
      image: req.file ? `/uploads/${req.file.filename}` : "",
    };
    products.push(newProduct);
    writeData(productsFile, products);
    res.json(newProduct);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/products/:id", upload.single("image"), (req, res) => {
  try {
    const products = readData(productsFile);
    const index = products.findIndex((p) => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Product not found" });

    const updated = {
      ...products[index],
      name: req.body.name || products[index].name,
      price: req.body.price ? Number(req.body.price) : products[index].price,
      category: req.body.category || products[index].category,
      image: req.file ? `/uploads/${req.file.filename}` : products[index].image,
    };

    products[index] = updated;
    writeData(productsFile, products);
    res.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  try {
    let products = readData(productsFile);
    const productToDelete = products.find((p) => p.id == req.params.id);
    if (productToDelete && productToDelete.image) {
      const filePath = path.join(__dirname, productToDelete.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    products = products.filter((p) => p.id != req.params.id);
    writeData(productsFile, products);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- CART ----------------

app.get("/api/cart/:userId", (req, res) => {
  const carts = readData(cartFile);
  const userCart = carts.filter((item) => item.userId == req.params.userId);
  res.json(userCart);
});

app.post("/api/cart", (req, res) => {
  try {
    const carts = readData(cartFile);
    const { userId, productId, quantity } = req.body;
    const existing = carts.find((item) => item.userId == userId && item.productId == productId);
    if (existing) existing.quantity += Number(quantity || 1);
    else carts.push({ id: Date.now(), userId, productId, quantity: Number(quantity || 1) });
    writeData(cartFile, carts);
    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- ORDERS ----------------

// Place a new order
app.post("/api/orders", (req, res) => {
  try {
    const { userId, fullName, phone, deliveryAddress, products } = req.body;

    if (!userId || !fullName || !phone || !deliveryAddress || !products?.length) {
      return res.status(400).json({ message: "Missing order information" });
    }

    const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const orders = readData(ordersFile);

    const newOrder = {
      id: Date.now(),
      userId,
      fullName,
      phone,
      deliveryAddress,
      products,
      totalPrice,
      status: "pending"
    };

    orders.push(newOrder);
    writeData(ordersFile, orders);

    res.json({ message: "Order successfully placed", order: newOrder });
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders (admin)
app.get("/api/orders", (req, res) => {
  try {
    const orders = readData(ordersFile);
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (e.g., mark as completed)
app.put("/api/orders/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expect { status: "completed" }
    
    const orders = readData(ordersFile);
    const index = orders.findIndex(o => o.id == id);
    if (index === -1) return res.status(404).json({ message: "Order not found" });

    orders[index].status = status || orders[index].status;
    writeData(ordersFile, orders);

    res.json({ message: "Order updated", order: orders[index] });
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Get orders for a specific user (for customer view)
app.get("/api/orders/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const orders = readData(ordersFile);

    // Filter orders that belong to the user
    const userOrders = orders.filter((o) => o.userId == userId);

    res.json({ orders: userOrders });
  } catch (err) {
    console.error("Get user orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ---------------- ABOUT IMAGES ----------------

// generic about list (also used for admin list)
app.get("/api/about-images", (req, res) => {
  const aboutImages = readData(aboutFile);
  res.json(aboutImages);
});

// upload about image (saves to uploads/about)
app.post("/api/about-images", aboutUpload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const aboutImages = readData(aboutFile);
    const newImage = { id: Date.now(), image: `/uploads/about/${req.file.filename}` };
    aboutImages.push(newImage);
    writeData(aboutFile, aboutImages);
    res.json(newImage);
  } catch (err) {
    console.error("About upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete about image
app.delete("/api/about-images/:id", (req, res) => {
  try {
    let aboutImages = readData(aboutFile);
    const imageToDelete = aboutImages.find((img) => img.id == req.params.id);
    if (!imageToDelete) return res.status(404).json({ message: "Image not found" });

    const filePath = path.join(__dirname, imageToDelete.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    aboutImages = aboutImages.filter((img) => img.id != req.params.id);
    writeData(aboutFile, aboutImages);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("About delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- START ----------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
