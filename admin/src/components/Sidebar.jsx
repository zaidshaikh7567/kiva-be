import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TOKEN_KEYS } from '../constants/tokenKeys';
import { 
  Home, 
  ShoppingBag, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Gem,
  Heart,
  Crown,
  Star,
  Zap,
  Diamond,
  Share2,
  FolderOpen,
  Mail,
  Image as ImageIcon
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import Logo from '../assets/kiva-diamond-logo.png';
import { removeFCMToken } from '../services/notificationService';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'products',
      label: 'Products',
      icon: Gem,
      path: '/products'
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Package,
      path: '/categories'
    },
    {
      id: 'metals',
      label: 'Metals',
      icon: Zap,
      path: '/metals'
    },
    {
      id: 'center-stones',
      label: 'Center Stones',
      icon: Diamond,
      path: '/center-stones'
    },
    {
      id: 'collections',
      label: 'Collections',
      icon: FolderOpen,
      path: '/collections'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      path: '/orders'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      path: '/customers'
    },
    // {
    //   id: 'analytics',
    //   label: 'Analytics',
    //   icon: BarChart3,
    //   path: '/analytics'
    // },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      path: '/reviews'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Mail,
      path: '/contacts'
    },
    {
      id: 'social-handles',
      label: 'Social Handles',
      icon: Share2,
      path: '/social-handles'
    },
    {
      id: 'media-assets',
      label: 'Media Library',
      icon: ImageIcon,
      path: '/media-assets'
    },
    // {
    //   id: 'favorites',
    //   label: 'Favorites',
    //   icon: Heart,
    //   path: '/favorites'
    // },
    // {
    //   id: 'settings',
    //   label: 'Settings',
    //   icon: Settings,
    //   path: '/settings'
    // }
  ];

  const handleLogout = async () => {
    const fcmToken = localStorage.getItem('fcmToken-admin');
    if (fcmToken) {
      await removeFCMToken(fcmToken);
    }
    localStorage.removeItem('fcmToken-admin');
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.AUTHENTICATED);
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-50 sidebar-content
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-[12px] border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-white" />
            </div>
            {/* <div className="inline-block bg-gray-600 rounded-lg  shadow-2xl">
                  <img 
                    src={Logo} 
                    alt="KIVA Diamond Logo" 
                    className="h-[55px] w-auto"
                    style={{
                      filter: 'brightness(1.1) contrast(1.1)'
                    }}
                  />
                </div> */}
                 <h2 className="text-lg font-sorts-mill-gloudy font-bold text-black">
               {user.name}
              </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-black-light" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 outline-none
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                      : 'text-black-light hover:bg-primary-light hover:text-black'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-black-light'}`} />
                  <span className={`font-montserrat-medium-500 ${isActive ? 'text-white' : 'text-black-light'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer - Logout Button */}
        <div className="mt-auto p-2 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-montserrat-medium-500">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
