import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Plus, Edit, Trash2, RefreshCw, Eye, Search, Filter, X } from 'lucide-react';
import { clearError, deleteProduct, fetchProducts, createProduct, updateProduct, selectProducts, selectProductsLoading, selectProductsPagination, selectProductsFilters, setFilters, applyFilters, clearFilters } from '../store/slices/productsSlice';
import { fetchCategories, selectCategories } from '../store/slices/categoriesSlice';
import ProductModal from '../components/ProductModal';
import ProductViewModal from '../components/ProductViewModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Pagination from '../components/Pagination';
import CustomDropdown from '../components/CustomDropdown';

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsPagination = useSelector(selectProductsPagination);
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectProductsFilters);
  
  const loading = useSelector(selectProductsLoading);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);

  // Filter options
  const stockFilterOptions = [
    { value: 'all', label: 'All Stock' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock (< 10)' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-asc', label: 'Price Low to High' },
    { value: 'price-desc', label: 'Price High to Low' },
    { value: 'stock-asc', label: 'Stock Low to High' },
    { value: 'stock-desc', label: 'Stock High to Low' },
  ];

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Apply filters whenever filters change
  useEffect(() => {
    dispatch(applyFilters());
  }, [dispatch, filters]);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter handlers
  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (value) => {
    dispatch(setFilters({ category: value }));
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (field, value) => {
    const filterKey = field === 'min' ? 'minPrice' : 'maxPrice';
    dispatch(setFilters({ [filterKey]: value }));
    setCurrentPage(1);
  };

  const handleStockFilterChange = (value) => {
    dispatch(setFilters({ stockFilter: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    dispatch(setFilters({ sortBy: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.minPrice || filters.maxPrice || filters.stockFilter !== 'all' || filters.sortBy !== 'newest';

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        const result = await dispatch(deleteProduct(productToDelete._id));
        if (deleteProduct.fulfilled.match(result)) {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
          // If deleting the last item on a page (and not on page 1), go to previous page
          if (products.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            dispatch(fetchProducts({ page: currentPage, limit }));
          }
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // View modal handlers
  const handleOpenViewModal = (product) => {
    setProductToView(product);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setProductToView(null);
  };

  const handleEditFromView = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalMode('add');
    dispatch(clearError());
  };

  const handleSubmitProduct = async (data) => {
    if (modalMode === 'add') {
      // Add mode
      try {
        const result = await dispatch(createProduct(data));
        if (createProduct.fulfilled.match(result)) {
          setIsModalOpen(false);
          setSelectedProduct(null);
          setModalMode('add');
          // Go to first page to see the newly added product
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error creating product:', error);
      }
    } else {
      // Edit mode
      try {
        const result = await dispatch(updateProduct(data));
        if (updateProduct.fulfilled.match(result)) {
          setIsModalOpen(false);
          setSelectedProduct(null);
          setModalMode('add');
          // Refresh current page to see the updated product
          dispatch(fetchProducts({ page: currentPage, limit }));
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  // Show loading state
  if (loading && products.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
              Products
            </h1>
            <p className="font-montserrat-regular-400 text-black-light">
              Manage your jewelry products
            </p>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-montserrat-regular-400 text-black-light">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
            Products
          </h1>
          <p className="font-montserrat-regular-400 text-black-light">
            Manage your jewelry products
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors font-montserrat-medium-500 ${
              showFilters || hasActiveFilters 
                ? 'border-primary bg-primary text-white' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-white text-primary text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-montserrat-medium-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-montserrat-semibold-600 text-black">Filters</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={handleSearchChange}
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-montserrat-regular-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Category
              </label>
              <CustomDropdown
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...[...categories]
                    .sort((a, b) => {
                      // Sort parent categories first, then children
                      if (!a.parent && b.parent) return -1;
                      if (a.parent && !b.parent) return 1;
                      return a.name.localeCompare(b.name);
                    })
                    .map(cat => {
                      // Find parent category name if exists
                      const parentCat = cat.parent ? categories.find(c => c._id === cat.parent) : null;
                      const label = parentCat ? `${parentCat.name} - ${cat.name}` : cat.name;
                      
                      return {
                        value: cat._id || cat.id || cat.name,
                        label: label
                      };
                    })
                ]}
                value={filters.category}
                onChange={handleCategoryChange}
                placeholder="Select Category"
                searchable={true}
              />
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Stock Status
              </label>
              <CustomDropdown
                options={stockFilterOptions}
                value={filters.stockFilter}
                onChange={handleStockFilterChange}
                placeholder="Select Stock Status"
                searchable={false}
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Sort By
              </label>
              <CustomDropdown
                options={sortOptions}
                value={filters.sortBy}
                onChange={handleSortChange}
                placeholder="Sort By"
                searchable={false}
              />
            </div>

            {/* Price Range */}
            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-montserrat-regular-400"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-montserrat-regular-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-montserrat-medium-500 text-black">Active filters:</span>
                {filters.search && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-white text-sm rounded-full">
                    Search: "{filters.search}"
                    <button
                      onClick={() => dispatch(setFilters({ search: '' }))}
                      className="ml-2 hover:text-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.category !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-white text-sm rounded-full">
                    Category: {(() => {
                      const selectedCat = categories.find(cat => (cat._id || cat.id || cat.name) === filters.category);
                      if (!selectedCat) return filters.category;
                      const parentCat = selectedCat.parent ? categories.find(c => c._id === selectedCat.parent) : null;
                      return parentCat ? `${parentCat.name} - ${selectedCat.name}` : selectedCat.name;
                    })()}
                    <button
                      onClick={() => dispatch(setFilters({ category: 'all' }))}
                      className="ml-2 hover:text-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-white text-sm rounded-full">
                    Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                    <button
                      onClick={() => dispatch(setFilters({ minPrice: '', maxPrice: '' }))}
                      className="ml-2 hover:text-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.stockFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-white text-sm rounded-full">
                    Stock: {stockFilterOptions.find(opt => opt.value === filters.stockFilter)?.label}
                    <button
                      onClick={() => dispatch(setFilters({ stockFilter: 'all' }))}
                      className="ml-2 hover:text-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}


      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {products.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">
              No Products Found
            </h3>
            <p className="font-montserrat-regular-400 text-black-light mb-4">
              Get started by creating your first product
            </p>
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-primary-light border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Images
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 
                            onClick={() => handleOpenViewModal(product)}
                            className="text-sm font-montserrat-medium-500 font-bold text-black capitalize cursor-pointer hover:text-primary transition-colors truncate"
                          >
                            {product.title || 'Unnamed Product'}
                          </h3>
                          {/* <p className="text-xs font-montserrat-regular-400 text-black-light truncate">
                            {product.description || 'No description'}
                          </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-montserrat-medium-500 text-black capitalize">
                        {product.category?.name || 'No category'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-montserrat-semibold-600 text-primary">
                        ${product.price?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-montserrat-medium-500 text-black">
                        {product.quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-montserrat-medium-500 text-black-light">
                        {product.images?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 bg-green-100 text-green-800 text-xs font-montserrat-medium-500 rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleOpenViewModal(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
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
        )}
      </div>

      {/* Pagination */}
      {productsPagination && productsPagination.pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={productsPagination.pages}
          totalItems={productsPagination.total}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}

      {/* Unified Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProduct}
        loading={loading}
        productData={selectedProduct}
        mode={modalMode}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemName={productToDelete?.title}
        itemType="product"
      />

      {/* Product View Modal */}
      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        product={productToView}
        onEdit={handleEditFromView}
      />
    </div>
  );
};

export default Products;