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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
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
      case 'case study':
        return 'bg-orange-100 text-orange-800';
      case 'company news':
        return 'bg-green-100 text-green-800';
      case 'product focus':
        return 'bg-purple-100 text-purple-800';
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

  // Image slider functions
  const nextImage = () => {
    const images = getImages();
  const videos = getVideos();
  const audioFiles = getAudioFiles();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    const images = getImages();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  // Auto-slide functionality (optional)
  useEffect(() => {
    const images = getImages();
    if (images.length > 1 && !isImageModalOpen) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [news, isImageModalOpen]);

  // Prepare media files array - handle both single file and multiple files
  const getMediaFiles = () => {
    let files = [];
    
    // Handle images array
    if (news?.images && Array.isArray(news.images)) {
      files = [...files, ...news.images];
    }
    
    // Handle file field (can be JSON string or single file)
    if (news?.file) {
      try {
        // Try to parse as JSON array
        const parsedFiles = JSON.parse(news.file);
        if (Array.isArray(parsedFiles)) {
          files = [...files, ...parsedFiles];
        } else {
          files.push(news.file);
        }
      } catch (e) {
        // If parsing fails, treat as single file
        files.push(news.file);
      }
    }
    
    return files;
  };

  // Filter only image files for the slider
  const getImages = () => {
    const allFiles = getMediaFiles();
    return allFiles.filter(file => {
      const extension = file.split('.').pop()?.toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
    });
  };

  // Get video files
  const getVideos = () => {
    const allFiles = getMediaFiles();
    return allFiles.filter(file => {
      const extension = file.split('.').pop()?.toLowerCase();
      return ['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension);
    });
  };

  // Get audio files
  const getAudioFiles = () => {
    const allFiles = getMediaFiles();
    return allFiles.filter(file => {
      const extension = file.split('.').pop()?.toLowerCase();
      return ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension);
    });
  };

  // Open image in full-screen modal
  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isImageModalOpen) {
        if (e.key === 'Escape') {
          closeImageModal();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isImageModalOpen]);

  const images = getImages();

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
              {news.category && (
                <div
                  className={`inline-block mb-4 px-4 py-2 text-lg font-semibold rounded-full ${getCategoryColor(
                    news.category
                  )}`}
                >
                  {news.category}
                </div>
              )}

              <h1 className="text-[44px] font-extrabold text-gray-900 mb-3 leading-snug">
                {news.headline || "Untitled News"}
              </h1>

              <div className="text-sm text-gray-500 mb-2">
                {new Date(news.published_date).toLocaleDateString()}
                {news.author && <> • By {news.author}</>}
              </div>
              
              <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: news.content }}>
               
              </p>

              {(news.tag) && (
                <div className="mb-4">
                  <span className="text-base text-gray-700 font-semibold underline">Tags :</span>
                  <div className="inline-flex flex-wrap gap-3 mt-2">
                    {news.tag && news.tag.split(',').map((tags, index) => (
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

              {/* Media Files Section */}
              
              {/* Enhanced Image Slider */}
              {images.length > 0 && (
                <div className="relative mb-6">
                  {/* Main Image Display */}
                  <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
                    <div className="relative group">
                      <img
                        src={`https://petstream.in${images[currentImageIndex]}`}
                        alt={`News image ${currentImageIndex + 1}`}
                        className="w-full h-96 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                        onClick={openImageModal}
                      />
                      
                      {/* Overlay for zoom hint */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Arrows (only show if multiple images) */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                          aria-label="Previous image"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                          aria-label="Next image"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {currentImageIndex + 1} / {images.length}
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30">
                          <div 
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${((currentImageIndex + 1) / images.length) * 100}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Dot Navigation (only show if multiple images) */}
                  {images.length > 1 && (
                    <div className="mt-4">
                      <div className="flex justify-center space-x-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                              index === currentImageIndex 
                                ? 'bg-blue-500 shadow-lg transform scale-125' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Caption */}
                  {images.length > 0 && (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-gray-600">
                        Image {currentImageIndex + 1} of {images.length}
                        {images.length > 1 && " • Click image to view full size"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Video Files Section */}
              {getVideos().length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getVideos().map((video, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden shadow-lg">
                        <video
                          controls
                          className="w-full h-64 object-cover"
                          preload="metadata"
                        >
                          <source src={`https://petstream.in${video}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Files Section */}
              {getAudioFiles().length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Audio Files</h3>
                  <div className="space-y-3">
                    {getAudioFiles().map((audio, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.078-1.343-4.343a1 1 0 010-1.414zM13.828 8.172a1 1 0 011.414 0A5.983 5.983 0 0116 12a5.983 5.983 0 01-.758 2.828 1 1 0 11-1.414-1.414A3.987 3.987 0 0014 12c0-.537-.121-1.045-.342-1.486a1 1 0 010-1.342z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-gray-900">
                              Audio File {index + 1}
                            </p>
                            <audio
                              controls
                              className="w-full mt-2"
                              preload="metadata"
                            >
                              <source src={`https://petstream.in${audio}`} type="audio/mpeg" />
                              Your browser does not support the audio tag.
                            </audio>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      </main>

      {/* Full-Screen Image Modal */}
      {isImageModalOpen && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Image */}
            <img
              src={`https://petstream.in${images[currentImageIndex]}`}
              alt={`News image ${currentImageIndex + 1} - Full size`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Modal Navigation (if multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-3 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-3 transition-all duration-200"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Modal Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ContactCTA />
    </div>
  );
};

export default DetailPage;
