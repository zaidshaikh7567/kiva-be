import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../store/slices/productsSlice';
import { fetchCategories as fetchCategoriesAction } from '../store/slices/categoriesSlice';

const ApiTest = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading, error: productsError } = useSelector(state => state.products);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector(state => state.categories);

  useEffect(() => {
    // Test API calls
    dispatch(fetchProducts());
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Test Component</h1>
      
      {/* Products Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        {productsLoading && <p>Loading products...</p>}
        {productsError && <p className="text-red-500">Error: {productsError}</p>}
        {products && (
          <div>
            <p>Found {products.length} products</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {products.slice(0, 6).map((product) => (
                <div key={product._id || product.id} className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        {categoriesLoading && <p>Loading categories...</p>}
        {categoriesError && <p className="text-red-500">Error: {categoriesError}</p>}
        {categories && (
          <div>
            <p>Found {categories.length} categories</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                <span key={category._id || category.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
