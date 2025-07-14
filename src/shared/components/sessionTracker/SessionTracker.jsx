import { useContext, useState } from "react";
import { Context } from "../../../Context/FocusFlowContext";
import { GeoAlt, PauseCircle, PlayCircle, StopCircle } from "react-bootstrap-icons";

const SessionTracker = () => {
  const {
    dailyGoal,
    networkStatus,
    currentActivity,
    setCurrentActivity,
    formatDuration,
    isSessionActive,
    setIsSessionActive,
    sessionTime,
    setSessionTime,
    sessions,
    setSessions,
    timerRef,
    location,
  } = useContext(Context);

  const [activityInput, setActivityInput] = useState("");

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTodaysFocusTime = () => {
    const today = new Date().toDateString();
    return sessions
      .filter((session) => new Date(session.timestamp).toDateString() === today)
      .reduce((total, session) => total + session.duration, 0);
  };


  const calculateStreak = () => {
    const dailyGoalSeconds = dailyGoal * 3600; 
    const today = new Date();
    let streak = 0;
    
 
    const dailyTotals = {};
    sessions.forEach(session => {
      const sessionDate = new Date(session.timestamp).toDateString();
      if (!dailyTotals[sessionDate]) {
        dailyTotals[sessionDate] = 0;
      }
      dailyTotals[sessionDate] += session.duration;
    });

    let currentDate = new Date(today);
    

    const todaysFocusTime = getTodaysFocusTime();
    if (todaysFocusTime < dailyGoalSeconds) {
      currentDate.setDate(currentDate.getDate() - 1);
    }


    while (true) {
      const dateString = currentDate.toDateString();
      const dayTotal = dailyTotals[dateString] || 0;
      
      if (dayTotal >= dailyGoalSeconds) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const pauseSession = () => {
    setIsSessionActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startSession = () => {
    if (!activityInput.trim()) return;

    setCurrentActivity(activityInput.trim());
    setIsSessionActive(true);
    timerRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
  };

  const stopSession = () => {
    setIsSessionActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (sessionTime > 0) {
      const newSession = {
        id: Date.now(),
        activity: currentActivity || activityInput.trim(), // Use currentActivity first, fallback to activityInput
        duration: sessionTime,
        location: location.name,
        timestamp: new Date().toISOString(),
      };
      
      console.log('Creating new session:', newSession); // Debug log
      setSessions((prev) => [newSession, ...prev]);
    }

    setSessionTime(0);
    setActivityInput("");
    setCurrentActivity("");
  };

  const currentStreak = calculateStreak();

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title mb-4">Session Tracker</h5>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">Connection Status</small>
            <div className="d-flex align-items-center">
              <div
                className={`rounded-circle me-2 ${
                  networkStatus === "online" ? "bg-success" : "bg-danger"
                }`}
                style={{ width: "12px", height: "12px" }}
              ></div>
              <small>
                {networkStatus === "online" ? "Connected" : "Offline Mode"}
              </small>
            </div>
          </div>

          {isSessionActive && (
            <div className="text-center mb-4">
              <div className="display-4 text-primary mb-2">
                {formatTime(sessionTime)}
              </div>
              <div className="text-muted mb-3">{currentActivity}</div>
              <div className="d-flex align-items-center justify-content-center text-muted">
                <GeoAlt size={16} className="me-1" />
                <small>{location.name}</small>
              </div>
            </div>
          )}

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter activity (e.g., Reading, Meditation, Work)"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              disabled={isSessionActive}
            />
          </div>

          <div className="d-flex justify-content-center gap-2">
            {!isSessionActive ? (
              <button
                onClick={startSession}
                disabled={!activityInput.trim()}
                className="btn btn-primary d-flex align-items-center"
              >
                <PlayCircle size={16} className="me-2" />
                Start
              </button>
            ) : (
              <>
                <button
                  onClick={pauseSession}
                  className="btn btn-warning d-flex align-items-center"
                >
                  <PauseCircle size={16} className="me-2" />
                  Pause
                </button>
                <button
                  onClick={stopSession}
                  className="btn btn-danger d-flex align-items-center"
                >
                  <StopCircle size={16} className="me-2" />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        <hr />

        <div>
          <div className="d-flex justify-content-between mb-2">
            <small>Daily goal: {dailyGoal}h</small>
            <small>Today: {formatDuration(getTodaysFocusTime())}</small>
          </div>
          <div className="progress mb-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${Math.min(
                  (getTodaysFocusTime() / (dailyGoal * 3600)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <div className="text-center">
            <small className="text-muted">
              Current streak: {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTracker;