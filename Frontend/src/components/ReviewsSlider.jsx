import React, { useState, useEffect, useRef } from 'react';
import { Star, Send, User, Calendar, X, Plus, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { 
  selectReviews, 
  fetchReviews, 
  addReview,
  selectReviewsLoading,
  selectReviewsSubmitting,
  clearSuccess
} from '../store/slices/reviewsSlice';
import { selectAuthUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const ReviewsSlider = () => {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);
  const submitting = useSelector(selectReviewsSubmitting);
  const user = useSelector(selectAuthUser);
  
  const reviewSectionRef = useRef(null);
  const isScrollingRef = useRef(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  // Check if URL has #reviews hash and scroll to reviews section
  useEffect(() => {
    if (window.location.hash === '#reviews') {
      isScrollingRef.current = true;
      setTimeout(() => {
        const element = reviewSectionRef.current;
        if (element) {
          // Calculate responsive offset based on screen size
          const isMobile = window.innerWidth < 640;
          const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
          const yOffset = isMobile ? -60 : isTablet ? -80 : 400;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
          
          // Reset scrolling flag after scroll completes
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 1200);
        }
      }, 500);
    }
  }, []);

  // Add intersection observer to update URL when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Don't update URL during programmatic scrolling
          if (isScrollingRef.current) {
            return;
          }

          if (entry.isIntersecting) {
            // Update URL with #reviews hash when section is visible
            if (window.location.hash !== '#reviews') {
              window.history.replaceState(null, '', '#reviews');
            }
          } else {
            // Remove #reviews from URL when section is not visible
            if (window.location.hash === '#reviews') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '-80px 0px', // Negative margin to account for header/nav (responsive)
      }
    );

    const currentRef = reviewSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Display mock reviews if no reviews exist
  const displayReviews = reviews.length > 0 ? reviews : [
    {
      _id: '1',
      name: 'Emily Johnson',
      rating: 5,
      comment: 'Absolutely stunning jewelry! The craftsmanship is exceptional and the customer service was outstanding.',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      _id: '2',
      name: 'Michael Chen',
      rating: 5,
      comment: 'I ordered a custom ring for my wife and it exceeded all expectations. Highly recommend!',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: '3',
      name: 'Sarah Williams',
      rating: 4,
      comment: 'Fast shipping, gorgeous pieces, and attention to detail. Will definitely order again.',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  // Custom arrow components
  const NextArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary/90 hover:bg-primary-dark text-primary sm:p-3 p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next review"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary/90 hover:bg-primary-dark text-primary sm:p-3 p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous review"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
    );
  };

  // Custom Dot Component
  const CustomDot = ({ index }) => {
    const isActive = currentSlide === index;
    return (
      <button
        type="button"
        onClick={() => sliderRef?.slickGoTo(index)}
        className={`transition-all duration-300 ${
          isActive ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'
        } h-2 rounded-full`}
        aria-label={`Go to slide ${index + 1}`}
      />
    );
  };

  // Slider settings
  const sliderSettings = {
    dots: false, // Hide default dots - we'll add custom ones
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    cssEase: "ease-in-out",
    ref: setSliderRef,
    beforeChange: (_current, next) => {
      setCurrentSlide(next);
    },
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const reviewData = {
      name: formData.name,
      email: formData.email,
      rating,
      comment: formData.comment,
      userId: user?._id || null
    };

    const result = await dispatch(addReview(reviewData));

    if (addReview.fulfilled.match(result)) {
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setFormData({ name: '', email: '', comment: '' });
      setRating(5);
      dispatch(clearSuccess());
    } else {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setShowReviewForm(false);
    setFormData({ name: '', email: '', comment: '' });
    setRating(5);
    setErrors({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleShare = async () => {
    const currentUrl = window.location.origin + window.location.pathname + '#reviews';
    
    // Try to use native share API if available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out these customer reviews!',
          text: 'See what our customers are saying about Aurora Jewelry',
          url: currentUrl,
        });
      } catch {
        // User cancelled or error occurred, fall back to copy
        copyToClipboard(currentUrl);
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(currentUrl);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      toast.success('Review link copied to clipboard!');
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div id="reviews" ref={reviewSectionRef} className="relative bg-gradient-to-br from-primary-light via-white to-secondary py-12 sm:py-16 md:py-20 px-4 sm:px-6 scroll-mt-[100px] sm:scroll-mt-[120px] md:scroll-mt-[140px]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy font-bold text-black">
              What Our Customers Say
            </h2>
            <button
              onClick={handleShare}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 text-primary hover:text-primary-dark relative z-10"
              title="Share reviews"
              aria-label="Share this review section"
            >
              {shareCopied ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              ) : (
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          <p className="text-sm sm:text-base md:text-lg font-montserrat-regular-400 text-black-light max-w-2xl mx-auto px-4">
            Don't just take our word for it - hear from our satisfied customers
          </p>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Reviews Slider */}
        {!loading && displayReviews.length > 0 && (
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
            <div className="relative bg-white shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl py-8 sm:py-12 md:py-16">
              <Slider {...sliderSettings}>
                {displayReviews.map((review, index) => (
                  <div 
                    key={review._id || index}
                    className="min-w-full flex items-center justify-center"
                  >
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8">
                      {/* Stars */}
                      <div className="flex justify-center space-x-1 mb-4 sm:mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-montserrat-regular-400 text-black-light leading-relaxed mb-6 sm:mb-8 italic px-2">
                        "{review.comment}"
                      </p>

                      {/* Author Info */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="text-center sm:text-left">
                            <h4 className="font-montserrat-semibold-600 text-black text-base sm:text-lg">
                              {review.name}
                            </h4>
                            <p className="text-xs sm:text-sm font-montserrat-regular-400 text-black-light flex items-center justify-center sm:justify-start space-x-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatDate(review.createdAt)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>

              {/* Custom Dots Pagination */}
              {displayReviews.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10" role="tablist">
                  {displayReviews.map((_, index) => (
                    <CustomDot key={index} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Review Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => setShowReviewForm(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-montserrat-semibold-600 hover:from-primary-dark hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 md:p-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-sorts-mill-gloudy font-bold text-black">
                  Write a Review
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-black-light" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
                    Rating *
                  </label>
                  <div className="flex space-x-1 sm:space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform duration-200 hover:scale-125"
                      >
                        <Star
                          className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-sm sm:text-base ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-primary focus:border-transparent'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-sm sm:text-base ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-primary focus:border-transparent'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Your Review *
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-sm sm:text-base resize-none ${
                      errors.comment
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-primary focus:border-transparent'
                    }`}
                    placeholder="Share your experience with us..."
                  />
                  {errors.comment && (
                    <p className="mt-1 text-sm text-red-500">{errors.comment}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 sm:py-4 rounded-lg font-montserrat-semibold-600 hover:from-primary-dark hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Add animations and custom slider styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(50px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Custom Slick Slider Styles */
        .slick-slide > div {
          min-height: 100%;
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
        .slick-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default ReviewsSlider;