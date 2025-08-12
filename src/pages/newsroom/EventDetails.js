import React, { useState, useEffect } from 'react';
import api from '../../api';
import eventBanner from '../../assets/images/newsroom/events.png';
import ContactCTA from '../../components/home/ContactCTA';
import { Link, useParams } from 'react-router-dom';

const EventDetails = () => {
  const [eventItem, setEventItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // get event ID from route

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/events');
        const foundEvent = res.data.find((e) => String(e.id) === String(id));
        setEventItem(foundEvent || null);
      } catch (err) {
        setError('Unable to load event information at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) {
    return <div className="text-center py-16 text-gray-500 text-lg">Loading event information…</div>;
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
        <img src={eventBanner} alt="Events Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute inset-0 container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Event Details</h1>
          <div className="flex items-center text-white text-sm">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <span className="mx-2">›</span>
            <span>Event Details</span>
          </div>
        </div>
      </section>


      {/* Main Content */}
<main className="pb-16 flex-grow bg-white">
  <div className="max-w-7xl mx-auto px-4">
    {!eventItem ? (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Event not found.</p>
      </div>
    ) : (
      <article
        key={eventItem.id}
        className="w-full lg:w-2/3 mx-auto flex flex-col items-center text-center border-b pb-10"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {eventItem.title || "Untitled Event"}
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          {formatDate(eventItem.event_date)} &nbsp; | &nbsp;
          <span className="text-green-600 font-medium capitalize">
            {eventItem.status}
          </span>
        </p>
        <p className="text-gray-600 mb-4 max-w-2xl">
          {eventItem.content}
        </p>
        {eventItem.file && (
          <img
            src={`https://petstream.in${eventItem.file}`}
            alt=""
            className="w-full max-w-3xl h-80 object-cover rounded-md"
          />
        )}
      </article>
    )}
  </div>
</main>


      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default EventDetails;
