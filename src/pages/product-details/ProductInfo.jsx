import { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaCheck,
  FaPlusCircle,
  FaMinusCircle,
} from "react-icons/fa";
import { getColorClass } from "../../utils/color-class";
import StarRating from "../../utils/star-rating";

export default function ProductInfo({
  name,
  category,
  rating,
  reviews,
  price,
  variants = [],
}) {
  //extract unique colors and sizes from variants
  const availableColors = [...new Set(variants.map((v) => v.color))].filter(
    Boolean
  );
  console.log("Available colors", availableColors)
  const availableSizes = [
    ...new Set(variants.map((v) => v.standard_size)),
  ].filter(Boolean);

  const [selectedColor, setSelectedColor] = useState(
    availableColors[0] || null
  );
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || null);
  const [quantity, setQuantity] = useState(1);

  // Get current variant based on selections
  const currentVariant = variants.find(
    (v) => v.color === selectedColor && v.standard_size === selectedSize
  );

  // Display price (use override if available)
  const displayPrice = currentVariant?.price_override || price;

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Reset size if the selected color doesn't have the current size
    if (
      !variants.some(
        (v) => v.color === color && v.standard_size === selectedSize
      )
    ) {
      const firstAvailableSize = variants.find(
        (v) => v.color === color
      )?.standard_size;
      setSelectedSize(firstAvailableSize || null);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="">
      <h1 className="text-lg md:text-2xl lg:text-xl xl:text-4xl font-bold mb-1">
        {name}
      </h1>
      <p className="capitalize text-gray-600 mb-2 md:text-xl lg:text-lg xl:text-xl">
        {category}
      </p>

      {/* Ratings */}
      
        <div className="flex items-center mb-4">
          <StarRating rating={rating || 0} reviews={reviews || 0} size={20} />
        </div>
      

      {/* Price */}
      <div className="md:text-xl lg:text-xl xl:text-3xl font-bold mb-4 mt-6">
        ₦{" "}
        {typeof displayPrice === "string"
          ? parseFloat(displayPrice.replace(/[^\d.-]/g, "")).toLocaleString(
              "en-NG",
              {
                minimumFractionDigits: 2,
              }
            )
          : displayPrice?.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}
      </div>
      {/* Color and Quantity Section */}
      <div className="my-6">
        <div
          className={`flex ${
            availableColors.length > 0 ? "justify-between" : "justify-start"
          } items-start`}
        >
          {/* Color options - only shown if colors exist */}
          {availableColors.length > 0 && (
            <div className="">
              <div className="md:text-lg lg:text-lg xl:text-xl font-bold mb-2">
                Available color
              </div>
              <div className="flex space-x-4">
                {availableColors.map((color, index) => (
                  <button
                    key={index}
                    className={`${getColorClass(
                      color
                    )} w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedColor === color
                        ? "ring-2 ring-secondary ring-offset-2"
                        : ""
                    }`}
                    onClick={() => handleColorSelect(color)}
                    aria-label={color.name}
                  >
                    {selectedColor === color && (
                      <FaCheck className="text-white text-xs" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity controls - always shown */}
          <div className="flex flex-col items-start mr-12 md:ml-24">
            <div className="md:text-lg lg:text-lg xl:text-xl font-bold mb-2">
              Quantity
            </div>
            <div className="flex -ml-1">
              <button
                onClick={decrementQuantity}
                className="w-6 h-6 text-xl flex items-center justify-center rounded-full"
                aria-label="Decrease quantity"
              >
                <FaMinusCircle className="text-xl text-primary" />
              </button>
              <span className="w-8 text-center text-xl font-semibold">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="w-6 h-6 text-xl flex items-center justify-center rounded-full"
                aria-label="Increase quantity"
              >
                <FaPlusCircle className="text-xl text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Size options */}
      {availableSizes.length > 0 && (
        <div className="mb-6 mt-8">
          <h3 className="md:text-lg font-bold mb-5">
            Available Size: <span className="font-normal ">{selectedSize}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                className={`px-4 py-1 text-sm rounded-4xl border ${
                  selectedSize === size
                    ? "bg-primary text-white"
                    : "bg-white text-gray-800 border-primary"
                }`}
                onClick={() => handleSizeSelect(size)}
                aria-label={`Size ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Stock information */}
      {currentVariant && (
        <div className="mb-4 text-sm text-gray-600">
          {currentVariant.stock_quantity > 0
            ? `${currentVariant.stock_quantity} available in stock`
            : "Out of stock"}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex mt-8 flex-col sm:flex-row gap-3 mb-8">
        <button
          className="flex-1 bg-secondary hover:opacity-85 cursor-pointer text-white py-3 rounded-md font-medium transition-colors"
          aria-label="Add to cart"
        >
          Add to Cart
        </button>
        <button
          className="flex-1 text-orange border border-secondary cursor-pointer text-secondary hover:border-gray-400 py-3 rounded-md font-medium transition-colors"
          aria-label="Add to wishlist"
        >
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}
