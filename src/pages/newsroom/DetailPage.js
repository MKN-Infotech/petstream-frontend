import React, { useState, useEffect } from 'react';
import api from '../../api';
import newsroom from '../../assets/images/newsroom/news.png';
import ContactCTA from '../../components/home/ContactCTA';
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
   const { id } = useParams(); // grabs the :id from route

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

 useEffect(() => {
    api
      .get("/api/news")
      .then((res) => {
        const item = res.data.find((n) => String(n.id) === String(id)); 
        setNews(item || null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load news");
      }) 
      .finally(() => setLoading(false));
  }, [id]);

  const toggleReadMore = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'breaking':
        return 'bg-red-100 text-red-800';
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

  if (loading) return <div className="text-center py-16">Loading latest news…</div>;
  if (error) return <div className="text-center text-red-600 py-16">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-64">
        <img src={newsroom} alt="Latest News Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute inset-0 container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Latest News</h1>
          <div className="flex items-center text-white text-sm">
            <a href="/" className="hover:text-gray-200">Home</a>
            <span className="mx-2">›</span>
            <span>Latest News</span>
          </div>
        </div>
      </section>

<main className="py-16 flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {!news ? (
            <div className="text-center py-16 text-gray-500 text-lg">News article not found.</div>
          ) : (
            <article key={news.id} className="lg:w-2/3 border-b pb-10 mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {news.headline || 'Untitled News'}
              </h1>
              <div className="text-sm text-gray-500 mb-2">
                {new Date(news.published_date).toLocaleDateString()}
                {news.author && <> • By {news.author}</>}
              </div>
              {news.category && (
                <div className={`inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news.category)}`}>
                  {news.category}
                </div>
              )}
              <p className="text-gray-700 mb-4">
                {news.content}
              </p>
              {news.file && (
                <img
                  src={`http://localhost:5000${news.file}`}
                  alt=""
                  className="w-full h-80 object-cover rounded-md mb-4"
                />
              )}
            </article>
          )}
        </div>
      </main>

      <ContactCTA />
    </div>
  );
};

export default DetailPage;
