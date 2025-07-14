import { useRef, useState, useEffect } from "react";
import { Context } from "./FocusFlowContext";
import { meditationQuotes } from "../data/MeditationQuotes";

const FocusFlowContextProvider = ({ children }) => {
  const [currentActivity, setCurrentActivity] = useState("");
  const [dailyGoal, setDailyGoal] = useState(1);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? "online" : "offline");
  const [isVisible, setIsVisible] = useState({});
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const canvasRef = useRef(null);
  const [location, setLocation] = useState({ name: "Unknown", coords: null });
  const timerRef = useRef(null);
  const backgroundTaskRef = useRef(null);
  const [motivationalQuote, setMotivationalQuote] = useState(
    "In the depths of winter, I finally learned that within me there lay an invincible summer."
  );
  const [sessions, setSessions] = useState([]);

  // Network detection effect
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? "online" : "offline");
    };

    // More reliable network detection using fetch to a reliable endpoint
    const checkNetworkConnectivity = async () => {
      if (!navigator.onLine) {
        setNetworkStatus("offline");
        return;
      }

      try {
        const response = await fetch('https://httpbin.org/get', {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        setNetworkStatus(response.ok ? "online" : "offline");
      } catch (error) {
        // Fallback to a more reliable test
        try {
          await fetch('https://www.google.com/favicon.ico', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000)
          });
          setNetworkStatus("online");
          console.error(error);
        } catch (fallbackError) {
          setNetworkStatus("offline");
          console.error(fallbackError);
        }
      }
    };

    // Initial check
    updateNetworkStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Periodic connectivity check (every 10 seconds to reduce frequency)
    const connectivityInterval = setInterval(checkNetworkConnectivity, 10000);

    // Cleanup
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      clearInterval(connectivityInterval);
    };
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      if (minutes > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${hours}h`;
    }
    
    if (minutes > 0) {
      if (remainingSeconds > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${minutes}m`;
    }
    
    return `${remainingSeconds}s`;
  };

  const updateMotivationalQuote = () => {
    const randomQuote =
      meditationQuotes[Math.floor(Math.random() * meditationQuotes.length)];
    setMotivationalQuote(randomQuote);
  };

  return (
    <Context.Provider
      value={{
        currentActivity,
        setCurrentActivity,
        formatDuration,
        sessions,
        setSessions,
        dailyGoal,
        setDailyGoal,
        networkStatus,
        setNetworkStatus,
        canvasRef,
        isVisible,
        setIsVisible,
        isSessionActive,
        setIsSessionActive,
        sessionTime,
        setSessionTime,
        timerRef,
        backgroundTaskRef,
        updateMotivationalQuote,
        motivationalQuote,
        location,
        setLocation,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default FocusFlowContextProvider;