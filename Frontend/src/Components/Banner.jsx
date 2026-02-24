import { useEffect, useState } from "react";
import banners from "../Data/banners";


function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ⏱ Auto-change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-section">
      <div className="banner-wrapper">
        <div className="image-banner">
          <img
            src={banners[currentIndex].imageUrl}
            alt="Banner"
          />
        </div>
        <div className="banner-overlay"></div>
        
        {/* Navigation Dots */}
        <div className="banner-dots">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
