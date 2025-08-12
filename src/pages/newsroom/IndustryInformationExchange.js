import React, { useState, useEffect } from 'react';
import api from '../../api';
import newsroom from '../../assets/images/newsroom/industryinfo.jpg';
import ContactCTA from '../../components/home/ContactCTA';
import { Link } from 'react-router-dom';

const IndustryInformation = () => {
  const [industryItems, setIndustryItems] = useState([]);
  const [allIndustryItems, setAllIndustryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(5);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/industry');
        setAllIndustryItems(res.data);
        setIndustryItems(res.data.slice(0, visibleItems));
      } catch {
        setError('Unable to load industry information at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visibleItems]);

  const handleLoadMore = () => {
    const nextVisible = visibleItems + 5;
    setVisibleItems(nextVisible);
    setIndustryItems(allIndustryItems.slice(0, nextVisible));
  };

  const toggleReadMore = (itemId) => {
    setExpandedItem((prev) => (prev === itemId ? null : itemId));
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-500 text-lg">Loading industry information…</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-16 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-64">
        <img src={newsroom} alt="Industry Information Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute inset-0 container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Industry Information</h1>
          <div className="flex items-center text-white text-sm">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <span className="mx-2">›</span>
            <span>Industry Information</span>
          </div>
        </div>
      </section>

      {/* Industry List */}
      <main className="pb-16 flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {industryItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No industry information available at the moment.</p>
            </div>
          ) : (
            <>
              {/* First 2 Items */}
              <div className="flex flex-col lg:flex-row gap-8 mb-16">
                {industryItems[0] && (
                  <article key={industryItems[0].id} className="lg:w-2/3 border-b pb-10">
                    <Link to={`/newsroom/industry/details/${industryItems[0].id}`}>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition">
                        {industryItems[0].title || 'Untitled Article'}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4">
                      {expandedItem === industryItems[0].id
                        ? industryItems[0].description
                        : `${industryItems[0].description?.substring(0, 200)}...`}
                      {industryItems[0].description?.length > 200 && (
                        <button
                          onClick={() => toggleReadMore(industryItems[0].id)}
                          className="ml-2 text-blue-600 hover:underline text-sm"
                        >
                          {expandedItem === industryItems[0].id ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                    <img
                      src={`https://petstream.in${industryItems[0].file}`}
                      alt={industryItems[0].title}
                      className="w-full h-80 object-cover rounded-md"
                    />
                  </article>
                )}

                {industryItems[1] && (
                  <article key={industryItems[1].id} className="lg:w-1/3 bg-white border shadow p-4 rounded-md">
                    <Link to={`/newsroom/industry/details/${industryItems[1].id}`}>
                      <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition">
                        {industryItems[1].title || 'Untitled Article'}
                      </h2>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3">
                      {expandedItem === industryItems[1].id
                        ? industryItems[1].description
                        : `${industryItems[1].description?.substring(0, 100)}...`}
                      {industryItems[1].description?.length > 100 && (
                        <button
                          onClick={() => toggleReadMore(industryItems[1].id)}
                          className="ml-2 text-blue-600 hover:underline text-sm"
                        >
                          {expandedItem === industryItems[1].id ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                    <img
                      src={`https://petstream.in${industryItems[1].file}`}
                      alt={industryItems[1].title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </article>
                )}
              </div>

              {/* Remaining Items Grid */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {industryItems.slice(2).map((item) => {
                  const formattedDate = new Date(item.publish_date).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const isExpanded = expandedItem === item.id;
                  const isLong = item.description?.length > 200;

                  return (
                    <article key={item.id} className="border rounded-md shadow hover:shadow-lg transition p-4 bg-white">
                      <img
                        src={`https://petstream.in${item.file}`}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                      <Link to={`/newsroom/industry/details/${item.id}`}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1 hover:text-blue-600 transition">
                          {item.title || 'Untitled Article'}
                        </h2>
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">{formattedDate}</p>
                      <div className="text-gray-700 text-sm whitespace-pre-line">
                        {isExpanded || !isLong
                          ? item.description
                          : `${item.description?.substring(0, 200)}...`}
                        {isLong && (
                          <button
                            onClick={() => toggleReadMore(item.id)}
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
          {allIndustryItems.length > visibleItems && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </main>

      <ContactCTA />
    </div>
  );
};

export default IndustryInformation;
