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
  const [visibleCount, setVisibleCount] = useState(5);

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

   const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'breaking':
        return 'bg-red-100 text-red-800';
      case 'case study':
        return 'bg-red-100 text-red-800 bg-orange-500 text-orange-600 bg-orange-50 border-orange-200';
      case 'company news':
        return 'bg-green-100 text-green-800 bg-green-500 text-green-600 bg-green-50 border-green-200';
      case 'product focus':
        return 'bg-purple-100 text-purple-800 bg-purple-500 text-purple-600 bg-purple-50 border-purple-200';
        
        
      case 'announcement':
        return 'bg-blue-100 text-blue-800';
      case 'press release':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-yellow-100 text-yellow-800';
      case 'featured':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
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
                    {products[0].category && (
                      <div className={`inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(products[0].category)}`}>
                        {products[0].category}
                      </div>
                    )}
                    <Link to={`/newsroom/products/${products[0].id}`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 no-underline hover:underline transition">
                      {products[0].title || 'Untitled Product'}  
                    </h2>
                    </Link>
                   
                    

                    <p className="text-gray-700">
  {expandedItems.includes(products[0].id) ? (
    <span
      dangerouslySetInnerHTML={{ __html: products[0].description }}
    />
  ) : (
   <span>{products[0].description.replace(/<[^>]+>/g, "").substring(0, 250)}...</span>
  )}
  
</p>
                    {(products[0].tag) && (
  <div className="mb-4">
    <span className="text-base text-gray-700 font-semibold underline">Tags  :</span>
    <div className="inline-flex flex-wrap gap-3 mt-2">
      {products[0].tag && products[0].tag.split(',').map((tags, index) => (
        <span
          key={index}
          className="text-lg text-gray-700 font-medium underline"
        >
          {tags.trim()}
        </span>
      ))}
    </div>
  </div>
)}
                                    <br></br>
                    {products?.[0]?.file?.length > 0 && (
  <img
    src={`https://petstream.in${JSON.parse(products[0].file)[0]}`}
    alt="products"
    className="w-full h-80 object-cover rounded-md mb-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
  />
)}
                  </article>
                )}

                {/* Second Product - Compact Right Column */}
                 {products[1] && (
                                  <article key={products[1].id} className="lg:w-1/3 bg-white border shadow p-4 rounded-md">
                                     {products[1].category && (
                                      <div className={`inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(products[1].category)}`}>
                                        {products[1].category}
                                      </div>
                                    )}
                                    <Link to={`/newsroom/products/${products[1].id}`}>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2 no-underline hover:underline transition">
                                      {products[1].title || 'Untitled products'}</h2>
                                    </Link>
                                    
                                    <p className="text-gray-700">
  {expandedItems.includes(products[1].id) ? (
    <span
      dangerouslySetInnerHTML={{ __html: products[1].description }}
    />
  ) : (
   <span>{products[1].description.replace(/<[^>]+>/g, "").substring(0, 250)}...</span>
  )}
  
</p>
                                    {(products[1].tag) && (
                  <div className="mb-4">
                    <span className="text-base text-gray-700 font-semibold underline">Tags  :</span>
                    <div className="inline-flex flex-wrap gap-3 mt-2">
                      {products[1].tag && products[1].tag.split(',').map((tags, index) => (
                        <span
                          key={index}
                          className="text-lg text-gray-700 font-medium underline"
                        >
                          {tags.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                                    <br></br>
                                     {products?.[1]?.file?.length > 0 && (
                  <img
                    src={`https://petstream.in${JSON.parse(products[1].file)[0]}`}
                    alt="products"
                    className="w-full h-80 object-cover rounded-md mb-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
                  />
                )}
                                  </article>
                                )}
              </div>

              {/* Remaining Products - Grid Cards */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                              {products.slice(2, visibleCount).map((item) => {
                                const formattedDate = new Date(item.published_date).toLocaleDateString();
                                const isExpanded = expandedItems.includes(item.id);
                                const isLong = item.content?.length > 180;
                                let imageUrl = null;
                try {
                  // Parse stringified JSON into array
                  const files = JSON.parse(item.file);
              
                  if (Array.isArray(files)) {
                    // Pick the first image file only (ignore videos/audio)
                    const firstImage = files.find(f =>
                      /\.(jpe?g|png|gif|webp)$/i.test(f)
                    );
                    if (firstImage) {
                      imageUrl = `https://petstream.in${firstImage}`;
                    }
                  }
                } catch (err) {
                  console.error("Error parsing file field:", item.file, err);
                }
              
                                return (
                                  <article key={item.id} className="border rounded-md shadow hover:shadow-lg transition p-4 bg-white">
                                    {item.category && (
                <div className="flex items-center gap-3 mb-2">
                  {/* Bigger Circle */}
                  <span
                    className={`w-4 h-4 rounded-full inline-block ${getCategoryColor(
                      item.category
                    )}`}
                  ></span>
                  {/* Bigger Font */}
                  <span className="text-lg font-semibold text-gray-800">
                    {item.category}
                  </span>
                </div>
              )}
              
              
                                    
                                    <Link to={`/newsroom/products/${item.id}`}>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2 no-underline hover:underline transition">
                {item.title && item.title.length > 30 
                  ? item.title.substring(0, 100)
                  : item.title || "Untitled News"}
              </h2>
                                    </Link>
                                    
                                    
                                    <div className="text-gray-700 text-sm whitespace-pre-line">
                                                {expandedItems.includes(item.id) ? (
                          <span
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        ) : (
                          <span>{item.description.replace(/<[^>]+>/g, "").substring(0, 250)}...</span>
                        )}
                        
                      </div>
                                    {(item.tag) && (
                                    <div className="mb-4">
                                      <span className="text-base text-gray-700 font-semibold underline">Tags  :</span>
                                      <div className="inline-flex flex-wrap gap-3 mt-2">
                                        {item.tag && item.tag.split(',').map((tags, index) => (
                                          <span
                                            key={index}
                                            className="text-lg text-gray-700 font-medium underline"
                                          >
                                            {tags.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  <img
                      src={imageUrl}
                      alt="news-img"
                      className="w-full h-80 object-cover rounded-md mb-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
                    />
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
