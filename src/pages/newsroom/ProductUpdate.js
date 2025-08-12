import React, { useState, useEffect } from 'react';
import newsroom from '../../assets/images/newsroom/latest-products.jpg';
import api from '../../api';
import ContactCTA from '../../components/home/ContactCTA';
import { Link } from 'react-router-dom';

const ProductsUpdate = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [expandedItems, setExpandedItems] = useState([]);

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
        setAllProducts(res.data);
        setProducts(res.data.slice(0, visibleProducts));
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
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
            </div>
          ) : (
            <>
              {/* First and Second Product Layout Side-by-Side */}
              <div className="flex flex-col lg:flex-row gap-8 mb-16">
                {/* First Product - Wide Left Column */}
                {products[0] && (
                  <article key={products[0].id} className="lg:w-2/3 border-b pb-10">
                    <Link to={`/newsroom/products/${products[0].id}`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition">
                      {products[0].title || 'Untitled Product'}  
                    </h2>
                    </Link>
                    <p className="text-gray-600 mb-4">
                      {expandedItems.includes(products[0].id)
                        ? products[0].description
                        : `${products[0].description?.substring(0, 200)}...`}
                        
                      {products[0].description?.length > 200 && (
                        <button
                          onClick={() => toggleReadMore(products[0].id)}
                          className="ml-2 text-blue-600 hover:underline text-sm"
                        >
                          {expandedItems.includes(products[0].id) ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                    <img
                      src={`http://localhost:5000${products[0].file}`}
                      alt=""
                      className="w-full h-80 object-cover rounded-md"
                    />
                  </article>
                )}

                {/* Second Product - Compact Right Column */}
                {products[1] && (
                  <article key={products[1].id} className="lg:w-1/3 bg-white border shadow p-4 rounded-md">
                     <Link to={`/newsroom/products/${products[1].id}`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition">
                      {products[1].title || 'Untitled Product'}
                    </h2>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3">
                      {expandedItems.includes(products[1].id)
                        ? products[1].description
                        : `${products[1].description?.substring(0, 100)}...`}
                      {products[1].description?.length > 100 && (
                        <button
                          onClick={() => toggleReadMore(products[1].id)}
                          className="ml-2 text-blue-600 hover:underline text-sm"
                        >
                          {expandedItems.includes(products[1].id) ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                    <img
                      src={`http://localhost:5000${products[1].file}`}
                      alt=""
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </article>
                )}
              </div>

              {/* Remaining Products - Grid Cards */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.slice(2).map((product) => {
                  const formattedDate = new Date(product.created_date).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  const isExpanded = expandedItems.includes(product.id);
                  const isLong = product.description?.length > 200;

                  return (
                    <article
                      key={product.id}
                      className="border rounded-md shadow hover:shadow-lg transition p-4 bg-white"
                    >
                      <img
                        src={`http://localhost:5000${product.file}`}
                        alt=""
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                      <Link to={`/newsroom/products/${product.id}`}>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition">
                        {product.title || 'Untitled Product'}
                      </h2>
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">{formattedDate}</p>
                      <div className="text-gray-700 text-sm whitespace-pre-line">
                        {isExpanded || !isLong
                          ? product.description
                          : `${product.description?.substring(0, 200)}...`}
                        {isLong && (
                          <button
                            onClick={() => toggleReadMore(product.id)}
                            className="ml-2 text-blue-600 hover:underline text-sm"
                          >
                            {isExpanded ? 'Show Less' : 'Read More'}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {/* Load More Button */}
          {allProducts.length > visibleProducts && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 focus:outline-none"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </main>

      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default ProductsUpdate;
