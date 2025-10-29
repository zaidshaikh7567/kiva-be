import React from 'react';
import { Package, Clock, CheckCircle, Eye } from 'lucide-react';

const OrdersList = () => {
  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'Diamond Ring', quantity: 1, price: 299.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '123 Main Street, New York, NY 10001',
        method: 'Standard Shipping'
      }
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 199.99,
      items: [
        { name: 'Gold Earrings', quantity: 1, price: 199.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '123 Main Street, New York, NY 10001',
        method: 'Express Shipping'
      }
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'processing',
      total: 149.99,
      items: [
        { name: 'Silver Bracelet', quantity: 1, price: 149.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '123 Main Street, New York, NY 10001',
        method: 'Standard Shipping'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Package className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-6">
          My Orders
        </h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-primary-light rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-montserrat-semibold-600 text-black">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm font-montserrat-regular-400 text-black-light">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-montserrat-medium-500 flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                  <span className="text-lg font-montserrat-semibold-600 text-black">
                    ${order.total}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-montserrat-semibold-600 text-black mb-2">
                    Items
                  </h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-montserrat-medium-500 text-black">
                          {item.name}
                        </p>
                        <p className="text-sm font-montserrat-regular-400 text-black-light">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-montserrat-semibold-600 text-black mb-2">
                    Shipping
                  </h4>
                  <p className="text-sm font-montserrat-regular-400 text-black-light mb-1">
                    {order.shipping.address}
                  </p>
                  <p className="text-sm font-montserrat-regular-400 text-black-light">
                    {order.shipping.method}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-primary-light">
                <button className="flex items-center space-x-2 text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors duration-300">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                {order.status === 'delivered' && (
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-montserrat-medium-500 transition-colors duration-300">
                    Reorder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
