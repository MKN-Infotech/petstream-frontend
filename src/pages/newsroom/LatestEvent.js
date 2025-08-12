import React, { useState, useEffect } from 'react';
import api from '../../api';
import eventBanner from '../../assets/images/newsroom/events.png';
import ContactCTA from '../../components/home/ContactCTA';
import { Link } from 'react-router-dom';

const LatestEvent = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleEvents, setVisibleEvents] = useState(5);
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    api.get('/api/events')
      .then((res) => {
        setAllEvents(res.data);
        setEvents(res.data.slice(0, visibleEvents));
      })
      .catch((err) => setError(err.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, [visibleEvents]);

  const handleLoadMore = () => {
    const nextVisible = visibleEvents + 5;
    setVisibleEvents(nextVisible);
    setEvents(allEvents.slice(0, nextVisible));
  };

  const toggleReadMore = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) return <div className="text-center py-16">Loading events…</div>;
  if (error) return <div className="text-center text-red-600 py-16">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-64">
        <img src={eventBanner} alt="Latest Events Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Latest Events</h1>
          <div className="flex items-center text-white text-sm">
            <a href="/" className="hover:text-gray-200">Home</a>
            <span className="mx-2">›</span>
            <span>Latest Events</span>
          </div>
        </div>
      </section>
      <br />

      {/* Main Content */}
      <main className="pb-16 flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No events available at the moment.</p>
            </div>
          ) : (
            <>
              {/* First and Second Event Highlight */}
              <div className="flex flex-col lg:flex-row gap-8 mb-16">
                {/* First Event */}
                {events[0] && (
                  <article key={events[0].id} className="lg:w-2/3 border-b pb-10">
                    <Link to={`/newsroom/event/details/${events[0].id}`}>
                      <h2 className="text-3xl font-bold text-gray-800 leading-snug mb-3">
                        {events[0].title || 'Untitled Event'}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(events[0].event_date)} &nbsp; | &nbsp;
                      <span className="text-green-600 font-medium capitalize">{events[0].status}</span>
                    </p>
                    <p className="text-gray-600 mb-4">
                      {expandedItems.includes(events[0].id)
                        ? events[0].content
                        : `${events[0].content?.substring(0, 200)}...`}
                      {events[0].content?.length > 200 && (
                        <button
                          onClick={() => toggleReadMore(events[0].id)}
                          className="ml-2 text-blue-600 hover:underline text-sm"
                        >
                          {expandedItems.includes(events[0].id) ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                    <img
                      src={`http://localhost:5000${events[0].file}`}
                      alt="Event"
                      className="w-full h-80 object-cover rounded-md"
                    />
                  </article>
                )}

                {/* Second Event */}
                {events[1] && (
                  <article key={events[1].id} className="lg:w-1/3 bg-white border shadow p-4 rounded-md">
                    <Link to={`/newsroom/event/details/${events[1].id}`}>
                      <h2 className="text-xl font-bold text-gray-800 leading-snug mb-2">
                        {events[1].title || 'Untitled Event'}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(events[1].event_date)} &nbsp; | &nbsp;
                      <span className="text-green-600 font-medium capitalize">{events[1].status}</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      {expandedItems.includes(events[1].id)
                        ? events[1].content
                        : `${events[1].content?.substring(0, 100)}...`}
                      {events[1].content?.length > 100 && (
                        <button
                          onClick={() => toggleReadMore(events[1].id)}
                          className="ml-2 text-blue-600 hover:underline text-sm"
                        >
                          {expandedItems.includes(events[1].id) ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                    <img
                      src={`http://localhost:5000${events[1].file}`}
                      alt="Event"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </article>
                )}
              </div>

              {/* Remaining Events Grid */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {events.slice(2).map((event) => {
                  const isExpanded = expandedItems.includes(event.id);
                  const isLong = event.content?.length > 200;

                  return (
                    <article
                      key={event.id}
                      className="border rounded-md shadow hover:shadow-lg transition p-4 bg-white"
                    >
                      <img
                        src={`http://localhost:5000${event.file}`}
                        alt="Event"
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                      <Link to={`/newsroom/event/details/${event.id}`}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">
                          {event.title || 'Untitled Event'}
                        </h2>
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">
                        {formatDate(event.event_date)} &nbsp; | &nbsp;
                        <span className="text-green-600 font-medium capitalize">{event.status}</span>
                      </p>
                      <div className="text-gray-700 text-sm whitespace-pre-line">
                        {isExpanded || !isLong
                          ? event.content
                          : `${event.content?.substring(0, 200)}...`}
                        {isLong && (
                          <button
                            onClick={() => toggleReadMore(event.id)}
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
          {allEvents.length > visibleEvents && (
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

export default LatestEvent;
