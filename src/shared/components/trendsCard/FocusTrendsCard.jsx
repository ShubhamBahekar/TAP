import React, { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../../../Context/FocusFlowContext";

const FocusTrendsCard = () => {
  const { dailyGoal, isVisible, canvasRef, sessions } = useContext(Context);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
   
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const goalSeconds = dailyGoal * 3600; 
    const barWidth = 30;
    const gap = 10;
    const maxBarHeight = canvasHeight - 40; 
    const leftPadding = 15;

   
    const sessionsByDay = {};
    const today = new Date();
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({ date: date.toDateString(), dayName });
      sessionsByDay[dayName] = 0;
    }

 
    sessions.forEach(session => {
      const sessionDate = new Date(session.timestamp);
      const sessionDateString = sessionDate.toDateString();
      

      const dayData = last7Days.find(day => day.date === sessionDateString);
      if (dayData) {
        sessionsByDay[dayData.dayName] = (sessionsByDay[dayData.dayName] || 0) + session.duration;
      }
    });

    console.log("Sessions by day:", sessionsByDay);
    console.log("Goal seconds:", goalSeconds);

   
    days.forEach((day, i) => {
      const durationInSeconds = sessionsByDay[day] || 0;
      const progressRatio = durationInSeconds / goalSeconds;
      const cappedRatio = Math.min(progressRatio, 1.2); 
      const barHeight = cappedRatio * maxBarHeight;

      const x = i * (barWidth + gap) + leftPadding;
      const y = canvasHeight - barHeight - 25;

   
      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(x, canvasHeight - maxBarHeight - 25, barWidth, maxBarHeight);

   
      if (barHeight > 0) {
       
        if (progressRatio >= 1) {
          ctx.fillStyle = "#28a745"; 
        } else if (progressRatio >= 0.8) {
          ctx.fillStyle = "#ffc107"; 
        } else {
          ctx.fillStyle = "#0d6efd"; 
        }
        ctx.fillRect(x, y, barWidth, barHeight);
      }

  
      ctx.fillStyle = "#6c757d";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(day, x + barWidth/2, canvasHeight - 5);

      console.log(`${day}: ${durationInSeconds}s (${Math.round(durationInSeconds/60)}min), ratio: ${progressRatio.toFixed(2)}, height: ${barHeight}px`);
    });

 
    const goalLineY = canvasHeight - maxBarHeight - 25;
    ctx.strokeStyle = "#dc3545";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(leftPadding, goalLineY);
    ctx.lineTo(canvasWidth - leftPadding, goalLineY);
    ctx.stroke();
    ctx.setLineDash([]);


    ctx.fillStyle = "#dc3545";
    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Goal: ${dailyGoal}h`, canvasWidth - 20, goalLineY - 5);

  }, [sessions, dailyGoal, canvasRef]); 

  const getTodaysFocusTime = () => {
    const today = new Date().toDateString();
    return sessions
      .filter((session) => new Date(session.timestamp).toDateString() === today)
      .reduce((total, session) => total + session.duration, 0);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div
      id="trends-card"
      data-observe
      className={`card shadow-sm transition-opacity ${
        isVisible["trends-card"] ? "opacity-100" : "opacity-50"
      }`}
      style={{ transition: "opacity 1s ease-in-out" }}
    >
      <div className="card-body">
        <h5 className="card-title mb-4">Focus Trends</h5>

        <div className="mb-3">
          <canvas
            ref={canvasRef}
            width={280}
            height={120}
            className="w-100 border rounded"
            style={{ maxHeight: "120px" }}
          />
        </div>

        <div className="d-flex justify-content-between">
          <small className="text-muted">Daily goal: {dailyGoal}h</small>
          <small className="text-muted">Today: {formatDuration(getTodaysFocusTime())}</small>
        </div>
      </div>
    </div>
  );
};

export default FocusTrendsCard;