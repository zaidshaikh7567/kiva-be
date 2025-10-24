import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Clock, CheckCircle, Eye, Edit2, Save, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, selectAuthLoading, selectAuthError, selectAuthSuccess, updateUserProfile, clearError, clearSuccess } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
      setIsEditing(false);
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    dispatch(updateUserProfile(formData));
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };
  // Mock user data
  // const user = {
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   email: 'john.doe@example.com',
  //   phone: '+1 (555) 123-4567',
  //   address: '123 Main Street, New York, NY 10001'
  // };

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
            Welcome back, {user?.name}!
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-sorts-mill-gloudy text-black">
                    Profile Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors duration-300"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                        // required
                        readOnly
                      />
                    </div>

                    {/* <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div> */}

                    {/* <div>
                      <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div> */}
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark font-montserrat-medium-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex items-center space-x-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-montserrat-medium-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </form>

                {!isEditing && (
                  <div className="mt-6">
                    <Link
                      to="/change-password"
                      className="inline-flex items-center space-x-2 border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white font-montserrat-medium-500 transition-colors duration-300"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Change Password</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
