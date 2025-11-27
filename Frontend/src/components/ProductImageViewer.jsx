import React, { useEffect, useRef, useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageViewer = ({
  images = [],
  selectedIndex,
  onChangeIndex,
  showFavoriteButton = false,
  isFavorite = false,
  onToggleFavorite,
  className = '',
  imageContainerClassName = '',
  thumbnailsWrapperClassName = '',
  thumbnailButtonClassName = '',
  showThumbnails = true,
  showCounter = true,
  enableZoom = true,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const totalImages = images?.length || 0;
  const activeIndex =
    typeof selectedIndex === 'number' ? selectedIndex : internalIndex;
  const activeImage = totalImages > 0 ? images[activeIndex] : null;

  useEffect(() => {
    if (typeof selectedIndex === 'number') {
      setInternalIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const updateIndex = (nextIndex) => {
    if (onChangeIndex) {
      onChangeIndex(nextIndex);
    } else {
      setInternalIndex(nextIndex);
    }
  };

  const handleMouseMove = (event) => {
    if (!enableZoom || !imageContainerRef.current) return;

    mousePositionRef.current = { x: event.clientX, y: event.clientY };

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const constrainedX = Math.max(0, Math.min(x, rect.width));
    const constrainedY = Math.max(0, Math.min(y, rect.height));

    setMagnifierPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseEnter = () => {
    if (!enableZoom) return;
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleArrowEnter = () => {
    setShowMagnifier(false);
  };

  const handleArrowLeave = () => {
    if (!enableZoom || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;
    const isOverImage =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    if (isOverImage) {
      setShowMagnifier(true);
    }
  };

  const handleNext = (event) => {
    event?.stopPropagation();
    if (totalImages === 0) return;
    const nextIndex = (activeIndex + 1) % totalImages;
    updateIndex(nextIndex);
  };

  const handlePrevious = (event) => {
    event?.stopPropagation();
    if (totalImages === 0) return;
    const nextIndex = (activeIndex - 1 + totalImages) % totalImages;
    updateIndex(nextIndex);
  };

  const handleToggleFavorite = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    onToggleFavorite?.(event);
  };

  const renderMainImage = () => {
    if (!activeImage) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500">
          No Image Available
        </div>
      );
    }

    const rect = imageContainerRef.current?.getBoundingClientRect();
    const zoomLevel = 4.5;
    const zoomPosition = rect
      ? {
          x: (magnifierPosition.x / rect.width) * 100,
          y: (magnifierPosition.y / rect.height) * 100,
        }
      : { x: 0, y: 0 };

    return (
      <>
        <img
          src={activeImage}
          alt={`Product view ${activeIndex + 1}`}
          className="h-full w-full rounded-lg object-cover"
        />

        {enableZoom && showMagnifier && imageContainerRef.current && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute z-20 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-2xl"
              style={{
                left: `${magnifierPosition.x}px`,
                top: `${magnifierPosition.y}px`,
                backgroundImage: `url(${activeImage})`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className={className}>
      <div
        ref={imageContainerRef}
        className={`relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg ${enableZoom ? 'cursor-zoom-in' : ''} ${imageContainerClassName}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderMainImage()}

        {showFavoriteButton && onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            onMouseEnter={handleArrowEnter}
            onMouseLeave={handleArrowLeave}
            className={`absolute top-4 left-4 z-30 rounded-full p-2 transition-all duration-200 ${
              isFavorite
                ? 'bg-primary text-white'
                : 'bg-white/90 text-black-light hover:bg-primary hover:text-white'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrevious}
              onMouseEnter={handleArrowEnter}
              onMouseLeave={handleArrowLeave}
              className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </button>
            <button
              onClick={handleNext}
              onMouseEnter={handleArrowEnter}
              onMouseLeave={handleArrowLeave}
              className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-black" />
            </button>
          </>
        )}

        {showCounter && totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 text-sm font-montserrat-medium-500 text-white">
            {activeIndex + 1} / {totalImages}
          </div>
        )}
      </div>

      {showThumbnails && totalImages > 1 && (
        <div className={`grid grid-cols-4 gap-2 ${thumbnailsWrapperClassName}`}>
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => updateIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                activeIndex === index
                  ? 'border-primary ring-1 ring-primary ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              } ${thumbnailButtonClassName}`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageViewer;

