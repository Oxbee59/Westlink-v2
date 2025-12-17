import React, { useEffect, useState } from "react";

export default function Admin() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [aboutImages, setAboutImages] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const [aboutFile, setAboutFile] = useState(null);

  /* ================= CATEGORIES ================= */
  const categories = [
    "All",
    "Babies Corner",
    "Wines & Alcohol",
    "Beverages",
    "Lotions & Body Care",
    "Cooking Essentials",
    "Cooking Utensils",
    "Other Materials",
  ];

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchAboutImages();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${API}/api/products`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API}/api/orders`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const fetchAboutImages = async () => {
    const res = await fetch(`${API}/api/about-images`);
    const data = await res.json();
    setAboutImages(Array.isArray(data) ? data : []);
  };

  /* ================= HELPERS ================= */
  const formatNumber = (n) =>
    !isNaN(Number(n)) ? Number(n).toLocaleString() : "0";

  /* ================= PRODUCTS ================= */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setForm({ ...form, images: files });
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("category", form.category);
    form.images.forEach((img) => fd.append("images", img));

    const url = editing
      ? `${API}/api/products/${editing}`
      : `${API}/api/products`;

    await fetch(url, { method: editing ? "PUT" : "POST", body: fd });

    resetForm();
    fetchProducts();
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "", images: [] });
    setEditing(null);
    setPreviews([]);
  };

  const editProduct = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, price: p.price, category: p.category, images: [] });
    setPreviews([p.image1, p.image2, p.image3].filter(Boolean));
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  /* ================= ABOUT ================= */
  const uploadAboutImage = async () => {
    if (!aboutFile) return alert("Select image");
    const fd = new FormData();
    fd.append("image", aboutFile);
    await fetch(`${API}/api/about-images`, { method: "POST", body: fd });
    setAboutFile(null);
    fetchAboutImages();
  };

  const deleteAboutImage = async (id) => {
    if (!window.confirm("Delete image?")) return;
    await fetch(`${API}/api/about-images/${id}`, { method: "DELETE" });
    fetchAboutImages();
  };

  /* ================= ORDERS ================= */
  const completeOrder = async (id) => {
    await fetch(`${API}/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete order?")) return;
    await fetch(`${API}/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  const downloadInvoice = (id) => {
    window.open(`${API}/api/orders/${id}/invoice`, "_blank");
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-10">

      {/* ================= ADD PRODUCT ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold text-lg mb-4">Add / Edit Product</h2>
        <form onSubmit={handleSubmitProduct} className="grid md:grid-cols-4 gap-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2"
            required
          />
          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2"
            required
          >
            <option value="">Select Category</option>
            {categories.slice(1).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input type="file" multiple onChange={handleFileChange} />
          <button className="bg-green-600 text-white px-4 py-2 rounded col-span-full">
            {editing ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold">Products</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="border p-3 rounded">
              <img src={p.image1} className="h-40 w-full object-cover mb-2" />
              <h3 className="font-bold">{p.name}</h3>
              <p>₦{formatNumber(p.price)}</p>
              <p className="text-sm">{p.category}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => editProduct(p)} className="bg-blue-500 text-white px-2 rounded">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold mb-3">About Images</h2>
        <input type="file" onChange={(e) => setAboutFile(e.target.files[0])} />
        <button onClick={uploadAboutImage} className="bg-green-600 text-white px-3 py-1 ml-2 rounded">
          Upload
        </button>
        <div className="grid grid-cols-4 gap-3 mt-4">
          {aboutImages.map((img) => (
            <div key={img.id} className="relative">
              <img src={img.image} className="h-24 w-full object-cover" />
              <button
                onClick={() => deleteAboutImage(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold mb-4">Customer Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border text-center">
                    <td>{o.id}</td>
                    <td>{o.full_name}</td>
                    <td>{o.phone}</td>
                    <td>{o.delivery_address}</td>
                    <td className="text-left">
                      {o.products?.map((p, i) => (
                        <div key={i}>
                          {p.name} × {p.quantity} @ ₦{formatNumber(p.price)}
                        </div>
                      ))}
                    </td>
                    <td>₦{formatNumber(o.total_price)}</td>
                    <td>{o.status}</td>
                    <td className="flex flex-wrap gap-1 justify-center">
                      {o.status !== "completed" && (
                        <button onClick={() => completeOrder(o.id)} className="bg-green-600 text-white px-2 rounded">
                          Complete
                        </button>
                      )}
                      <button onClick={() => deleteOrder(o.id)} className="bg-red-600 text-white px-2 rounded">
                        Delete
                      </button>
                      <button onClick={() => downloadInvoice(o.id)} className="bg-blue-600 text-white px-2 rounded">
                        Invoice
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
