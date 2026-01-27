import React from 'react';
import { createPortal } from 'react-dom';
import { X, Gem, Edit } from 'lucide-react';

const CenterStoneViewModal = ({ isOpen, onClose, centerStone, onEdit }) => {
  if (!isOpen || !centerStone) return null;
  const handleEdit = () => {
    onEdit(centerStone);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <Gem className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                {centerStone.name}
              </h2>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                Center Stone Details
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-montserrat-medium-500"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-black-light" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            {/* Center Stone Information */}
            <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 rounded-xl p-8 border border-primary/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <Gem className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-2">
                {centerStone.name}
              </h3>
              <div className="text-4xl font-sorts-mill-gloudy font-bold text-primary mb-2">
                ${centerStone.price?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                Price per center stone
              </p>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mt-6">
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-4">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-montserrat-medium-500 text-black-light">Name:</span>
                  <span className="font-montserrat-semibold-600 text-black">{centerStone.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-montserrat-medium-500 text-black-light">Category:</span>
                  <span className="font-montserrat-semibold-600 text-black capitalize">
                    {centerStone.shape}
                    {/* {(() => {
                      const categoryObj = categories.find(cat => cat._id === centerStone.category._id);
                      return categoryObj ? categoryObj.name : 'N/A';
                    })()} */}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-montserrat-medium-500 text-black-light">Price:</span>
                  <span className="font-montserrat-semibold-600 text-primary">${centerStone.price?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-montserrat-medium-500 text-black-light">Status:</span>
                  <span className={`inline-flex px-3 py-1 text-sm font-montserrat-medium-500 rounded-full ${
                    centerStone.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {centerStone.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="block sm:flex items-center justify-end  p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6   sm:w-auto w-full py-3 border border-gray-200 rounded-lg font-montserrat-medium-500 text-black-light hover:bg-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleEdit}
            className="sm:ml-2 sm:mt-0 mt-2 sm:w-auto w-full flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-montserrat-medium-500"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Center Stone</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CenterStoneViewModal;
