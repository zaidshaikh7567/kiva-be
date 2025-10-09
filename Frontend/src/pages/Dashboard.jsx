import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Clock, CheckCircle, Eye } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  // Mock user data
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001'
  };

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
    <div className="min-h-screen bg-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-sorts-mill-gloudy text-black mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-black-light font-montserrat-regular-400">
            Manage your account and track your orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat-semibold-600 text-black">
                    My Account
                  </h3>
                  <p className="text-sm font-montserrat-regular-400 text-black-light">
                    Manage your profile
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'orders'
                      ? 'bg-primary-light text-primary'
                      : 'text-black-light hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-montserrat-medium-500">My Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'profile'
                      ? 'bg-primary-light text-primary'
                      : 'text-black-light hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-montserrat-medium-500">Profile</span>
                </button>

                <Link
                  to="/change-password"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-black-light hover:bg-gray-50 transition-colors duration-300"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-montserrat-medium-500">Change Password</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
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
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-6">
                  Profile Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={user.firstName}
                      className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user.lastName}
                      className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={user.phone}
                      className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                      readOnly
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Address
                    </label>
                    <textarea
                      value={user.address}
                      rows={3}
                      className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark font-montserrat-medium-500 transition-colors duration-300">
                    Edit Profile
                  </button>
                  <Link
                    to="/change-password"
                    className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white font-montserrat-medium-500 transition-colors duration-300 text-center"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
