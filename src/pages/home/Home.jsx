import { useEffect, useRef } from "react";
import { useContext } from "react";
import { Context } from "../../Context/FocusFlowContext";
import Header from "../../shared/header/Header";
import LocationProductivityCard from "../../shared/components/location/LocationProductivityCard";
import SessionTracker from "../../shared/components/sessionTracker/SessionTracker";
import FocusSessionsCard from "../../shared/components/sessionCard/FocusSessionsCard";
import QuoteCard from "../../shared/components/quoteCard/QuoteCard";
import FocusTrendsCard from "../../shared/components/trendsCard/FocusTrendsCard";

const Home = () => {
  const {
    setNetworkStatus,
    setIsVisible,
    timerRef,
    backgroundTaskRef,
    setLocation,
    updateMotivationalQuote
  } = useContext(Context);
  
  const observerRef = useRef(null);

  // Geolocation API - Auto-detect location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation({ name: "Location not supported", coords: null });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();

          let locationName = "Current Location";
          if (data.city && data.principalSubdivision) {
            locationName = `${data.city}, ${data.principalSubdivision}`;
          } else if (data.locality) {
            locationName = data.locality;
          }

          setLocation({
            name: locationName,
            coords: { lat: latitude, lng: longitude },
          });
        } catch (error) {
          console.log("Reverse geocoding failed:", error);
          setLocation({
            name: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            coords: { lat: latitude, lng: longitude },
          });
        }
      },
      (error) => {
        console.log("Location access error:", error);
        let errorMessage = "Location unavailable";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location timeout";
            break;
        }

        setLocation({ name: errorMessage, coords: null });
      },
      options
    );
  };

  // Network Information API
  const checkNetworkStatus = () => {
    if (navigator.onLine) {
      setNetworkStatus("online");
    } else {
      setNetworkStatus("offline");
    }
  };

  // Intersection Observer API
  const setupIntersectionObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-observe]");
    elements.forEach((el) => observerRef.current.observe(el));
  };

  useEffect(() => {
    getCurrentLocation();
    checkNetworkStatus();
    setupIntersectionObserver();

    const quoteInterval = setInterval(updateMotivationalQuote, 30000);

    window.addEventListener("online", checkNetworkStatus);
    window.addEventListener("offline", checkNetworkStatus);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (backgroundTaskRef.current) {
        clearTimeout(backgroundTaskRef.current);
      }
      clearInterval(quoteInterval);
      window.removeEventListener("online", checkNetworkStatus);
      window.removeEventListener("offline", checkNetworkStatus);
    };
  }, []);

  const DashboardView = () => (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-xl-10">
          <QuoteCard />

          <div className="row g-4">
            <div className="col-lg-4">
              <SessionTracker />
            </div>

            <div className="col-lg-8">
              <div className="row g-4">
                <div className="col-12">
                  <FocusSessionsCard />
                </div>
                <div className="col-md-6">
                  <LocationProductivityCard />
                </div>
                <div className="col-md-6">
                  <FocusTrendsCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-light">
      <Header />
      <div className="container-fluid">
        <DashboardView />
      </div>
    </div>
  );
};

export default Home;