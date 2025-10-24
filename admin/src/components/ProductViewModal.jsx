import React from 'react';
import { createPortal } from 'react-dom';
import { X, Package, DollarSign, Hash, Tag, Calendar, Image as ImageIcon, Eye, Edit, Sparkles, Droplet, Shield } from 'lucide-react';
import { parseLexicalDescription } from '../helpers/lexicalToHTML';

const ProductViewModal = ({ isOpen, onClose, product, onEdit }) => {
console.log('product :', product);
  if (!isOpen || !product) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            {product.subDescription && (
              <p className="text-gray-600 italic mb-3">{product.subDescription}</p>
            )}
            <div 
              className="text-gray-600 prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: parseLexicalDescription(product.description) }}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            />
          </div>

          {/* Images */}
          {product.images && product.images.length > 0 ? (
            <div>
              <h3 className="font-semibold text-black mb-3">Images ({product.images.length})</h3>
              <div className="grid sm:grid-cols-3 grid-cols-2 gap-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={typeof image === 'string' ? image : image.url || image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-32 object-cover rounded border hover:opacity-90 transition-opacity cursor-pointer"
                    onClick={() => window.open(typeof image === 'string' ? image : image.url || image, '_blank')}
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

          {/* Category and Stone Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Category</span>
              </div>
              <span className="inline-block px-3 py-1 bg-primary-light text-primary-dark rounded-full text-sm">
                {product.category?.name || 'No Category'}
              </span>
            </div>

            {product.stoneType && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-700">Stone Type</span>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-semibold text-purple-900">{product.stoneType.name}</div>
                  {product.stoneType.shape && (
                    <div className="text-sm text-purple-700">Shape: {product.stoneType.shape}</div>
                  )}
                  {product.stoneType.price && (
                    <div className="text-sm text-purple-700">Price: ${product.stoneType.price.toFixed(2)}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Metals */}
          {product.metals && product.metals.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Droplet className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-gray-700">Metal Options</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.metals.map((metal, index) => (
                  <div key={metal._id || index} className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: metal.color }}
                      />
                      <span className="font-semibold text-yellow-900">{metal.name}</span>
                    </div>
                    {metal.purityLevels && metal.purityLevels.length > 0 && (
                      <div className="text-sm text-yellow-700">
                        <span className="font-medium">Purity Levels: </span>
                        {metal.purityLevels.map((pl, idx) => (
                          <span key={pl._id || idx}>
                            {pl.karat}K {idx < metal.purityLevels.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Care Instructions */}
          {product.careInstruction && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-700">Care Instructions</span>
              </div>
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="text-sm text-blue-900 whitespace-pre-wrap">{product.careInstruction}</p>
              </div>
            </div>
          )}

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