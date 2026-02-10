import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import {
  selectFavorites,
  selectFavoritesCount,
  selectFavoritesLoading,
  removeFromFavorites,
  removeFromFavoritesAPI,
  clearFavorites,
  fetchFavorites,
  deleteAllFavoritesAPI,
} from "../store/slices/favoritesSlice";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import PriceDisplay from "../components/PriceDisplay";
import toast from "react-hot-toast";
import AnimatedSection from "../components/home/AnimatedSection";
import { capitalizeFirstLetter } from "../helpers/capitalizeFirstLetter";
import CategoryHero from "../components/CategoryHero";
import { selectMedia } from "../store/slices/mediaSlice";
const Favorites = () => {
  const favorites = useSelector(selectFavorites);
  const favoritesCount = useSelector(selectFavoritesCount);
  const loading = useSelector(selectFavoritesLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const media = useSelector(selectMedia) || [];
  // Fetch favorites from API when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites({ page: 1, limit: 1000 }));
    }
  }, [isAuthenticated, dispatch]);

  const handleRemoveFromFavorites = async (product) => {
    const productId = product._id || product.id;

    if (!productId) {
      toast.error("Invalid product");
      return;
    }

    if (isAuthenticated) {
      await dispatch(removeFromFavoritesAPI(productId));
    } else {
      dispatch(removeFromFavorites(productId));
    }

    toast.success(`${product.title || product.name} removed from favorites!`, {
      duration: 2000,
      position: "top-right",
    });
  };

  const handleClearAllFavorites = async () => {
    try {
      if (isAuthenticated) {
        await dispatch(deleteAllFavoritesAPI()).unwrap();
      } else {
        dispatch(clearFavorites());
      }
      toast.success("All favorites cleared!", {
        duration: 2000,
        position: "top-right",
      });
    } catch (error) {
      toast.error(
        error?.message || "Failed to clear favorites. Please try again.",
        {
          duration: 2000,
          position: "top-right",
        }
      );
    }
  };

  const handleCardClick = (product) => {
    const productId = product._id || product.id;
    if (productId) {
      // Pass current location with query params as state to preserve it when going back
      const currentPath = location.pathname + location.search;
      navigate(`/product/${productId}`, {
        state: { from: currentPath },
        replace: false,
      });
    }
  };

  const getProductDisplayPrice = (product) => {
    const basePrice = product?.price || 0;
    const stonePrice = product?.stoneType?.price || 0;
    return basePrice + stonePrice;
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <CategoryHero
        eyebrow="JEWELRY COLLECTION"
        title="Favorites"
        highlightedWord="."
        body="Discover and manage your favorite jewelry pieces, saved for easy access and future purchases."
        backgroundImage={media.find(item => item.page === 'favorites' && item.section === 'favorites-banner' && item.type === 'image')?.url}
        backgroundOverlay="rgba(0,0,0,0.22)"
      />
      {/* <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="py-8 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
              FAVORITES
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
              Your Favorite <span className="text-primary">Jewelry</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
              Discover and manage your favorite jewelry pieces, saved for easy
              access and future purchases.
            </p>
            <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
          </div>
        </section>
      </AnimatedSection> */}

      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <AnimatedSection animationType="fadeInLeft" delay={200}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-montserrat-semibold-600 text-black mb-2">
                My Favorites
              </h2>
              <p className="text-black-light font-montserrat-regular-400">
                {favoritesCount} item{favoritesCount !== 1 ? "s" : ""} saved
              </p>
            </div>

            {favoritesCount > 0 && (
              <button
                onClick={handleClearAllFavorites}
                className="px-4 py-2  border border-primary rounded-lg bg-primary text-white transition-colors font-montserrat-medium-500 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </AnimatedSection>

        {/* Favorites Content */}
        <AnimatedSection animationType="scaleIn" delay={300}>
          {loading ? (
            <div className="text-center py-16">
              <p className="text-black-light font-montserrat-regular-400">
                Loading favorites...
              </p>
            </div>
          ) : favoritesCount > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleCardClick(product)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-square bg-primary-light">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title || product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black-light">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Remove from Favorites Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromFavorites(product);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-primary hover:bg-primary hover:text-white transition-all duration-200 z-10"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <div className="flex-1 text-left">
                      <h3 className="text-base sm:text-lg font-montserrat-semibold-600 text-black mb-2 line-clamp-1 hover:text-primary-dark transition-colors">
                        {product.title || product.name}
                      </h3>
                      <p className="text-black-light text-xs sm:text-sm mb-3 line-clamp-2 font-montserrat-regular-400">
                        {capitalizeFirstLetter(product.subDescription)}
                      </p>
                    </div>

                    {/* Price Fixed at Bottom */}
                    <div className="flex items-center justify-between mt-auto">
                      <PriceDisplay
                        price={getProductDisplayPrice(product)}
                        className="text-lg sm:text-xl font-montserrat-bold-700 text-primary-dark"
                      />
                      {/* <span className="text-xs sm:text-sm text-black-light font-montserrat-regular-400">
          {product.quantity} in stock
        </span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-primary-light mb-6">
                <Heart className="w-24 h-24 mx-auto" />
              </div>
              <h3 className="text-2xl font-montserrat-semibold-600 text-black mb-4">
                No Favorites Yet
              </h3>
              <p className="text-black-light font-montserrat-regular-400 mb-8 max-w-md mx-auto">
                Start exploring our jewelry collection and save your favorite
                pieces by clicking the heart icon.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors font-montserrat-medium-500"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Favorites;
