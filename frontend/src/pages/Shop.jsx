import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(()=> {
        // fallback sample
        setProducts([
          { id: 1, name: "Fallback Rice 10kg", priceNumber: 12000, image: "" },
          { id: 2, name: "Fallback Oil 2L", priceNumber: 4500, image: "" },
        ]);
        setLoading(false);
      });
  },[]);

  if(loading) return <div className="p-6">Loading products…</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Popular Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
