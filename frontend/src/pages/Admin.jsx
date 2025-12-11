import React, { useState, useEffect } from "react";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: null, category: "" });
  const [preview, setPreview] = useState(null);
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
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    setForm({ name: "", price: "", image: null, category: "" });
    setEditing(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

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
    setForm({ name: product.name, price: product.price, image: null, category: product.category || "" });
    setPreview(product.image?.startsWith("http") ? product.image : `${API}${product.image}`);
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

  const formatNumber = (num) => {
    const n = typeof num === "number" ? num : Number(num);
    return !isNaN(n) ? n.toLocaleString() : "0";
  };

  // ---------------- UI ----------------
  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* PRODUCT FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto mb-8">
        <h2 className="text-xl mb-4">{editing ? "Edit Product" : "Add New Product"}</h2>

        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Price (₦)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Babies Corner">Babies Corner</option>
          <option value="Wines & Alcohol">Wines & Alcohol</option>
          <option value="Beverages">Beverages</option>
          <option value="Lotions & Body Care">Lotions & Body Care</option>
          <option value="Cooking Utensils">Cooking Utensils</option>
          <option value="Other Materials">Other Materials</option>
          <option value="Cooking Essentials">Cooking Essentials</option>
        </select>

        <input type="file" onChange={handleFileChange} accept="image/*" className="w-full mb-3" />

        {preview && (
          <div className="mb-3">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded">
            {editing ? "Update Product" : "Add Product"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="bg-gray-600 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* PRODUCT GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <img
              src={product.image?.startsWith("http") ? product.image : `${API}${product.image}`}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">₦{formatNumber(product.price)}</p>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ABOUT IMAGES */}
      <div className="max-w-6xl mx-auto bg-gray-900 p-6 rounded-lg text-gray-100 mb-8">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">About Page Images</h3>

        <form onSubmit={handleAboutUpload} className="mb-4">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            accept="image/*"
            className="mb-2"
          />

          {selectedFile && (
            <div className="mb-2">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}

          <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded">
            Upload Image
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {aboutImages.map((img) => (
            <div key={img.id} className="bg-gray-800 p-3 rounded shadow">
              <img src={img.image} className="w-full h-32 object-cover rounded mb-2" />
              <button
                onClick={() => handleDeleteAboutImage(img.id)}
                className="bg-red-600 text-white px-3 py-1 rounded w-full"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600">📦 Customer Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-yellow-100">
                  <th className="border px-4 py-2">Order ID</th>
                  <th className="border px-4 py-2">Customer</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Delivery Address</th>
                  <th className="border px-4 py-2">Products</th>
                  <th className="border px-4 py-2">Total (₦)</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="text-center">
                    <td className="border px-4 py-2">{order.id}</td>
                    <td className="border px-4 py-2">{order.full_name || "-"}</td>
                    <td className="border px-4 py-2">{order.phone || "-"}</td>
                    <td className="border px-4 py-2">{order.delivery_address || "-"}</td>
                    <td className="border px-4 py-2 text-left">
                      {Array.isArray(order.products)
                        ? order.products.map((p, idx) => (
                            <div key={idx}>
                              {p.name} × {p.quantity}
                            </div>
                          ))
                        : "-"}
                    </td>
                    <td className="border px-4 py-2">₦{formatNumber(order.total_price)}</td>
                    <td className="border px-4 py-2">{order.status}</td>
                    <td className="border px-4 py-2 space-x-2">
                      {order.status !== "completed" && (
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          ✅ Complete
                        </button>
                      )}
                      {order.status === "completed" && (
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          🗑 Delete
                        </button>
                      )}
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
