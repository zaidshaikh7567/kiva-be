import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { clearError, deleteCategory, fetchCategories, createCategory, updateCategory, selectCategoriesLoading } from '../store/slices/categoriesSlice';
import CategoryModal from '../components/CategoryModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { selectAllProducts, fetchProducts } from '../store/slices/productsSlice';


const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.categories);
  const loading = useSelector(selectCategoriesLoading);
  const products = useSelector(selectAllProducts);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);


  const handleRefresh = () => {
    dispatch(fetchCategories());
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const result = await dispatch(deleteCategory(categoryToDelete._id || categoryToDelete.id));
        if (deleteCategory.fulfilled.match(result)) {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
          dispatch(fetchCategories())
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleOpenEditModal = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setModalMode('add');
    dispatch(clearError());
  };

  const handleSubmitCategory = async (data) => {
    if (modalMode === 'add') {
      // Add mode
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.parentId) {
        formData.append('parentId', data.parentId);
      }
      if (data.image) {
        formData.append('image', data.image);
      }
      
      try {
        const result = await dispatch(createCategory(formData));
        if (createCategory.fulfilled.match(result)) {
          setIsModalOpen(false);
          setSelectedCategory(null);
          setModalMode('add');
          dispatch(fetchCategories())
        }
      } catch (error) {
        console.error('Error creating category:', error);
      }
    } else {
      // Edit mode
      // Create FormData for update as well
      const formData = new FormData();
      formData.append('name', data.data.name);
      if (data.data.parentId) {
        formData.append('parentId', data.data.parentId);
      }
      if (data.data.image) {
        formData.append('image', data.data.image);
      }
      
      try {
        const result = await dispatch(updateCategory({ id: data.id, data: formData }));
        if (updateCategory.fulfilled.match(result)) {
          setIsModalOpen(false);
          setSelectedCategory(null);
          setModalMode('add');
        }
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };

  // Helper function to calculate product count for a category
  const getProductCount = (categoryId) => {
    if (!products || !Array.isArray(products)) return 0;
    const matchingProducts = products.filter(product => {
      const productCategoryId = product.category?._id || product.categoryId;
      return productCategoryId === categoryId;
    });
    if (matchingProducts.length > 0) {
      console.log(`Category ${categoryId} has ${matchingProducts.length} products:`, matchingProducts.map(p => p.title));
    }
    return matchingProducts.length;
  };

  // Show loading state
  if (loading && categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
              Categories
            </h1>
            <p className="font-montserrat-regular-400 text-black-light">
              Organize your jewelry products
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="font-montserrat-regular-400 text-black-light">
              Loading categories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-row items-center justify-end gap-2">
        {/* <div>
          <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
            Categories
          </h1>
          <p className="font-montserrat-regular-400 text-black-light">
            Organize your jewelry products
          </p>
        </div> */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
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
            <span>Add Category</span>
          </button>
        </div>
      </div>


      {/* Categories List - Hierarchical View */}
      <div className="space-y-4">
        {categories?.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">
              No Categories Found
            </h3>
            <p className="font-montserrat-regular-400 text-black-light mb-4">
              Get started by creating your first category
            </p>
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </div>
        ) : (
          // Show only main categories with their sub-categories
          categories
            .filter(category => !category?.parent) // Only main categories
            .map((mainCategory) => {
            // console.log('mainCategory :', mainCategory);
              // Find sub-categories for this main category
              const subCategories = categories?.filter(cat => 
                cat?.parent && cat?.parent?._id === mainCategory?._id
              );
              // console.log('categories()()(()(()()))(()()) :', categories);
              // console.log('subCategories()())() :', subCategories);

              // Get product count for main category
              const mainCategoryProductCount = getProductCount(mainCategory?._id);
              // console.log('mainCategoryProductCount :', mainCategoryProductCount);
              
              // Get product count for all subcategories combined
              const totalSubCategoryProductCount = subCategories.reduce((total, subCat) => {
                const count = getProductCount(subCat?._id);
                // console.log(`SubCategory ${subCat.name} (${subCat._id}): ${count} products`);
                return total + count;
              }, 0);
              
              // console.log('totalSubCategoryProductCount :', totalSubCategoryProductCount);
              // console.log('Total (main + sub):', mainCategoryProductCount + totalSubCategoryProductCount);

              return (
                <div key={mainCategory?._id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Main Category Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center overflow-hidden">
                          {mainCategory?.image ? (
                            <img 
                              src={mainCategory?.image} 
                              alt={mainCategory?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-sorts-mill-gloudy font-bold text-black capitalize">
                            {mainCategory?.name} ({subCategories?.length > 0 ? totalSubCategoryProductCount : mainCategoryProductCount})
                          </h3>
                          {subCategories?.length > 0 && (
                          <p className="text-sm font-montserrat-regular-400 text-black-light">
                            {subCategories?.length} sub-categories • {totalSubCategoryProductCount} products
                          </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-montserrat-medium-500 rounded-full">
                          Main Category
                        </span>
                        <button 
                          onClick={() => handleOpenEditModal(mainCategory)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(mainCategory)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sub Categories */}
                  {subCategories?.length > 0 && (
                    <div className="p-6 bg-secondary rounded-b-xl">
                      <h4 className="text-sm font-montserrat-semibold-600 text-black-light mb-4">
                        Sub Categories ({subCategories?.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                        {subCategories?.map((subCategory) => (
                          <div key={subCategory?._id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                            {/* Category Image */}
                            {subCategory?.image && (
                              <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-50">
                                <img 
                                  src={subCategory?.image} 
                                  alt={subCategory?.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-sorts-mill-gloudy font-bold text-black capitalize">
                                {subCategory?.name}
                              </h5>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => handleOpenEditModal(subCategory)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCategory(subCategory)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-montserrat-medium-500 text-black-light">
                                {getProductCount(subCategory?._id)} products
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-montserrat-medium-500 rounded-full">
                                Sub Category
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>

      {/* Unified Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCategory}
        loading={loading}
        categoryData={selectedCategory}
        mode={modalMode}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        itemName={categoryToDelete?.name}
        itemType="category"
      />
    </div>
  );
};

export default Categories;
