import {useEffect, useState} from "react";
import { useCart } from "../../hooks/useCartContext";
import {useLocation, useNavigate} from "react-router-dom";
import AssetsConstant from "../../consts/AssetsConstant";

const ProductDetail = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showExpandedImage, setShowExpandedImage] = useState(false);
  const { addToCart } = useCart();

  const formatPrice = (price: number | undefined) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  useEffect(() => {
    // Disable smooth scrolling temporarily
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    // Re-enable smooth scrolling after scrolling to top
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 0);
  }, [location.pathname]);

  // Replace current route to prevent scroll issues
  if (location.state?.shouldReplace) {
    navigate(location.pathname, { replace: true, state: { ...location.state, shouldReplace: false } });
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      product.productId,
      product.productId,
      product.name,
      product.currentPrice,
      product.thumbnailUrl,
      quantity
    );
  };

  const toggleExpandImage = () => {
    setShowExpandedImage(!showExpandedImage);
  };

  return (
    <div className="container product-detail mt-4" key={location.key}>
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <span>Categories: </span>
        <span>Apple Macbook, Laptops</span>
      </div>

      {/* Product Details Section */}
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <div className="product-image-container">
            <img
              src={product?.thumbnailUrl}
              alt={product?.name}
              className="img-fluid"
              onClick={toggleExpandImage}
            />
            <button className="expand-button" onClick={toggleExpandImage}>
              <img src={AssetsConstant.EXPAND_ICON} alt="expand" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h1 className="product-title">{product?.name}</h1>

          {/* Price Section */}
          <div className="price-section">
            <span className="current-price">{formatPrice(product?.currentPrice)}</span>
            <span className="original-price">{formatPrice(product?.basePrice)}</span>
          </div>

          {/* Product Specs Box */}
          <div className="product-info-box mt-4">
            <table className="product-info-table">
              <tbody>
                <tr>
                  <td className="info-label">Brand:</td>
                  <td className="info-value">{product?.brand || "N/A"}</td>
                </tr>
                <tr>
                  <td className="info-label">Available Quantity:</td>
                  <td className="info-value">{product?.totalQuantity}</td>
                </tr>
                <tr>
                  <td className="info-label">Processor:</td>
                  <td className="info-value">{product?.additionalAttributes?.processor || "N/A"}</td>
                </tr>
                <tr>
                  <td className="info-label">Ram:</td>
                  <td className="info-value">{product?.additionalAttributes?.ram || "N/A"}</td>
                </tr>
                <tr>
                  <td className="info-label">Storage:</td>
                  <td className="info-value">{product?.additionalAttributes?.storage || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add to Cart Section */}
          <div className="add-to-cart-section mt-4">
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="0"
              max={product?.totalQuantity}
              className="quantity-input"
            />
            <button
              className="btn btn-primary add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={quantity === 0 || quantity > product?.totalQuantity}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showExpandedImage && (
        <div className="image-modal" onClick={toggleExpandImage}>
          <div className="modal-content">
            <button className="close-button" onClick={toggleExpandImage}>
              <img src={AssetsConstant.CLOSE_ICON} alt="close" />
            </button>
            <img
              src={product?.thumbnailUrl}
              alt={product?.name}
              className="expanded-image"
            />
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="product-tabs mt-5">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab-button ${activeTab === "additional" ? "active" : ""}`}
            onClick={() => setActiveTab("additional")}
          >
            Additional information
          </button>
          <button
            className={`tab-button ${activeTab === "review" ? "active" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            Review (1)
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <div>
              <p>{product?.description}</p>
            </div>
          )}
          {activeTab === "additional" && (
            <div>
              <h3>Additional Information</h3>
              <div className="product-info-box mt-4">
                <table className="product-info-table">
                  <tbody>
                    <tr>
                      <td className="info-label">Base Price:</td>
                      <td className="info-value">${product?.basePrice}</td>
                    </tr>
                    <tr>
                      <td className="info-label">Current Price:</td>
                      <td className="info-value">${product?.currentPrice}</td>
                    </tr>
                    <tr>
                      <td className="info-label">Cost Price:</td>
                      <td className="info-value">${product?.costPrice}</td>
                    </tr>
                    <tr>
                      <td className="info-label">Total Quantity:</td>
                      <td className="info-value">{product?.totalQuantity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "review" && (
            <div>
              <h3>Reviews</h3>
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
