import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Star, 
  Search, 
  Eye, 
  Trash2,
  XCircle,
  Calendar,
  User,
  Mail,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../components/Pagination';
import CustomDropdown from '../components/CustomDropdown';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import {
  selectReviews,
  selectReviewsLoading,
  selectReviewsDeleting,
  selectReviewsPagination,
  fetchReviews,
  deleteReview,
  clearError
} from '../store/slices/reviewsSlice';

const Reviews = () => {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);
  const deleting = useSelector(selectReviewsDeleting);
  const pagination = useSelector(selectReviewsPagination);

  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchReviews({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    const totalPages = pagination?.totalPages;
    if (totalPages && totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [pagination?.totalPages, currentPage]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Filter reviews based on search and rating filter
  const reviewsList = Array.isArray(reviews) ? reviews : [];
  const filteredReviews = reviewsList.filter(review => {
    const matchesSearch = 
      review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesRating;
  });

  // Pagination logic
  const totalRecords = pagination?.totalRecords ?? reviewsList.length;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRatingFilter('all');
    setCurrentPage(1);
  };

  // Calculate statistics (commented out since stats cards are commented)
  // const reviewStats = {
  //   total: reviewsList.length,
  //   averageRating: reviewsList.length > 0
  //     ? (reviewsList.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewsList.length).toFixed(1)
  //     : 0,
  //   fiveStar: reviewsList.filter(r => r.rating === 5).length,
  //   fourStar: reviewsList.filter(r => r.rating === 4).length,
  //   threeStar: reviewsList.filter(r => r.rating === 3).length,
  //   twoStar: reviewsList.filter(r => r.rating === 2).length,
  //   oneStar: reviewsList.filter(r => r.rating === 1).length,
  // };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5:
        return 'bg-green-100 text-green-800';
      case 4:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-orange-100 text-orange-800';
      case 1:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    const result = await dispatch(deleteReview(reviewToDelete._id));

    if (deleteReview.fulfilled.match(result)) {
      toast.success('Review deleted successfully');
      setShowDeleteModal(false);
      setReviewToDelete(null);

      const totalRecordsBefore = pagination?.totalRecords ?? reviewsList.length;
      const adjustedTotalRecords = Math.max(0, totalRecordsBefore - 1);
      const adjustedTotalPages = Math.max(1, Math.ceil(adjustedTotalRecords / itemsPerPage));
      const nextPage = Math.min(currentPage, adjustedTotalPages);

      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      } else {
        dispatch(fetchReviews({ page: nextPage, limit: itemsPerPage }));
      }
    } else {
      toast.error('Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Rating filter options
  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, ratingFilter]);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">     

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type="text"
                placeholder="Search reviews by name, email, or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary !focus:border-primary font-montserrat-regular-400 text-black"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="md:w-48">
            <CustomDropdown
              options={ratingOptions}
              value={ratingFilter}
              onChange={setRatingFilter}
              placeholder="All Ratings"
              className="w-full"
            />
          </div>

          {/* Reset Button */}
          <button 
            onClick={handleResetFilters}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            <RotateCcw className="w-5 h-5 text-black-light" />
            <span className="font-montserrat-medium-500 text-black">Reset</span>
          </button>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || ratingFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-montserrat-medium-500 text-black-light">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-montserrat-medium-500">
                    <Search className="w-4 h-4" />
                    <span>"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-primary-dark transition-colors duration-300"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {ratingFilter !== 'all' && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-montserrat-medium-500">
                    <Star className="w-4 h-4" />
                    <span>{ratingFilter} Star{ratingFilter !== '1' ? 's' : ''}</span>
                    <button
                      onClick={() => setRatingFilter('all')}
                      className="ml-1 hover:text-primary-dark transition-colors duration-300"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-sm font-montserrat-medium-500 text-primary hover:text-primary-dark transition-colors duration-300"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && reviews && reviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 font-montserrat-regular-400 text-black-light">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">No Reviews Found</h3>
            <p className="font-montserrat-regular-400 text-black-light">
              {searchTerm || ratingFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No reviews have been submitted yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-light">
                  <tr className=" text-black">
                    <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 ">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 ">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 ">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 ">Comment</th>
                    <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600  min-w-[230px]">Created At</th>
                    {/* <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600  min-w-[200px]">Updated At</th> */}
                    <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 ">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 min-w-8 min-h-8 bg-primary-light rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 min-w-5 min-h-5 text-primary" />
                          </div>
                          <span className="font-montserrat-medium-500 text-black text-sm">{review.name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-montserrat-regular-400 text-black">{review.email || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating || 0)}
                          {/* <span className={`px-2 py-1 rounded-full text-xs font-montserrat-medium-500 ${getRatingColor(review.rating || 0)}`}>
                            {review.rating || 0}
                          </span> */}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-montserrat-regular-400 text-black-light max-w-md truncate">
                          {review.comment || 'No comment'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-black-light" />
                          <span className="font-montserrat-regular-400 text-black text-sm">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4">
                      
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-black-light" />
                          <span className="font-montserrat-regular-400 text-black text-sm">
                            {review.updatedAt ? formatDate(review.updatedAt) : "-"}
                          </span>
                        </div>
                      </td> */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleViewReview(review)}
                            className="flex items-center space-x-1 px-2 py-2 text-sm font-montserrat-medium-500 text-primary hover:bg-primary-light rounded-lg transition-colors duration-300"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(review)}
                            className="flex items-center space-x-1 px-2 py-2 text-sm font-montserrat-medium-500 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalRecords}
          itemsPerPage={pagination?.limit ?? itemsPerPage}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      )}

      {/* Review Details Modal */}
      {showReviewModal && selectedReview && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                  Review Details
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  <XCircle className="w-6 h-6 text-black-light" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-black-light" />
                    <span className="font-montserrat-medium-500 text-black">{selectedReview.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-black-light" />
                    <span className="font-montserrat-regular-400 text-black">{selectedReview.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Rating</h3>
                <div className="flex items-center space-x-3">
                  {renderStars(selectedReview.rating || 0)}
                  <span className={`px-3 py-1 rounded-full text-sm font-montserrat-medium-500 ${getRatingColor(selectedReview.rating || 0)}`}>
                    {selectedReview.rating || 0} Stars
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Review Comment</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-montserrat-regular-400 text-black-light leading-relaxed">
                    {selectedReview.comment || 'No comment provided'}
                  </p>
                </div>
              </div>

              {/* Media */}
              {(() => {
                const mediaItems = Array.isArray(selectedReview.media)
                  ? selectedReview.media
                  : selectedReview.media
                  ? [selectedReview.media]
                  : [];
                if (!mediaItems.length) return null;
                return (
                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Attached Media</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {mediaItems.map((mediaItem, index) => (
                      <div key={mediaItem.publicId || mediaItem.url || index} className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200">
                        {mediaItem.type === 'video' ? (
                          <video
                            src={mediaItem.url}
                            controls
                            className="w-full rounded-lg bg-black"
                          />
                        ) : (
                          <img
                            src={mediaItem.url}
                            alt={`Review media ${index + 1} from ${selectedReview.name}`}
                            className="w-full rounded-lg object-cover"
                          />
                        )}
                        <div className="mt-3 flex items-center justify-between text-xs font-montserrat-regular-400 text-black-light">
                          <span className="capitalize">{mediaItem.type}</span>
                          <a
                            href={mediaItem.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-montserrat-medium-500 hover:text-primary-dark"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })()}

              {/* Date */}
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Date</h3>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-black-light" />
                  <span className="font-montserrat-regular-400 text-black">{formatDate(selectedReview.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && reviewToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setReviewToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Review"
          message={`Are you sure you want to delete the review from ${reviewToDelete.name || 'this user'}?`}
          loading={deleting}
          itemName={reviewToDelete.name || 'Anonymous'}
          itemType="review"
        />
      )}
    </div>
  );
};

export default Reviews;
