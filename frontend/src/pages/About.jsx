import React, { useEffect, useState } from "react";

export default function About() {
  const [aboutImages, setAboutImages] = useState([]);

  // ✅ Use Render backend URL when deployed, fallback to localhost
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/api/about-images`)
      .then((res) => res.json())
      .then((data) => setAboutImages(data))
      .catch((err) => console.error(err));
  }, [API]);

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-900 bg-gray-100 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gold">
        About WESTLINK Supermarket
      </h2>

      <p className="mb-4">
        WESTLINK Supermarket is located in{" "}
        <strong>New Owerri, Imo State, Nigeria</strong>. We’re committed to
        bringing you quality groceries, household products, and exceptional
        customer service.
      </p>

      <div className="mb-6 space-y-2 text-gray-800">
        <p>
          📍 <strong>Location:</strong> New Owerri, Imo State, Nigeria
        </p>
        <p>
          🌐 <strong>Google Business:</strong>
          <a
            href="https://g.page/WESTLINK-Supermarket"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 underline ml-1"
          >
            Visit our Google profile
          </a>
        </p>
        <p>
          📘 <strong>Facebook:</strong>
          <a
            href="https://facebook.com/WESTLINKSupermarket"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 underline ml-1"
          >
            @WESTLINKSupermarket
          </a>
        </p>
      </div>

      {/* ✅ Display About Page Images */}
      {aboutImages.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {aboutImages.map((img) => (
            <img
              key={img.id}
              src={`${API}${img.url}`}
              alt="About"
              className="w-full h-48 object-cover rounded-lg shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
}
