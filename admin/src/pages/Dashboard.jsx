import React, { useEffect, useMemo, useState } from 'react';
import { Users, ShoppingBag, DollarSign, Gem, Zap, Diamond, RefreshCw, Star, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUsers } from '../store/slices/usersSlice';
import { fetchProducts, selectAllProducts } from '../store/slices/productsSlice';
import { fetchMetals, selectMetals } from '../store/slices/metalsSlice';
import { fetchCenterStones, selectCenterStones } from '../store/slices/centerStonesSlice';
import { selectUser } from '../store/slices/authSlice';
import { fetchReviews, selectReviews } from '../store/slices/reviewsSlice';
import { fetchContacts, selectContacts } from '../store/slices/contactsSlice';
import { Link } from 'react-router-dom';
import { fetchOrders, selectAdminOrders } from '../store/slices/ordersSlice';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const ChartTooltipContent = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const revenuePoint = payload.find(item => item.dataKey === 'revenue');
  const ordersPoint = payload.find(item => item.dataKey === 'orders');

  return (
    <div className="rounded-xl border border-gray-100 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</p>
      {revenuePoint && (
        <p className="text-sm font-montserrat-medium-500 text-black flex items-center gap-2">
          <span className="inline-flex w-2 h-2 rounded-full bg-primary" />
          Revenue: <span className="font-semibold">${revenuePoint.value.toLocaleString()}</span>
        </p>
      )}
      {ordersPoint && (
        <p className="text-sm font-montserrat-medium-500 text-black flex items-center gap-2">
          <span className="inline-flex w-2 h-2 rounded-full bg-blue-100 border border-blue-500" />
          Orders: <span className="font-semibold">{ordersPoint.value}</span>
        </p>
      )}
    </div>
  );
};
const Dashboard = () => {
  const dispatch = useDispatch();
  const customers = useSelector(selectUsers);
  const adminData = useSelector(selectUser);
  const products = useSelector(selectAllProducts);
  const metals = useSelector(selectMetals);
  const centerStones = useSelector(selectCenterStones);
  const reviews = useSelector(selectReviews);
  const contacts = useSelector(selectContacts);
  const orders = useSelector(selectAdminOrders);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchUsers({ page: 1, limit: 1000 })),
        dispatch(fetchProducts()),
        dispatch(fetchMetals({ page: 1, limit: 1000 })),
        dispatch(fetchCenterStones({ page: 1, limit: 1000 })),
        dispatch(fetchReviews({ page: 1, limit: 1000 })),
        dispatch(fetchContacts({ page: 1, limit: 1000 })),
        dispatch(fetchOrders({ page: 1, limit: 1000 }))
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setRefreshing(true);
      try {
        await Promise.all([
          dispatch(fetchUsers({ page: 1, limit: 1000 })),
          dispatch(fetchProducts()),
          dispatch(fetchMetals({ page: 1, limit: 1000 })),
          dispatch(fetchCenterStones({ page: 1, limit: 1000 })),
          dispatch(fetchReviews({ page: 1, limit: 1000 })),
          dispatch(fetchContacts({ page: 1, limit: 1000 })),
          dispatch(fetchOrders({ page: 1, limit: 1000 }))
        ]);
      } finally {
        setRefreshing(false);
      }
    };
    loadData();
  }, [dispatch]);

  const totalRevenue = useMemo(() => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((total, order) => total + (order?.subtotal || 0), 0);
  }, [orders]);

  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    const monthlyMap = new Map();
    orders.forEach(order => {
      const date = order?.createdAt ? new Date(order.createdAt) : new Date();
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          revenue: 0,
          orders: 0,
          timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        });
      }
      const current = monthlyMap.get(key);
      current.revenue += order?.subtotal || 0;
      current.orders += 1;
    });

    const sorted = Array.from(monthlyMap.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(([key, data]) => {
        const [year, month] = key.split('-').map(Number);
        const labelDate = new Date(year, month, 1);
        return {
          label: labelDate.toLocaleDateString('en-US', { month: 'short' }),
          revenue: data.revenue,
          orders: data.orders
        };
      });

    const trimmed = sorted.slice(-6);
    return trimmed.length > 0 ? trimmed : sorted;
  }, [orders]);

  const stats = [
    {
      title: 'Total Revenue',
      value: totalRevenue,
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      link: '/products'
    },
    {
      title: 'Total Orders',
      value: orders?.length,
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      link: '/orders'
    },
    {
      title: 'Total Customers',
      value: customers.length,
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      link: '/customers'
    },
    {
      title: 'Total Products',
      value: products.length,
      changeType: 'positive',
      icon: Gem,
      color: 'from-primary to-primary-dark',
      link: '/products'
    },
    {
      title: 'Total Metals',
      value: metals.length,
      changeType: 'positive',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      link: '/metals'
    },
    {
      title: 'Total Center Stones',
      value: centerStones.length,
      changeType: 'positive',
      icon: Diamond,
      color: 'from-pink-500 to-pink-600',
      link: '/center-stones'
    },
    {
      title: 'Total Reviews',
      value: reviews.length,
      changeType: 'positive',
      icon: Star,
      color: 'from-yellow-400 to-yellow-400',
      link: '/reviews'
    },
    {
      title: 'Total Contacts Inquiries',
      value: contacts.length,
      changeType: 'positive',
      icon: Mail,
      color: 'from-gray-500 to-gray-600',
      link: '/contacts'
    }
  ];

  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const fulfillmentRate = orders.length
    ? Math.min(99, Math.round((orders.filter(order => order.status === 'delivered').length / orders.length) * 100))
    : 0;
  const customerCoverage = Math.min(100, Math.round((orders.length / Math.max(customers.length, 1)) * 100));

  const orderStatusSummary = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { delivered: 0, inProgress: 0, cancelled: 0 };
    }
    
    return orders.reduce(
      (acc, order) => {
        const status = order?.status?.toLowerCase() || 'pending';
        if (status === 'delivered' || status === 'completed') {
          acc.delivered += 1;
        } else if (status === 'cancelled' || status === 'refunded') {
          acc.cancelled += 1;
        } else {
          acc.inProgress += 1;
        }
        return acc;
      },
      { delivered: 0, inProgress: 0, cancelled: 0 }
    );
  }, [orders]);
  const lastTwoRevenuePoints = chartData.slice(-2);
  const revenueGrowth =
    lastTwoRevenuePoints.length === 2 && lastTwoRevenuePoints[0].revenue > 0
      ? ((lastTwoRevenuePoints[1].revenue - lastTwoRevenuePoints[0].revenue) / lastTwoRevenuePoints[0].revenue) * 100
      : null;

  const recentContactsCount = useMemo(() => {
    if (!contacts || contacts.length === 0) return 0;
    const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return contacts.filter(contact => {
      const created = contact?.createdAt ? new Date(contact.createdAt).getTime() : null;
      return created && created >= threshold;
    }).length;
  }, [contacts]);

  const recentProductCount = useMemo(() => {
    if (!products || products.length === 0) return 0;
    const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return products.filter(product => {
      const created = product?.createdAt ? new Date(product.createdAt).getTime() : null;
      return created && created >= threshold;
    }).length;
  }, [products]);

  const insightMetrics = [
    {
      label: 'Fulfillment Success',
      value: orders.length ? `${Math.round((orderStatusSummary.delivered / orders.length) * 100)}%` : '—',
      progress: orders.length ? Math.round((orderStatusSummary.delivered / orders.length) * 100) : 0,
      accent: 'bg-green-500',
      helper: `${orderStatusSummary.delivered} of ${orders.length || 0} orders delivered`
    },
    {
      label: 'Open Orders',
      value: orderStatusSummary.inProgress.toString(),
      progress: orders.length ? Math.round((orderStatusSummary.inProgress / orders.length) * 100) : 0,
      accent: 'bg-green-500',
      helper: 'Awaiting processing / shipment'
    },
    {
      label: 'Revenue Momentum',
      value: revenueGrowth !== null ? `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%` : '—',
      progress:
        revenueGrowth !== null
          ? Math.max(0, Math.min(100, 50 + revenueGrowth))
          : 0,
      accent: 'bg-green-500',
      helper:
        lastTwoRevenuePoints.length === 2
          ? `Compared to ${lastTwoRevenuePoints[0].label}`
          : 'Waiting for more monthly data'
    }
  ];

  const chartDataForChart = useMemo(
    () =>
      chartData.map(item => ({
        month: item.label,
        revenue: Math.round(item.revenue),
        orders: item.orders
      })),
    [chartData]
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-4 text-white mb-8 bg-">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-sorts-mill-gloudy font-bold ">
              Welcome to {adminData.name}
            </h1>
            {/* <p className="font-montserrat-regular-400 opacity-90 text-lg">
              Manage your jewelry business with ease and elegance
            </p> */}
          </div>
          <button
            onClick={fetchAllData}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-montserrat-medium-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-rows-[1fr]">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const CardContent = (
            <div className="h-full bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between flex-1">
                <div>
                  <p className="text-sm font-montserrat-medium-500 text-black-light mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                    {stat.value?.toLocaleString?.() ?? stat.value}
                  </p>
                </div>

                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>  
          );

          return stat.link ? (
            <Link to={stat.link} key={index}>
              {CardContent}
            </Link>
          ) : (
            <div key={index}>{CardContent}</div>
          );
        })}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Performance Overview</p>
              <h3 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Revenue & Orders Trend</h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-black-light">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary-dark inline-block" />
                <span>Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500 inline-block" />
                <span>Orders</span>
              </div>
            </div>
          </div>

          <div className="mt-8 h-72">
            {chartDataForChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartDataForChart} margin={{ top: 10, right: 20, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(245, 158, 11, 0.35)" />
                      <stop offset="90%" stopColor="rgba(245, 158, 11, 0.05)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tickFormatter={value => `$${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    padding={{ top: 10, bottom: 10 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    padding={{ top: 10, bottom: 10 }}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="orders"
                    yAxisId="right"
                    barSize={28}
                    radius={[8, 8, 0, 0]}
                    fill="rgba(59,130,246,0.25)"
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    yAxisId="left"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center border border-dashed border-gray-200 rounded-2xl text-black-light">
                <p className="text-lg font-montserrat-semibold-600 text-black mb-1">No order data yet</p>
                <p className="text-sm">As soon as orders start flowing in, this chart will visualize the monthly revenue and volume automatically.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm font-montserrat-medium-500 text-black-light">Key Insights</p>
          <h3 className="text-xl font-sorts-mill-gloudy font-bold text-black mb-6">Business Health</h3>

          <div className="space-y-6">
            {insightMetrics.map(metric => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-montserrat-medium-500 text-black-light">{metric.label}</p>
                  <p className="text-base font-montserrat-semibold-600 text-black">{metric.value}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${metric.accent}`}
                    style={{ width: `${Math.min(100, Math.max(0, metric.progress))}%` }}
                  />
                </div>
                {metric.helper && (
                  <p className="mt-1 text-xs text-gray-500">{metric.helper}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-sm font-montserrat-medium-500 text-black-light">Quick Stats</p>
            <div className="rounded-xl border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Active Products</p>
                <p className="text-lg font-montserrat-semibold-600 text-black">{products.length}</p>
              </div>
              <div className="text-primary text-sm font-montserrat-medium-500">
                +{recentProductCount} new in 30d
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Pending Orders</p>
                <p className="text-lg font-montserrat-semibold-600 text-black">{orderStatusSummary.inProgress}</p>
              </div>
              <div className="text-amber-600 text-sm font-montserrat-medium-500">
                of {orders.length} total
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">New Contacts (30d)</p>
                <p className="text-lg font-montserrat-semibold-600 text-black">{recentContactsCount}</p>
              </div>
              <div className="text-green-500 text-sm font-montserrat-medium-500">
                {contacts.length} total
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
