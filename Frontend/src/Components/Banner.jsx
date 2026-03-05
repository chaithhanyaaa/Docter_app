import { useEffect, useState } from "react";
import API from "../api/axios";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await API.get('/banners');
        if (response.data && response.data.length > 0) {
          setBanners(response.data);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError('Failed to load banners');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="banner-section">
        <div className="banner-wrapper">
          <div className="banner-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return null;
  }

  return (
    <div className="banner-section">
      <div className="banner-wrapper">
        <div className="image-banner">
          <img
            src={`data:image/jpeg;base64,${banners[currentIndex]?.imageData}`}
            alt={banners[currentIndex]?.title || "Banner"}
          />
        </div>
        <div className="banner-overlay"></div>

        {banners.length > 1 && (
          <div className="banner-dots">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Banner;