import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, Gem } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Customers',
      value: '856',
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Total Products',
      value: '245',
      change: '+3.1%',
      changeType: 'positive',
      icon: Gem,
      color: 'from-primary to-primary-dark'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white mb-8">
        <h1 className="text-4xl font-sorts-mill-gloudy font-bold mb-3">
          Welcome to Jewelry Admin
        </h1>
        <p className="font-montserrat-regular-400 opacity-90 text-lg">
          Manage your jewelry business with ease and elegance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className={`text-sm font-montserrat-medium-500 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
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
