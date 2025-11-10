import React, { useState, useEffect } from "react";

export default function AboutManager() {
  const [aboutImages, setAboutImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/about-images")
      .then((res) => res.json())
      .then((data) => setAboutImages(data))
      .catch((err) => console.error("Error loading images:", err));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("image", selectedFile);

    await fetch("http://localhost:5000/api/about-images", {
      method: "POST",
      body: formData,
    });

    alert("Image uploaded!");
    window.location.reload();
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl mt-6 shadow-md text-gray-100">
      <h3 className="text-xl font-bold text-gold mb-4">About Page Images</h3>

      <form onSubmit={handleUpload} className="mb-4">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block w-full mb-2 bg-gray-800 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
        >
          Upload Image
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {aboutImages.map((img) => (
          <img
            key={img.id}
            src={`http://localhost:5000${img.url}`}
            alt="About section"
            className="w-full h-40 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}
