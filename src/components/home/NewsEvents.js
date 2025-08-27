// File: src/components/common/NewsEventsWidget.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api'; // Import your centralized API config

const NewsEventsWidget = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [isVisible, setIsVisible] = useState(true);

  // NEW: state for live data
  const [recentNews, setRecentNews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-show after 2 minutes (120000ms) when closed
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => setIsVisible(true), 120000); // Changed from 10000 to 120000
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // UPDATED: use centralized API instead of direct axios calls
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [newsRes, eventsRes] = await Promise.all([
          api.get('/api/news'),    // Changed from axios.get('https://petstream.in/api/news')
          api.get('/api/events'),  // Changed from axios.get('https://petstream.in/api/events')
        ]);
        setRecentNews(newsRes.data);
        setUpcomingEvents(eventsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load news & events.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleClose = () => setIsVisible(false);
  if (!isVisible) return null;

  // NEW: loading & error states
  if (loading) {
    return (
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-white rounded-2xl shadow-xl w-80 p-6 text-center">
          Loading…
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-red-100 rounded-2xl shadow-xl w-80 p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-80 border-2">
        {/* Header */}
        <div className="bg-blue-600 text-white rounded-t-2xl p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide">NEWS & EVENTS</h2>
          <button onClick={handleClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'news'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Latest News ({recentNews.length})
          </button>
         
        </div>

        {/* Content */}
        <div className="p-4 max-h-64 overflow-y-auto">
          {activeTab === 'news' ? (
            <div className="space-y-3">
              {recentNews.map((news) => (
                <Link
                  key={news.id}
                  to="/newsroom/news"
                  className="group block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 hover:bg-blue-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    {/* adjust these fields to match your API shape */}
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {news.category || 'News'}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">
                      {new Date(news.published_date || news.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      }).toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {news.headline || news.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {(news.description || news.content || '').substring(0, 80)}...
                  </p>
                </Link>
              ))}
              {recentNews.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">No recent news available</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to="/newsroom/events"
                  className="group block p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-100 hover:shadow-sm transition-all duration-200 hover:from-blue-100 hover:to-blue-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 text-white rounded-lg p-2 text-center min-w-[45px]">
                      <div className="text-xs font-bold leading-tight">
                        {new Date(event.event_date || event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        }).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-600 flex items-center mb-1">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {event.location || 'Location TBD'}
                      </p>
                      {event.start_time && (
                        <p className="text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.start_time}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {upcomingEvents.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">No upcoming events</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex space-x-2">
            <Link to="/newsroom/news" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
              All News
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEventsWidget;
