import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Heart, 
  Search, 
  Trash2, 
  Eye, 
  User,
  Package,
  Calendar,
  X
} from 'lucide-react';
import { 
  fetchFavorites, 
  deleteFavorite,
  selectFavorites, 
  selectFavoritesLoading,
  selectFavoritesError,
  selectFavoritesPagination
} from '../store/slices/favoritesSlice';
import Pagination from '../components/Pagination';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formateDate';

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const loading = useSelector(selectFavoritesLoading);
  const error = useSelector(selectFavoritesError);
  const pagination = useSelector(selectFavoritesPagination);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchFavorites({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (favorite) => {
    setSelectedFavorite(favorite);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFavorite) {
      try {
        await dispatch(deleteFavorite(selectedFavorite._id)).unwrap();
        toast.success('Favorite deleted successfully');
        setShowDeleteModal(false);
        setSelectedFavorite(null);
        // Refresh favorites if current page becomes empty
        if (favorites.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          dispatch(fetchFavorites({ page: currentPage, limit }));
        }
      } catch (error) {
        toast.error(error || 'Failed to delete favorite');
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFavorite(null);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  // Filter favorites based on search term
  const filteredFavorites = favorites.filter(favorite => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const product = favorite.product;
    const userName = favorite.user?.name || favorite.user?.email || 'Unknown User';
    
    return (
      product?.title?.toLowerCase().includes(searchLower) ||
      product?.subDescription?.toLowerCase().includes(searchLower) ||
      userName.toLowerCase().includes(searchLower) ||
      product?.category?.name?.toLowerCase().includes(searchLower)
    );
  });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Favorites</h1>
        <p className="font-montserrat-regular-400 text-black-light">Manage customer favorite items</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <FormInput
          type="text"
          placeholder="Search by product name, user, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-montserrat-medium-500">{error}</p>
        </div>
      )}

      {/* Favorites Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-black-light font-montserrat-regular-400">Loading favorites...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="p-8 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">
              {searchTerm ? 'No favorites found' : 'No Favorites Yet'}
            </h3>
            <p className="font-montserrat-regular-400 text-black-light">
              {searchTerm ? 'Try adjusting your search terms' : 'Customer favorites will appear here'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-montserrat-semibold-600 text-black-light uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-montserrat-semibold-600 text-black-light uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-montserrat-semibold-600 text-black-light uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-montserrat-semibold-600 text-black-light uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-montserrat-semibold-600 text-black-light uppercase tracking-wider">
                      Added Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-montserrat-semibold-600 text-black-light uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFavorites.map((favorite) => {
                    const product = favorite.product;
                    const user = favorite.user;
                    
                    return (
                      <tr key={favorite._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-primary-light">
                              {product?.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product?.title || 'Product'}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-montserrat-semibold-600 text-black">
                                {product?.title || 'N/A'}
                              </div>
                              {product?.subDescription && (
                                <div className="text-xs text-black-light font-montserrat-regular-400 mt-1 line-clamp-1">
                                  {product.subDescription}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-montserrat-medium-500 text-black">
                                {user?.name || 'Unknown User'}
                              </div>
                              {user?.email && (
                                <div className="text-xs text-black-light font-montserrat-regular-400">
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-montserrat-medium-500 bg-primary-light text-primary rounded-full">
                            {product?.category?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-montserrat-semibold-600 text-black">
                            ${product?.price?.toFixed(2) || '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-black-light font-montserrat-regular-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(favorite.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-montserrat-medium-500">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewProduct(product)}
                              className="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors"
                              title="View Product"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(favorite)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Favorite"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Favorite"
        message={`Are you sure you want to remove this favorite? This action cannot be undone.`}
        itemName={selectedFavorite?.product?.title || 'this favorite'}
      />

      {/* Product View Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseProductModal}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black">Product Details</h3>
                <button
                  onClick={handleCloseProductModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <img
                    src={selectedProduct.images?.[0] || ''}
                    alt={selectedProduct.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <h4 className="text-xl font-montserrat-semibold-600 text-black mb-2">
                  {selectedProduct.title}
                </h4>
                {selectedProduct.subDescription && (
                  <p className="text-black-light font-montserrat-regular-400 mb-4">
                    {selectedProduct.subDescription}
                  </p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-black-light font-montserrat-medium-500">Price:</span>
                    <span className="text-lg font-montserrat-semibold-600 text-black">
                      ${selectedProduct.price?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black-light font-montserrat-medium-500">Category:</span>
                    <span className="font-montserrat-medium-500 text-black">
                      {selectedProduct.category?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black-light font-montserrat-medium-500">Quantity:</span>
                    <span className="font-montserrat-medium-500 text-black">
                      {selectedProduct.quantity || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
