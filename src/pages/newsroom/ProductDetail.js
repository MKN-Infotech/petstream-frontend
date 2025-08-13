import React, { useState, useEffect } from 'react';
import newsroom from '../../assets/images/newsroom/latest-products.jpg';
import api from '../../api';
import ContactCTA from '../../components/home/ContactCTA';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [expandedItems, setExpandedItems] = useState([]);
  const { id } = useParams(); // grabs the :id from route
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    api.get('/api/products')
      .then((res) => {
        //setAllProducts(res.data);
        //setProducts(res.data.slice(0, visibleProducts));

         const item = res.data.find((n) => String(n.id) === String(id)); 
        setProducts(item || null);
      })
      .catch((err) => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [visibleProducts]);

  const handleLoadMore = () => {
    const nextVisible = visibleProducts + 5;
    setVisibleProducts(nextVisible);
    setProducts(allProducts.slice(0, nextVisible));
  };

  const toggleReadMore = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <div className="text-center py-16">Loading product updates…</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-16">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-64">
        <img
          src={newsroom}
          alt="Products Update Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Products Update</h1>
          <div className="flex items-center text-white text-sm">
            <a href="/" className="hover:text-gray-200">Home</a>
            <span className="mx-2">›</span>
            <span>Products Update</span>
          </div>
        </div>
      </section>
      <br />

      {/* Main Content */}
<main className="pb-16 flex-grow bg-white">
  <div className="max-w-7xl mx-auto px-4">
    {products.length === 0 ? (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">
          No products available at the moment.
        </p>
      </div>
    ) : (
      <>
        {/* Product Layout */}
        <div className="flex flex-col items-center gap-8 mb-16">
          {products && (
            <article
              key={products.id}
              className="w-full lg:w-2/3 flex flex-col items-center text-center border-b pb-10"
            >
                <h1 className="text-3xl font-bold text-gray-800 leading-snug mb-3">
                  {products.title || "Untitled Product"}
                </h1>
              <p className="text-gray-600 mb-4 max-w-2xl">
                {products.description}
              </p>
              <img
                src={`https://petstream.in${products.file}`}
                alt=""
                className="w-full max-w-3xl h-80 object-cover rounded-md"
              />
            </article>
          )}
        </div>
      </>
    )}
  </div>
</main>


      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default ProductDetail;
