import React, { useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, Gem, Zap, Diamond } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUsers } from '../store/slices/usersSlice';
import { fetchProducts, selectAllProducts } from '../store/slices/productsSlice';
import { fetchMetals, selectMetals } from '../store/slices/metalsSlice';
import { fetchCenterStones, selectCenterStones } from '../store/slices/centerStonesSlice';
import { selectUser } from '../store/slices/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const customers = useSelector(selectUsers);
  const adminData = useSelector(selectUser);
  const products = useSelector(selectAllProducts);
  const metals = useSelector(selectMetals);
  const centerStones = useSelector(selectCenterStones);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 1000 }));
    dispatch(fetchProducts());
    dispatch(fetchMetals({ page: 1, limit: 1000 }));
    dispatch(fetchCenterStones({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Revenue',
      value: '$0',
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Orders',
      value: '0',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Customers',
      value: customers.length,
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Total Products',
      value: products.length,
      changeType: 'positive',
      icon: Gem,
      color: 'from-primary to-primary-dark'
    },
    {
      title: 'Total Metals',
      value: metals.length,
      changeType: 'positive',
      icon: Zap,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Total Center Stones',
      value: centerStones.length,
      changeType: 'positive',
      icon: Diamond,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-4 text-white mb-8">
        <h1 className="text-2xl font-sorts-mill-gloudy font-bold ">
          Welcome to {adminData.name}
        </h1>
        {/* <p className="font-montserrat-regular-400 opacity-90 text-lg">
          Manage your jewelry business with ease and elegance
        </p> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-montserrat-medium-500 text-black-light mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                    {stat.value}
                  </p>
                 
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
