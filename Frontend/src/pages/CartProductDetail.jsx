import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Minus, Plus, Gem, ChevronLeft, ChevronRight, ListChevronsDownUp, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, selectCurrentProduct, selectProductsError } from '../store/slices/productsSlice';
import { fetchCartItems, selectCartItems, updateCartItem, updateQuantity } from '../store/slices/cartSlice';
import {
  toggleFavorite as toggleFavoriteAction,
  addToFavoritesAPI,
  removeFromFavoritesAPI,
  selectIsFavorite
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import PriceDisplay from '../components/PriceDisplay';
import MetalSelector from '../components/MetalSelector';
import CustomDropdown from '../components/CustomDropdown';
import Accordion from '../components/Accordion';
import { fetchStones, selectStones, selectStonesLoading } from '../store/slices/stonesSlice';
import { selectCategories } from '../store/slices/categoriesSlice';
import { fetchMetals, selectMetals } from '../store/slices/metalsSlice';
import { RING_SIZES } from '../services/centerStonesApi';
import { parseLexicalDescription } from '../helpers/lexicalToHTML';
import toast from 'react-hot-toast';
import ContactBox from '../components/ContactBox';
import { transformMetalsToSelectorOptions } from '../constants';

const CartProductDetail = () => {
  const { cartItemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [selectedCenterStone, setSelectedCenterStone] = useState(null);
  const [selectedCarat, setSelectedCarat] = useState(null);
  console.log('selectedCarat---- :', selectedCarat);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cartItem, setCartItem] = useState(null);
  // console.log('cartItem :', cartItem);
  const imageContainerRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Redux selectors
  const product = useSelector(selectCurrentProduct);
  const error = useSelector(selectProductsError);
  const cartItems = useSelector(selectCartItems);
  const stones = useSelector(selectStones);
  // console.log('stones :', stones);
  const stonesLoading = useSelector(selectStonesLoading);
  const categories = useSelector(selectCategories);
  const metals = useSelector(selectMetals);
  const isFavorite = useSelector(state => product ? selectIsFavorite(state, product._id || product.id) : false);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch cart items when component mounts
  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(fetchStones({ page: 1, limit: 10 }));
    dispatch(fetchMetals());
  }, [dispatch]);

  // Find cart item by ID and set selections
  useEffect(() => {
    if (cartItems && cartItems.length > 0 && cartItemId) {
      const foundItem = cartItems.find(item =>
        item._id === cartItemId || item.id === cartItemId || item.cartId === cartItemId
      );

      if (foundItem) {
        setCartItem(foundItem);
        console.log('foundItem :', foundItem);

        // Extract product from cart item (API structure has nested product)
        const cartProduct = foundItem.product || foundItem;

        // Fetch product details if we have productId
        const productId = cartProduct._id || cartProduct.productId || foundItem.productId;
        if (productId) {
          dispatch(fetchProductById(productId));
        }

        // Set quantity from cart item
        if (foundItem.quantity) {
          setQuantity(foundItem.quantity);
        }

        // Set ring size if available
        if (foundItem.ringSize) {
          setSelectedRingSize(foundItem.ringSize);
        }

        // Set metal selection if available (API structure has metal and purityLevel)
        console.log('foundItem :', foundItem);
        if (foundItem.metal) {
          const metal = foundItem.metal;
          // console.log('metal :', metal);
          const purityLevel = foundItem.purityLevel || {};
          // console.log('purityLevel :', purityLevel);

          if (metal._id) {
            const karat = purityLevel.karat || metal.karat || 18;
            setSelectedMetal({
              id: `${karat}-${metal.name.toLowerCase().replace(/\s+/g, '-')}`,
              metalId: metal._id,
              carat: `${karat}K`,
              color: metal.name || 'Gold',
              priceMultiplier: purityLevel.priceMultiplier || 1
            });
          }
        } else if (foundItem.selectedMetal) {
          // Fallback for localStorage structure
          setSelectedMetal(foundItem.selectedMetal);
        }

        // Set stone selection if available (API structure has stoneType)
        if (foundItem.stoneType) {
          const stoneType = foundItem.stoneType;
          if (stoneType.name) {
            console.log('stoneType----------------->1 :', stoneType);
            // Only set selectedCarat if it's not already set or if it's different
            const stoneId = stoneType._id || stoneType.id;
            if (!selectedCarat || selectedCarat.id !== stoneId) {
              setSelectedCarat({
                name: stoneType.name,
                id: stoneId
              });
            }
            // Also set selectedCenterStone for price calculation if stones are loaded
            if (stones.length > 0 && !selectedCenterStone) {
              const stone = stones.find(s => s._id === stoneId);
              if (stone) {
                setSelectedCenterStone(stone);
              }
            }
          }
        } else if (foundItem.stoneTypeId) {
          // If we only have ID, we'll need to find it from stones
          // This will be handled when stones are loaded
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, cartItemId, dispatch, stones]);

  // Set initial carat when product or stones load
  useEffect(() => {
    // If we have cart item with stoneType name, use that
    if (cartItem?.stoneType?.name && !selectedCarat) {
      console.log('stoneType----------------->2 :', cartItem);
      setSelectedCarat({
        name: cartItem.stoneType.name,
        id: cartItem.stoneType._id || cartItem.stoneType.id
      });
      // Set selectedCenterStone if stones are loaded
      if (stones.length > 0) {
        const stone = stones.find(s => s._id === cartItem.stoneType._id || s._id === cartItem.stoneType.id);
        if (stone) {
          setSelectedCenterStone(stone);
        }
      }
    }
    // Otherwise, use product's default stoneType
    else if (product?.stoneType?.name && !selectedCarat && !cartItem?.stoneType) {
      console.log('stoneType----------------->3 :', product);
      setSelectedCarat({
        name: product.stoneType.name,
        id: product.stoneType._id || product.stoneType.id
      });
      // Set selectedCenterStone if stones are loaded
      if (stones.length > 0) {
        const stone = stones.find(s => s._id === product.stoneType._id || s._id === product.stoneType.id);
        if (stone) {
          setSelectedCenterStone(stone);
        }
      }
    }
    // If we have stoneTypeId but not name, find it from stones array
    else if (cartItem?.stoneTypeId && stones.length > 0 && !selectedCarat) {
      const stone = stones.find(s => s._id === cartItem.stoneTypeId);
      if (stone?.name) {
        console.log('stoneType----------------->4 :', stone);
        setSelectedCarat({
          name: stone.name,
          id: stone._id || stone.id
        });
        setSelectedCenterStone(stone);
      }
    }
    // Update selectedCenterStone if selectedCarat is set but selectedCenterStone is not
    else if (selectedCarat && !selectedCenterStone && stones.length > 0) {
      const stone = stones.find(s => 
        s._id === selectedCarat.id || 
        s.name?.toLowerCase() === selectedCarat.name?.toLowerCase()
      );
      if (stone) {
        setSelectedCenterStone(stone);
      }
    }
  }, [product, cartItem, stones, selectedCarat, selectedCenterStone]);

  // Auto-select first available metal when product and metals load (only if not already set from cart item)
  useEffect(() => {
    // Only auto-select if no metal is currently selected
    // Wait for cart item to be processed first (if cartItemId exists, wait for cartItem to be set)
    if (selectedMetal || !product || !metals || metals.length === 0) {
      return;
    }
    
    // If we have a cartItemId, wait for cartItem to be processed before auto-selecting
    // This ensures we don't auto-select before checking if cart item has a metal
    if (cartItemId && !cartItem) {
      return;
    }

    // Check if product has metals configured
    const hasProductMetals = product.metals && Array.isArray(product.metals) && product.metals.length > 0;
    if (!hasProductMetals) {
      // Product has no metals configured, don't auto-select
      return;
    }

    // Get available metal IDs from product
    const availableMetalIds = product.metals.map(metal => metal?._id || metal?.id || metal);

    // Transform metals to options (same logic as MetalSelector)
    const metalOptions = transformMetalsToSelectorOptions(metals);

    // Find first available metal option from product's metals
    const firstAvailableMetal = metalOptions.find(metalOption => {
      return availableMetalIds.includes(metalOption.metalId);
    });

    // Set the first available metal as selected
    if (firstAvailableMetal) {
      setSelectedMetal(firstAvailableMetal);
    }
  }, [product, metals, selectedMetal, cartItemId, cartItem]);

  // Image navigation handlers
  const handleNextImage = (e) => {
    e?.stopPropagation();
    const total = product?.images?.length || 0;
    if (total > 0) {
      setSelectedImage((prev) => (prev + 1) % total);
    }
    if (imageContainerRef.current && mousePositionRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = mousePositionRef.current.x - rect.left;
      const y = mousePositionRef.current.y - rect.top;
      const constrainedX = Math.max(0, Math.min(x, rect.width));
      const constrainedY = Math.max(0, Math.min(y, rect.height));
      setMagnifierPosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handlePreviousImage = (e) => {
    e?.stopPropagation();
    const total = product?.images?.length || 0;
    if (total > 0) {
      setSelectedImage((prev) => (prev - 1 + total) % total);
    }
    if (imageContainerRef.current && mousePositionRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = mousePositionRef.current.x - rect.left;
      const y = mousePositionRef.current.y - rect.top;
      const constrainedX = Math.max(0, Math.min(x, rect.width));
      const constrainedY = Math.max(0, Math.min(y, rect.height));
      setMagnifierPosition({ x: constrainedX, y: constrainedY });
    }
  };

  // Hide magnifier when entering arrow button area
  const handleArrowMouseEnter = () => {
    setShowMagnifier(false);
  };

  // Re-enable magnifier when leaving arrow button and going to image
  const handleArrowMouseLeave = () => {
    setTimeout(() => {
      if (imageContainerRef.current && mousePositionRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const { x, y } = mousePositionRef.current;
        const isOverImage =
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom;
        if (isOverImage) {
          setShowMagnifier(true);
        }
      }
    }, 10);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => {
          const total = product?.images?.length || 0;
          return total > 0 ? (prev - 1 + total) % total : prev;
        });
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => {
          const total = product?.images?.length || 0;
          return total > 0 ? (prev + 1) % total : prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product]);

  // Check if product is a ring
  const categoryName = product?.category?.name?.toLowerCase();
  let parentCategoryName = null;
  if (product?.category?.parent && categories) {
    const parentCategory = categories.find(cat =>
      cat._id === product.category.parent || cat.id === product.category.parent
    );
    parentCategoryName = parentCategory?.name?.toLowerCase();
  }

  const isRing = (categoryName === 'ring' || categoryName === 'rings') ||
    (parentCategoryName === 'ring' || parentCategoryName === 'rings');

  // Handle back button navigation
  const handleBack = () => {
    navigate('/view-cart');
  };

  const handleMetalChange = (metal) => {
    setSelectedMetal(metal);
  };

  const handleRingSizeChange = (size) => {
    setSelectedRingSize(size);
  };

  const handleCaratChange = (carat) => {
    console.log('carat----------------->5 :', carat);
    // Find stone by carat name
    const stone = stones.find(stone =>
      stone.name.toLowerCase().includes(carat.toLowerCase())
    );
    if (stone) {
      // Save both name and ID in selectedCarat
      setSelectedCarat({
        name: stone.name,
        id: stone._id || stone.id
      });
      setSelectedCenterStone(stone);
    } else {
      // Fallback: if stone not found, just save the name
      setSelectedCarat({
        name: carat,
        id: null
      });
    }
  };

  // Handle update cart item
  const handleUpdateCart = async () => {
    try {
      // Validate ring size for rings
      if (isRing && !selectedRingSize) {
        toast.error('Please select a ring size before updating cart', {
          duration: 3000,
          position: 'top-right',
        });
        return;
      }

      if (!cartItem || !cartItemId) {
        toast.error('Cart item not found');
        return;
      }

      // Prepare cart data for update
      const cartData = {
        quantity: quantity,
      };

      // Add ring size if product is a ring
      if (isRing && selectedRingSize) {
        cartData.ringSize = selectedRingSize;
      }

      // Add metal information if selected
      if (selectedMetal && selectedMetal.metalId) {
        cartData.metalId = selectedMetal.metalId;
        cartData.purityLevel = {
          karat: Number(selectedMetal.carat.match(/\d+/)?.[0] || 18),
          priceMultiplier: selectedMetal.priceMultiplier || 1,
        };
      }

      // Add stone type if selected - use selected stone ID if available
      console.log('selectedCarat--------&&& :', selectedCarat);
      if (selectedCarat) {
        if (typeof selectedCarat === 'object' && selectedCarat.id) {
          // Use ID from selectedCarat object
          cartData.stoneTypeId = selectedCarat.id;
        } else if (selectedCenterStone?._id) {
          // Fallback to selectedCenterStone ID
          cartData.stoneTypeId = selectedCenterStone._id;
        } else {
          // Find from stones array by name
          const selectedStone = stones.find(stone =>
            typeof selectedCarat === 'string'
              ? (stone.name.toLowerCase() === selectedCarat.toLowerCase() ||
                stone.name.toLowerCase().includes(selectedCarat.toLowerCase()))
              : (stone.name.toLowerCase() === selectedCarat.name?.toLowerCase() ||
                stone.name.toLowerCase().includes(selectedCarat.name?.toLowerCase()))
          );
          console.log('selectedStone :', selectedStone);

          if (selectedStone?._id) {
            cartData.stoneTypeId = selectedStone._id;
          } else if (product?.stoneType?._id) {
            // Fallback to product's stoneType if available
            cartData.stoneTypeId = product.stoneType._id;
          }
        }
      }

      // Optimistic update: Update quantity immediately for fast UX
      dispatch(updateQuantity({ id: cartItemId, quantity: quantity }));

      console.log('isAuthenticated :', isAuthenticated);
      if (isAuthenticated) {
        // Update via API
        await dispatch(updateCartItem({
          cartId: cartItemId,
          cartData: cartData
        })).unwrap();

        // Build success message with selected options
        let successMessage = 'Cart updated successfully!';
        const options = [];

        if (selectedMetal) {
          options.push(`${selectedMetal.carat}K`);
        }
        if (isRing && selectedRingSize) {
          options.push(`Size ${selectedRingSize}`);
        }
        if (selectedCarat) {
          const stoneName = typeof selectedCarat === 'string' ? selectedCarat : selectedCarat.name;
          options.push(`Stone: ${stoneName}`);
        }
        if (quantity > 1) {
          options.push(`Qty: ${quantity}`);
        }

        if (options.length > 0) {
          successMessage = `Cart updated (${options.join(', ')})!`;
        }

        toast.success(successMessage, {
          duration: 3000,
          position: 'top-right',
        });
        navigate('/view-cart');
      } else {
        // For non-authenticated users, just show success
        toast.success('Cart updated successfully!', {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error(error || 'Failed to update cart item. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  // Calculate final price with metal multiplier and center stone
  const getFinalPrice = () => {
    const basePrice = product?.price || 0;
    const metalMultiplier = selectedMetal ? selectedMetal.priceMultiplier : 1;
    const centerStonePrice = selectedCenterStone ? selectedCenterStone.price : 0;
    return (basePrice + centerStonePrice) * metalMultiplier;
  };

  // Magnifier handlers
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;

    mousePositionRef.current = { x: e.clientX, y: e.clientY };

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const constrainedX = Math.max(0, Math.min(x, rect.width));
    const constrainedY = Math.max(0, Math.min(y, rect.height));

    setMagnifierPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const getZoomPosition = () => {
    if (!imageContainerRef.current) return { x: 0, y: 0, zoom: 2.5 };
    const rect = imageContainerRef.current.getBoundingClientRect();
    const zoomLevel = 4.5;
    const x = (magnifierPosition.x / rect.width) * 100;
    const y = (magnifierPosition.y / rect.height) * 100;
    return { x, y, zoom: zoomLevel };
  };

  const zoomPos = getZoomPosition();
  const totalImages = product?.images?.length || 0;

  //   if (loading || cartLoading || stonesLoading) {
  //     return (
  //       <div className="min-h-screen bg-white flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
  //           <p className="text-black-light font-montserrat-regular-400">Loading product details...</p>
  //         </div>
  //       </div>
  //     );
  //   }

  if (error || !product || !cartItem) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-montserrat-medium-500 mb-4">
            {error || 'Product not found in cart'}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-montserrat-medium-500"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 lg:py-12">
      <div className="max-w-[1580px] mx-auto px-4 lg:px-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 lg:mb-8 flex items-center space-x-2 text-black-light hover:text-primary transition-colors duration-300 font-montserrat-medium-500"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white  overflow-hidden w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
            {/* Product Images */}
            <div className="relative lg:px-4 lg:col-span-2">
              <div
                ref={imageContainerRef}
                className="aspect-square relative overflow-hidden mb-3 cursor-zoom-in max-w-xl mx-auto shadow-lg"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Main Image */}
                <img
                  src={product?.images?.[selectedImage]}
                  alt={product?.name || product?.title}
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Magnified Image Overlay */}
                {showMagnifier && imageContainerRef.current && (
                  <div
                    className="absolute pointer-events-none z-20 border-2 border-white rounded-full shadow-2xl overflow-hidden"
                    style={{
                      left: `${magnifierPosition.x}px`,
                      top: `${magnifierPosition.y}px`,
                      width: '200px',
                      height: '200px',
                      backgroundImage: `url(${product?.images?.[selectedImage]})`,
                      backgroundSize: `${zoomPos.zoom * 100}%`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundRepeat: 'no-repeat',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}

                {/* Favorite Button */}
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!product) return;

                    const productId = product._id || product.id;
                    if (!productId) {
                      toast.error('Invalid product');
                      return;
                    }

                    if (isAuthenticated) {
                      if (isFavorite) {
                        await dispatch(removeFromFavoritesAPI(productId));
                        toast.success(`${product.title || product.name} removed from favorites!`, {
                          duration: 2000,
                          position: 'top-right',
                        });
                      } else {
                        await dispatch(addToFavoritesAPI(productId));
                        toast.success(`${product.title || product.name} added to favorites!`, {
                          duration: 2000,
                          position: 'top-right',
                        });
                      }
                    } else {
                      dispatch(toggleFavoriteAction(product));
                      if (isFavorite) {
                        toast.success(`${product.title || product.name} removed from favorites!`, {
                          duration: 2000,
                          position: 'top-right',
                        });
                      } else {
                        toast.success(`${product.title || product.name} added to favorites!`, {
                          duration: 2000,
                          position: 'top-right',
                        });
                      }
                    }
                  }}
                  onMouseEnter={handleArrowMouseEnter}
                  onMouseLeave={handleArrowMouseLeave}
                  className={`absolute top-4 sm:right-4 left-4 w-fit p-2 rounded-full transition-all duration-200 z-10 ${isFavorite
                      ? 'bg-primary text-white'
                      : 'bg-white/90 text-black-light hover:bg-primary hover:text-white'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Navigation Arrows */}
                {totalImages > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      onMouseEnter={handleArrowMouseEnter}
                      onMouseLeave={handleArrowMouseLeave}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-1 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-black" />
                    </button>

                    <button
                      onClick={handleNextImage}
                      onMouseEnter={handleArrowMouseEnter}
                      onMouseLeave={handleArrowMouseLeave}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-1 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-black" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {totalImages > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-montserrat-medium-500">
                    {selectedImage + 1} / {totalImages}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2  mx-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors max-w-md duration-300 ${selectedImage === index ? 'border-primary ring-1 outline-none ring-primary ring-offset-2' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name || product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="sm:px-2 lg:px-6 px-0 py-2 lg:py-0 lg:col-span-3 flex flex-col ">
              <div>
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-montserrat-medium-500 text-black">
                    {product.rating || 5} ({product.reviews || 0} reviews)
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-sorts-mill-gloudy text-black mb-4">
                  {product.title || product.name}
                </h1>

                {/* Description */}
                <div
                  className="text-black-light font-montserrat-regular-400 text-base mb-6 leading-relaxed prose prose-sm max-w-none"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {product.subDescription}
                </div>

                {/* Price */}
                <div className="sm:flex block items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <PriceDisplay
                      price={getFinalPrice()}
                      // originalPrice={product.price}
                      showOriginalPrice={true}
                      showSavings={true}
                      className="text-3xl lg:text-4xl font-montserrat-bold-700 text-primary"
                    />
                    {selectedMetal && (
                      <div className="text-sm font-montserrat-regular-400 text-black-light">
                        ({selectedMetal.carat})
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-montserrat-semibold-600 text-black">
                      Made to order
                    </div>
                  </div>
                </div>

                {/* Metal Selection */}
                <div className="mb-6">
                  <MetalSelector
                    selectedMetal={selectedMetal}
                    onMetalChange={handleMetalChange}
                    product={product}
                    cartItem={cartItem}
                  />
                </div>

                {/* Center Stone Selection */}
                {isRing && stones.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3 flex items-center gap-2">
                      <Gem className="w-5 h-5 text-primary" />
                      Center Stone
                    </h3>

                    <div className="mb-4">
                      {stonesLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-lg h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="text-sm text-black-light mt-2">Loading stones...</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {stones.filter(stone => stone.active).map((stone) => (
                            <button
                              key={stone._id}
                              onClick={() => handleCaratChange(stone.name)}
                              className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-montserrat-medium-500 ${(selectedCarat?.name === stone.name || selectedCarat?.id === stone._id) || (typeof selectedCarat === 'string' && selectedCarat === stone.name)
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 bg-white text-black hover:border-primary hover:bg-primary-light'
                                }`}
                            >
                              {stone.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ring Size Selection */}
                {isRing && (
                  <div className="mb-6">
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Ring Size <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                      options={RING_SIZES}
                      value={selectedRingSize}
                      onChange={handleRingSizeChange}
                      placeholder="Select Ring Size (Required)"
                      searchable={false}
                    />
                    {!selectedRingSize && (
                      <p className="mt-2 text-xs text-gray-600 font-montserrat-regular-400">
                        Need help finding your size? Check our <a href="/size-guide" className="text-primary hover:underline">Size Guide</a>
                      </p>
                    )}
                  </div>
                )}

                {/* Product Details Accordion */}
                <div className="mb-0 space-y-3">
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">
                    Product Details
                  </h3>

                  <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
                    <div className="flex justify-between">
                    <span className="font-montserrat-medium-500 text-black">Material:</span>
                      <span>{selectedMetal ? `${selectedMetal.carat} ${selectedMetal.color}` : 'Premium Gold/Silver'}</span>
                    </div>
                    {isRing && selectedCarat && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Center Stone:</span>
                        <span>{typeof selectedCarat === 'string' ? selectedCarat : selectedCarat?.name}</span>
                      </div>
                    )}
                    {isRing && selectedRingSize && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Ring Size:</span>
                        <span>{selectedRingSize}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                    <span className="font-montserrat-medium-500 text-black">Care:</span>
                      <span>{product.careInstruction}</span>
                    </div>
                    {product.shape && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Shape:</span>
                        <span>{product.shape}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Color:</span>
                        <span>{product.color}</span>
                      </div>
                    )}
                    
                    {product.clarity.length > 0 && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Clarity:</span>
                        <span>{product.clarity.join(', ')}</span>
                      </div>
                    )}
                    {product.certificate.length > 0 && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Certificate:</span>
                        <span>{product.certificate.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* FAQ Style Accordions */}
                  <div className="space-y-2 ">
                    <Accordion
                      title="More Details"
                      icon={<ListChevronsDownUp className="w-4 h-4 text-primary" />}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: parseLexicalDescription(product.description) }}
                        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                      />
                    </Accordion>
                  </div>
                </div>
              </div>

              {/* Quantity and Info */}
              <div className="space-y-4 mt-[20px]">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 bg-primary-light hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-montserrat-medium-500 text-black">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-10 h-10 bg-primary-light hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                {/* <div className="text-xs font-montserrat-regular-400 text-black-light text-center">
                  <p>✓ Free shipping on orders over $100</p>
                  <p>✓ 30-day return policy</p>
                  <p>✓ Secure checkout</p>
                </div> */}

                {/* Update Cart Button */}
                <button
                  onClick={handleUpdateCart}
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Update Cart</span>
                </button>
                <ContactBox />
                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-montserrat-medium-500">
                    Update your selections above and click "Update Cart" to save changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductDetail;

