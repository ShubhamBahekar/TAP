import { useContext, useEffect, useState } from "react";
import { Context } from "../../Context/FocusFlowContext";
import { Bullseye, Wifi, WifiOff } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const { networkStatus, canvasRef } = useContext(Context);
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");

  useEffect(() => {
    if (currentView === "dashboard") {
      setTimeout(() => {
        drawFocusTrends();
      }, 100);
    }
  }, [currentView]);

  const drawFocusTrends = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const data = [2, 3, 1, 4, 3, 2, 4];
    const maxValue = Math.max(...data);
    const barWidth = width / data.length;

    ctx.fillStyle = "#6f42c1";
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * height * 0.8;
      const x = index * barWidth;
      const y = height - barHeight;

      ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
    });

    ctx.strokeStyle = "#6f42c1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = index * barWidth + barWidth / 2;
      const y = height - (value / maxValue) * height * 0.8;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center">
          <Bullseye className="me-2" size={32} />
          <span className="h4 mb-0">TAP</span>
        </div>

        <div className="navbar-nav flex-row me-auto mb-2 mb-lg-0">
          <button
            onClick={() => {
              setCurrentView("dashboard");
              navigate("/");
            }}
            className={`nav-link btn btn-link text-white me-3 ${
              currentView === "dashboard" ? "active fw-bold" : ""
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              setCurrentView("sessions");
              navigate("/sessions");
            }}
            className={`nav-link btn btn-link text-white me-3 ${
              currentView === "sessions" ? "active fw-bold" : ""
            }`}
          >
            Sessions
          </button>

          <button
            onClick={() => {
              setCurrentView("statistics");
              navigate("/statistics");
            }}
            className={`nav-link btn btn-link text-white me-3 ${
              currentView === "statistics" ? "active fw-bold" : ""
            }`}
          >
            Statistics
          </button>

          <button
            onClick={() => {
              setCurrentView("settings");
              navigate("/settings");
            }}
            className={`nav-link btn btn-link text-white me-3 ${
              currentView === "settings" ? "active fw-bold" : ""
            }`}
          >
            Settings
          </button>
        </div>

        <div className="d-flex align-items-center text-white">
          {networkStatus === "online" ? (
            <Wifi className="me-2 text-success" size={20} color="white"/>
          ) : (
            <WifiOff className="me-2 text-danger" size={20} color="red"/>
          )}
          <small>{networkStatus === "online" ? "Connected" : "Offline"}</small>
        </div>
      </div>
    </nav>
  );
};

export default Header;
