import React, { useState, useEffect } from "react";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", images: [], category: "" });
  const [previews, setPreviews] = useState([]);
  const [editing, setEditing] = useState(null);

  const [aboutImages, setAboutImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [orders, setOrders] = useState([]);

  const API = import.meta.env.VITE_API_URL || "https://westlink-backend.onrender.com";

  // ---------------- FETCH DATA ----------------
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  const fetchAboutImages = async () => {
    try {
      const res = await fetch(`${API}/api/about-images`);
      const data = await res.json();
      setAboutImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch about-images error:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAboutImages();
    fetchOrders();
  }, []);

  // ---------------- HANDLE PRODUCT FORM ----------------
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setForm({ ...form, images: files });
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const resetForm = () => {
    setForm({ name: "", price: "", images: [], category: "" });
    setEditing(null);
    setPreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);

    form.images.forEach((img) => formData.append("images", img));

    const url = editing ? `${API}/api/products/${editing}` : `${API}/api/products`;
    const method = editing ? "PUT" : "POST";

    try {
      await fetch(url, { method, body: formData });
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Product submit error:", err);
    }
  };

  const handleEditProduct = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      images: [],
      category: product.category || "",
    });

    const imgs = [product.image1, product.image2, product.image3].filter(Boolean);
    setPreviews(imgs);
    setEditing(product.id);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  // ---------------- ABOUT IMAGES ----------------
  const handleAboutUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Select an image");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${API}/api/about-images`, { method: "POST", body: formData });
      const data = await res.json();
      setAboutImages((prev) => [...prev, data]);
      setSelectedFile(null);
    } catch (err) {
      console.error("About upload error:", err);
    }
  };

  const handleDeleteAboutImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await fetch(`${API}/api/about-images/${id}`, { method: "DELETE" });
      setAboutImages((p) => p.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Delete about image error:", err);
    }
  };

  // ---------------- ORDERS ----------------
  const handleCompleteOrder = async (orderId) => {
    if (!window.confirm("Mark this order as completed?")) return;
    try {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "completed" } : o))
      );
      await fetch(`${API}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
    } catch (err) {
      console.error("Complete order error:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      await fetch(`${API}/api/orders/${orderId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete order error:", err);
    }
  };

  const handleDownloadInvoice = (orderId) => {
    window.open(`${API}/api/orders/${orderId}/invoice`, "_blank");
  };

  const formatNumber = (num) => {
    const n = typeof num === "number" ? num : Number(num);
    return !isNaN(n) ? n.toLocaleString() : "0";
  };

  // ---------------- UI ----------------
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* ================= PRODUCTS ================= */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Manage Products</h2>
        <form onSubmit={handleSubmit} className="mb-4 grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded col-span-full md:col-span-1"
          />
          <div className="flex gap-2 col-span-full md:col-span-2 flex-wrap">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="h-16 w-16 object-cover rounded" />
            ))}
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded col-span-full md:col-span-1"
          >
            {editing ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* PRODUCTS GRID */}
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="border p-2 rounded shadow flex flex-col">
              <div className="flex gap-1 mb-2">
                {[p.image1, p.image2, p.image3].filter(Boolean).map((img, i) => (
                  <img key={i} src={img} alt="" className="h-20 w-20 object-cover rounded" />
                ))}
              </div>
              <h3 className="font-semibold">{p.name}</h3>
              <p>₦{formatNumber(p.price)}</p>
              <p className="text-sm text-gray-500">{p.category}</p>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => handleEditProduct(p)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ABOUT IMAGES ================= */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">About Images</h2>
        <form onSubmit={handleAboutUpload} className="flex gap-2 flex-wrap mb-4">
          <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Upload</button>
        </form>
        <div className="flex gap-2 flex-wrap">
          {aboutImages.map((img) => (
            <div key={img.id} className="relative">
              <img src={img.image} alt="" className="h-24 w-24 object-cover rounded" />
              <button
                onClick={() => handleDeleteAboutImage(img.id)}
                className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Customer Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Products</th>
                  <th className="border p-2">Total (₦)</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="text-center">
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.full_name}</td>
                    <td className="border p-2">{order.phone}</td>
                    <td className="border p-2">{order.delivery_address}</td>
                    <td className="border p-2 text-left">
                      {order.products.map((p, i) => (
                        <div key={i}>
                          {p.name} × {p.quantity} @ ₦{formatNumber(p.price)}
                        </div>
                      ))}
                    </td>
                    <td className="border p-2 font-semibold">₦{formatNumber(order.total_price)}</td>
                    <td className="border p-2 capitalize">{order.status || "pending"}</td>
                    <td className="border p-2 flex gap-1 justify-center flex-wrap">
                      {order.status !== "completed" && (
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Download Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
