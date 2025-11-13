import React, { useState, useEffect } from "react";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: null, category: "" });
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);

  const [aboutImages, setAboutImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch About images
  const fetchAboutImages = async () => {
    try {
      const res = await fetch(`${API}/api/about-images`);
      const data = await res.json();
      setAboutImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAboutImages();
  }, [API]);

  // Product submit
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, image: null, category: product.category || "" });
    setPreview(product.image?.startsWith("http") ? product.image : `${API}${product.image}`);
    setEditing(product.id);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  // About upload
  const handleAboutUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Select an image");
    const formData = new FormData();
    formData.append("image", selectedFile);
    const res = await fetch(`${API}/api/about-images`, { method: "POST", body: formData });
    const data = await res.json();
    setAboutImages((p) => [...p, data]);
    setSelectedFile(null);
  };

  const handleDeleteAbout = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    await fetch(`${API}/api/about-images/${id}`, { method: "DELETE" });
    setAboutImages((p) => p.filter((img) => img.id !== id));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-yellow-600">🛒 Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto mb-8">
        <h2 className="text-xl mb-4">{editing ? "Edit Product" : "Add New Product"}</h2>

        <input type="text" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mb-3 p-2 border rounded" required />
        <input type="number" placeholder="Price (₦)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full mb-3 p-2 border rounded" required />

        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mb-3 p-2 border rounded" required>
          <option value="">Select Category</option>
          <option value="Babies Corner">Babies Corner</option>
          <option value="Wines & Alcohol">Wines & Alcohol</option>
          <option value="Beverages">Beverages</option>
          <option value="Lotions & Body Care">Lotions & Body Care</option>
          <option value="Cooking Utensils">Cooking Utensils</option>
          <option value="Other Materials">Other Materials</option>
        </select>

        <input type="file" onChange={handleFileChange} accept="image/*" className="w-full mb-3" />
        {preview && <div className="mb-3"><img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded border" /></div>}

        <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded">{editing ? "Update Product" : "Add Product"}</button>
      </form>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <img src={product.image?.startsWith("http") ? product.image : `${API}${product.image}`} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">₦{Number(product.price).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">{product.category}</p>
            <div className="flex justify-between mt-3">
              <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* About images block */}
      <div className="max-w-6xl mx-auto bg-gray-900 p-6 rounded-lg text-gray-100">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">About Page Images</h3>

        <form onSubmit={handleAboutUpload} className="mb-4">
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} accept="image/*" className="mb-2" />
          {selectedFile && (
            <div className="mb-2"><img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-32 h-32 object-cover rounded border" /></div>
          )}
          <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded">Upload Image</button>
        </form>

        <div className="flex gap-4 flex-wrap">
          {aboutImages.map((img) => (
            <div key={img.id} className="text-center relative">
              <img src={img.image?.startsWith("http") ? img.image : `${API}${img.image}`} alt="about" className="w-36 h-36 object-cover rounded mb-2" />
              <button onClick={() => handleDeleteAbout(img.id)} className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
