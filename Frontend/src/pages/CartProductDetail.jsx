import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, selectCurrentProduct, selectProductsError } from '../store/slices/productsSlice';
import { fetchCartItemById, fetchCartItems, selectCartLoading, selectCurrentCartItem, selectCurrentCartItemError, selectCurrentCartItemLoading, updateCartItem, updateQuantity } from '../store/slices/cartSlice';
import {
  toggleFavorite as toggleFavoriteAction,
  addToFavoritesAPI,
  removeFromFavoritesAPI,
  selectIsFavorite
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import PriceDisplay from '../components/PriceDisplay';
import MetalSelector from '../components/MetalSelector';
import CenterStoneSelector from '../components/CenterStoneSelector';
import RingSizeSelector from '../components/RingSizeSelector';
import { selectStones, selectStonesLoading } from '../store/slices/stonesSlice';
import { selectCategories } from '../store/slices/categoriesSlice';
import { selectMetals } from '../store/slices/metalsSlice';
import { parseLexicalDescription } from '../helpers/lexicalToHTML';
import toast from 'react-hot-toast';
import ContactBox from '../components/ContactBox';
import { transformMetalsToSelectorOptions } from '../constants';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';
import ProductImageViewer from '../components/ProductImageViewer';
import ProductDetailsSection from '../components/ProductDetailsSection';
import QuantitySelector from '../components/QuantitySelector';

const CartProductDetail = () => {
  const { cartItemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartLoading = useSelector(selectCartLoading);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [selectedCenterStone, setSelectedCenterStone] = useState(null);
  const [selectedCarat, setSelectedCarat] = useState(null);
  const [cartItem, setCartItem] = useState(null);

  // Redux selectors
  const product = useSelector(selectCurrentProduct);
  const error = useSelector(selectProductsError);
  const currentCartItem = useSelector(selectCurrentCartItem);
  const cartItemLoading = useSelector(selectCurrentCartItemLoading);
  const cartItemError = useSelector(selectCurrentCartItemError);
  const stones = useSelector(selectStones);
  const stonesLoading = useSelector(selectStonesLoading);
  const categories = useSelector(selectCategories);
  const metals = useSelector(selectMetals);
  const isFavorite = useSelector(state => product ? selectIsFavorite(state, product._id || product.id) : false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isBracelet = product?.category?.name?.toLowerCase().includes('bracelet') || 
   product?.category?.name?.toLowerCase().includes('bracelets') ||
   product?.category?.parent?.name?.toLowerCase().includes('bracelet') ||
   product?.category?.parent?.name?.toLowerCase().includes('bracelets')|| 
   false;
  // Fetch required data when component mounts
  useEffect(() => {
    if (cartItemId) {
      dispatch(fetchCartItemById(cartItemId));
    }
    // dispatch(fetchStones({ page: 1, limit: 10 }));
    // dispatch(fetchMetals());
  }, [dispatch, cartItemId]);

  // Find cart item by ID and set selections
  useEffect(() => {
    if (currentCartItem && cartItemId) {
      const foundItem = currentCartItem;
      setCartItem(foundItem);

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
      if (foundItem.metal) {
        const metal = foundItem.metal;
        const purityLevel = foundItem.purityLevel || {};

        if (metal._id) {
          const karat = purityLevel.karat || metal.karat || 18;
          setSelectedMetal(prev => {
            const nextMetal = {
              id: `${karat}-${(metal.name || '').toLowerCase().replace(/\s+/g, '-')}`,
              metalId: metal._id,
              carat: `${karat}K`,
              color: metal.name || 'Gold',
              priceMultiplier: purityLevel.priceMultiplier || 1
            };
            if (prev && prev.metalId === nextMetal.metalId && prev.carat === nextMetal.carat) {
              return prev;
            }
            return nextMetal;
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
          const stoneId = stoneType._id || stoneType.id;
          setSelectedCarat(prev => {
            if (prev && prev.id === stoneId && prev.name === stoneType.name) {
              return prev;
            }
            return {
              name: stoneType.name,
              id: stoneId,
              price: stoneType.price
            };
          });
          if (stones.length > 0 && !selectedCenterStone) {
            const stone = stones.find(s => s._id === stoneId);
            if (stone) {
              setSelectedCenterStone(stone);
            }
          }
        }
      } else if (foundItem.stoneTypeId) {
        setSelectedCarat(prev => {
          if (prev && prev.id === foundItem.stoneTypeId) {
            return prev;
          }
          return {
            name: prev?.name || '',
            id: foundItem.stoneTypeId,
            price: foundItem.stoneType.price
          };
        });
      }
    } else {
      setCartItem(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCartItem, cartItemId, dispatch, stones]);

  // Set initial carat when product or stones load
  useEffect(() => {
    // If we have cart item with stoneType name, use that
    if (cartItem?.stoneType?.name && !selectedCarat) {
      setSelectedCarat({
        name: cartItem.stoneType.name,
        id: cartItem.stoneType._id || cartItem.stoneType.id,
        price: cartItem.stoneType.price
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
      setSelectedCarat({
        name: product.stoneType.name,
        id: product.stoneType._id || product.stoneType.id,
        price: product.stoneType.price
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
        setSelectedCarat({
          name: stone.name,
          id: stone._id || stone.id,
          price: stone.price
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
    if (!carat) {
      setSelectedCarat(null);
      setSelectedCenterStone(null);
      return;
    }

    if (typeof carat === 'object') {
      setSelectedCarat({
        name: carat.name,
        id: carat.id,
        price: carat.price
      });

      const matchedStone = stones.find(
        (stone) => (stone._id || stone.id) === carat.id
      );
      setSelectedCenterStone(matchedStone || carat);
      return;
    }

    const stone = stones.find((stoneItem) =>
      stoneItem.name?.toLowerCase().includes(carat.toLowerCase())
    );

    if (stone) {
      setSelectedCarat({
        name: stone.name,
        id: stone._id || stone.id,
        price: stone.price
      });
      setSelectedCenterStone(stone);
    } else {
      setSelectedCarat({
        name: carat,
        id: null,
        price: 0
      });
      setSelectedCenterStone(null);
    }
  };

  const handleToggleFavorite = async (event) => {
    event?.preventDefault();
    event?.stopPropagation();

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
          options.push(`${selectedMetal.carat}`);
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
        dispatch(fetchCartItems());
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
    return (basePrice * metalMultiplier) + centerStonePrice;
  };

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

  if (cartItemLoading || (!cartItem && !cartItemError)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black-light font-montserrat-regular-400">Loading cart item...</p>
        </div>
      </div>
    );
  }

  if (cartItemError || error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-montserrat-medium-500 mb-4">
            {cartItemError || error || 'Product not found in cart'}
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

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black-light font-montserrat-regular-400">Loading product details...</p>
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
              <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                <ProductImageViewer
                  className="max-w-xl mx-auto"
                  images={product?.images || []}
                  selectedIndex={selectedImage}
                  onChangeIndex={setSelectedImage}
                  showFavoriteButton
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  imageContainerClassName="shadow-lg bg-white"
                  thumbnailsWrapperClassName="max-w-xl mx-auto"
                  thumbnailButtonClassName="max-w-md"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="sm:px-2 lg:px-6 px-0 py-2 lg:py-0 lg:col-span-3 flex flex-col ">
              <div>
                {/* Rating */}
                {/* <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-montserrat-medium-500 text-black">
                    {product.rating || 5} ({product.reviews || 0} reviews)
                  </span>
                </div> */}

                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-sorts-mill-gloudy text-black mb-4 capitalize">
                  {product.title || product.name}
                </h1>

                {/* Description */}
                <div
                  className="text-black-light font-montserrat-regular-400 text-base mb-6 leading-relaxed prose prose-sm max-w-none"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {capitalizeFirstLetter(product.subDescription)}
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
                      <div className="text-sm font-montserrat-regular-400 text-black-light capitalize">
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
                {!product.isBand &&!isBracelet &&(
                  <CenterStoneSelector
                    className="mb-6"
                    stones={stones}
                    loading={stonesLoading}
                    selectedStone={selectedCarat}
                    onSelect={handleCaratChange}
                    required
                    isRing={isRing}
                    product={product}
                  />
                )} 

                {/* Ring Size Selection */}
                {isRing && (
                  <RingSizeSelector
                    className="mb-6"
                    value={selectedRingSize}
                    onChange={handleRingSizeChange}
                    required
                    showHint={!selectedRingSize}
                    placeholder="Select Ring Size (Required)"
                  />
                )}

                <ProductDetailsSection
                  className="mb-0"
                  product={product}
                  selectedMetal={selectedMetal}
                  selectedCarat={selectedCarat}
                  selectedRingSize={selectedRingSize}
                  isRing={isRing}
                  showCenterStone={isRing}
                  showRingSize={isRing}
                  descriptionHtml={parseLexicalDescription(product.description)}
                />
              </div>

              {/* Quantity and Info */}
              <div className="space-y-4 mt-[20px]">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                />

                {/* Update Cart Button */}
                <button
                  onClick={handleUpdateCart}
                  disabled={cartLoading}
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
                >
                  {cartLoading ? <span className="flex items-center space-x-2w-full justify-center "><Loader2 className="w-5 h-5 animate-spin  mr-2 " /> Updating Cart...</span> : <><ShoppingBag className="w-5 h-5" /> <span>Update Cart</span></>}
                  {/* <ShoppingBag className="w-5 h-5" />
                  <span>Update Cart</span> */}
                </button>
                <button
                  onClick={() => {
                    navigate('/custom');
                  }}
                  className="w-full border border-primary text-primary font-montserrat-medium-500 py-2 px-6 rounded-lg  transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
                >
                 
                 Connect with us to customize further          
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

