import React, { useState, useEffect } from 'react';
import api from '../../api';
import newsroom from '../../assets/images/newsroom/news.png';
import ContactCTA from '../../components/home/ContactCTA';
import { Link } from "react-router-dom";

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    api
      .get('/api/news')
      .then((res) => {
        setNews(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load news');
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleReadMore = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
          {news.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-lg">No news available at the moment.</div>
          ) : (
            <>
              {/* First and Second News Items */}
              <div className="flex flex-col lg:flex-row gap-8 mb-16">
                {/* First News */}
                {news[0] && (
                  <article key={news[0].id} className="lg:w-2/3 border-b pb-10">
                    {news[0].category && (
                      <div className={`inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news[0].category)}`}>
                        {news[0].category}
                      </div>
                    )}
                    <Link to={`/newsroom/news/detail/${news[0].id}`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 no-underline hover:underline transition">{news[0].headline || 'Untitled News'}   </h2>
                    </Link>
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(news[0].published_date).toLocaleDateString()}
                      {news[0].author && <> • By {news[0].author}</>}
                    </div>
                    
                      <p className="text-gray-700">
                        {expandedItems.includes(news[0].id) ? (
                          <span
                            dangerouslySetInnerHTML={{ __html: news[0].content }}
                          />
                        ) : (
                          <span>{news[0].content.replace(/<[^>]+>/g, "").substring(0, 250)}...</span>
                        )}
                        
                      </p>

                     {(news[0].tag) && (
  <div className="mb-4">
    <span className="text-base text-gray-700 font-semibold underline">Tags  :</span>
    <div className="inline-flex flex-wrap gap-3 mt-2">
      {news[0].tag && news[0].tag.split(',').map((tags, index) => (
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


{news?.[0]?.file && (() => {
  let files = [];
  try {
    files = Array.isArray(news[0].file) ? news[0].file : JSON.parse(news[0].file);
  } catch (e) {
    console.error("Invalid file format", e);
  }
  return files.length > 0 ? (
    <img
      src={`https://petstream.in${files[0]}`}
      alt="News"
      className="w-full h-80 object-cover rounded-md mb-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
    />
  ) : null;
})()}

                  </article>
                )}

                {/* Second News */}
                {news[1] && (
                  <article key={news[1].id} className="lg:w-1/3 bg-white border shadow p-4 rounded-md">
                     {news[0].category && (
                      <div className={`inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news[1].category)}`}>
                        {news[1].category}
                      </div>
                    )}
                    <Link to={`/newsroom/news/detail/${news[1].id}`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 no-underline hover:underline transition">{news[1].headline || 'Untitled News'}</h2>
                    </Link>
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(news[1].published_date).toLocaleDateString()}
                    </div>
                   
                    <p className="text-gray-700">
                        {expandedItems.includes(news[1].id) ? (
                          <span
                            dangerouslySetInnerHTML={{ __html: news[1].content }}
                          />
                        ) : (
                          <span>{news[1].content.replace(/<[^>]+>/g, "").substring(0, 250)}...</span>
                        )}
                        
                      </p>
                    {(news[1].tag) && (
  <div className="mb-4">
    <span className="text-base text-gray-700 font-semibold underline">Tags  :</span>
    <div className="inline-flex flex-wrap gap-3 mt-2">
      {news[1].tag && news[1].tag.split(',').map((tags, index) => (
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
                     {news?.[1]?.file && news[1].file.length > 0 && (
  <img
    src={`https://petstream.in${(() => {
      try {
        return JSON.parse(news[1].file)[0];
      } catch {
        return "";
      }
    })()}`}
    alt="News"
    className="w-full h-80 object-cover rounded-md mb-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
  />
)}
                  </article>
                )}
              </div>

              {/* Remaining News in Grid */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {news.slice(2, visibleCount).map((item) => {
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


                      
                      <Link to={`/newsroom/news/detail/${item.id}`}>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2 no-underline hover:underline transition">
  {item.headline && item.headline.length > 30 
    ? item.headline.substring(0, 100)
    : item.headline || "Untitled News"}
</h2>
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">{formattedDate}</p>
                      
                      <div className="text-gray-700 text-sm whitespace-pre-line">
                                                {expandedItems.includes(item.id) ? (
                          <span
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        ) : (
                          <span>{item.content.replace(/<[^>]+>/g, "").substring(0, 250)}...</span>
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

              {/* Load More Button */}
              {visibleCount < news.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={handleLoadMore}
                className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 focus:outline-none"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ContactCTA />
    </div>
  );
};

export default LatestNews;
