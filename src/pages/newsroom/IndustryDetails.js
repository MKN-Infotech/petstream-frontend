import React, { useState, useEffect } from 'react';
import api from '../../api';
import newsroom from '../../assets/images/newsroom/industryinfo.jpg';
import ContactCTA from '../../components/home/ContactCTA';
import { Link, useParams } from 'react-router-dom';

const IndustryDetails = () => {
  const [industryItems, setIndustryItems] = useState([]);
  const [allIndustryItems, setAllIndustryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(5);
  const [expandedItem, setExpandedItem] = useState(null);
     const { id } = useParams(); // grabs the :id from route
  

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
        const item = res.data.find((n) => String(n.id) === String(id));
          setAllIndustryItems(item || null);
          setIndustryItems(item);
        // setIndustryItems(res.data.slice(0, visibleItems));
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


<main className="pb-16 flex-grow bg-white">
  <div className="max-w-7xl mx-auto px-4">
    {industryItems.length === 0 ? (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">
          No industry information available at the moment.
        </p>
      </div>
    ) : (
      <>
        {/* Centered Layout */}
        <div className="flex flex-col items-center gap-8 mb-16">
          {industryItems && (
            <article
              key={industryItems.id}
              className="w-full lg:w-2/3 flex flex-col items-center text-center border-b pb-10"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {industryItems.title || "Untitled Article"}
              </h2>
              <p className="text-gray-600 mb-4 max-w-2xl">
                {industryItems.description}
              </p>
              <img
                src={`https://petstream.in${industryItems.file}`}
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



      <ContactCTA />
    </div>
  );
};

export default IndustryDetails;
