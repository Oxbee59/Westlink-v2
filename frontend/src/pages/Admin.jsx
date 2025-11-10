import React, { useState, useEffect } from "react";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: null, category: "" });
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);

  const [aboutImages, setAboutImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ Base API URL (auto-adjusts for local or deployed)
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch(`${API}/api/products`);
    const data = await res.json();
    setProducts(data);
  };

  // Fetch About images
  const fetchAboutImages = async () => {
    const res = await fetch(`${API}/api/about-images`);
    const data = await res.json();
    setAboutImages(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchAboutImages();
  }, []);

  // Product form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    const url = editing ? `${API}/api/products/${editing}` : `${API}/api/products`;
    const method = editing ? "PUT" : "POST";

    await fetch(url, { method, body: formData });
    setForm({ name: "", price: "", image: null, category: "" });
    setPreview(null);
    setEditing(null);
    fetchProducts();
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      image: null,
      category: product.category || "",
    });
    setPreview(product.image);
    setEditing(product.id);
  };

  // File change with preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  // About image upload
  const handleAboutUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Select an image");

    const formData = new FormData();
    formData.append("image", selectedFile);

    await fetch(`${API}/api/about-images`, {
      method: "POST",
      body: formData,
    });
    setSelectedFile(null);
    fetchAboutImages();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-yellow-600">
        🛒 Admin Dashboard
      </h1>

      {/* ---------------- Product Form ---------------- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 max-w-lg mx-auto mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Edit Product" : "Add New Product"}
        </h2>

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
          <option value="Wines">Wines & Alcohol</option>
          <option value="Beverages">Beverages</option>
          <option value="Lotions & Body care">Lotions & Body Care</option>
          <option value="Cooking Utensils">Cooking Utensils</option>
          <option value="Other Materials">Other Materials</option>
        </select>

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-3"
          accept="image/*"
        />

        {/* Image Preview */}
        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 font-semibold"
        >
          {editing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* ---------------- Product List ---------------- */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={
                product.image?.startsWith("http")
                  ? product.image
                  : `${API}${product.image}`
              }
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">₦{product.price.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">{product.category}</p>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleEdit(product)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- About Page Image Upload & Management ---------------- */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-md text-gray-100 mt-10">
        <h3 className="text-xl font-bold text-gold mb-4">About Page Images</h3>

        <form onSubmit={handleAboutUpload} className="mb-4">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="block w-full mb-2 bg-gray-800 p-2 rounded"
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
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
          >
            Upload Image
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {aboutImages.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={`${API}${img.url}`}
                alt="About"
                className="w-full h-40 object-cover rounded"
              />
              <button
                onClick={async () => {
                  if (!window.confirm("Delete this image?")) return;
                  await fetch(`${API}/api/about-images/${img.id}`, {
                    method: "DELETE",
                  });
                  fetchAboutImages();
                }}
                className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded text-white text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
