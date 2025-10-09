import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Plus, Edit, Trash2, RefreshCw, Eye } from 'lucide-react';
import { clearError, deleteProduct, fetchProducts, createProduct, updateProduct, selectProducts, selectProductsLoading } from '../store/slices/productsSlice';
import { fetchCategories, selectCategories } from '../store/slices/categoriesSlice';
import ProductModal from '../components/ProductModal';
import ProductViewModal from '../components/ProductViewModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  console.log(categories,'-----');
  
  const loading = useSelector(selectProductsLoading);
  
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

  // Fetch products and categories on component mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 50 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchProducts({ page: 1, limit: 50 }));
  };

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
          dispatch(fetchProducts({ page: 1, limit: 50 }));
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
          dispatch(fetchProducts({ page: 1, limit: 50 }));
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
          dispatch(fetchProducts({ page: 1, limit: 50 }));
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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