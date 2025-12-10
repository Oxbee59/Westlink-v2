import React, { useEffect, useState } from "react";

export default function About() {
  const [aboutImages, setAboutImages] = useState([]);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/api/about-images`)
      .then((res) => res.json())
      .then((data) => setAboutImages(data))
      .catch((err) => console.error(err));
  }, [API]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600">About WESTLINK Supermarket</h2>

      <p className="mb-4">
        WESTLINK Supermarket is located in <strong>New Owerri, Imo State, Nigeria</strong>. We’re committed to bringing you quality groceries, household products, and exceptional customer service.
      </p>

      <div className="mb-6 space-y-2 text-gray-700">
        <p>📍 <strong>Location:</strong> New Owerri, Imo State, Nigeria</p>
        <p>🌐 <strong>Google Business:</strong> <a href="https://share.google/GJ2WTsdy5T6QvdC4o" target="_blank" rel="noreferrer" className="text-yellow-500 underline ml-1">Visit our Google profile</a></p>
        <p>📘 <strong>Facebook:</strong> <a href="https://web.facebook.com/profile.php?id=61571621041191" target="_blank" rel="noreferrer" className="text-yellow-500 underline ml-1">@WESTLINKSupermarket</a></p>
      </div>

      {aboutImages.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {aboutImages.map((img) => (
            <img key={img.id} src={img.image?.startsWith("http") ? img.image : `${API}${img.image}`} alt="About" className="w-full h-48 object-cover rounded-lg shadow" />
          ))}
        </div>
      )}
    </div>
  );
}
