import React from 'react';
import { createPortal } from 'react-dom';
import { X, Package, DollarSign, Hash, Tag, Calendar, Image as ImageIcon, Eye, Edit } from 'lucide-react';

const ProductViewModal = ({ isOpen, onClose, product, onEdit }) => {
  if (!isOpen || !product) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to parse Lexical JSON and convert to HTML
  const parseLexicalDescription = (description) => {
    if (!description) return 'No description available';
    
    try {
      // If it's already HTML, return as is
      if (typeof description === 'string' && description.includes('<')) {
        return description;
      }
      
      // If it's a Lexical JSON string, parse it
      if (typeof description === 'string') {
        const parsed = JSON.parse(description);
        if (parsed.root && parsed.root.children) {
          // Convert Lexical nodes to HTML
          const textContent = parsed.root.children
            .map(child => {
              if (child.children) {
                return child.children.map(c => c.text || '').join('');
              }
              return child.text || '';
            })
            .join('\n');
          return textContent.replace(/\n/g, '<br>');
        }
      }
      
      return description;
    } catch (error) {
      console.error('Error parsing description:', error);
      return description || 'No description available';
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Product Details</h2>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(product);
                  onClose();
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Title */}
          <div>
            <h1 className="text-2xl font-bold text-black capitalize mb-2">
              {product.title || 'Untitled Product'}
            </h1>
            <div 
              className="text-gray-600 prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: parseLexicalDescription(product.description) }} 
            />
              {/* {product.description || 'No description available'} */}
            {/* </p> */}
          </div>

          {/* Images */}
          {product.images && product.images.length > 0 ? (
            <div>
              <h3 className="font-semibold text-black mb-3">Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No images available</p>
            </div>
          )}

          {/* Product Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-700">Price</span>
              </div>
              <p className="text-xl font-bold text-green-600">
                ${product.price?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <Hash className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-700">Quantity</span>
              </div>
              <p className="text-xl font-bold text-blue-600">
                {product.quantity || 0}
              </p>
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Category</span>
            </div>
            <span className="inline-block px-3 py-1 bg-primary-light text-primary-dark rounded-full text-sm">
              {product.category?.name || 'No Category'}
            </span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Created</span>
              </div>
              <p className="text-sm text-gray-600">
                {product.createdAt ? formatDate(product.createdAt) : 'Unknown'}
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Updated</span>
              </div>
              <p className="text-sm text-gray-600">
                {product.updatedAt ? formatDate(product.updatedAt) : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Product ID */}
          <div>
            <span className="text-sm font-medium text-gray-700">Product ID:</span>
            <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1">
              {product._id || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          {onEdit && (
            <button
              onClick={() => {
                onEdit(product);
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Product
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductViewModal;