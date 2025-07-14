import React from "react";
import { useContext } from "react";
import { Context } from "../../Context/FocusFlowContext";
import { Award, CalendarDate, GraphUp } from "react-bootstrap-icons";
import Header from "../../shared/header/Header";

const Statistics = () => {
  const { formatDuration, sessions, dailyGoal } = useContext(Context);

  const getTotalFocusTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
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
    
  
    const todayString = today.toDateString();
    const todaysFocusTime = dailyTotals[todayString] || 0;
    
  
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


  const getActivityBreakdown = () => {
    const activityTotals = sessions.reduce((acc, session) => {
      const activity = session.activity && session.activity.trim() 
        ? session.activity.trim() 
        : 'Unknown Activity';
      acc[activity] = (acc[activity] || 0) + session.duration;
      return acc;
    }, {});
    
    
    return Object.entries(activityTotals)
      .sort(([, durationA], [, durationB]) => durationB - durationA);
  };

  const currentStreak = calculateStreak();
  const activityBreakdown = getActivityBreakdown();

  return (
    <div className="container-fluid gx-0">
      <Header />
      <div className="row justify-content-center">
        <div className="col-xl-8">
          <h1 className="h2 mb-4">Statistics</h1>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                  <GraphUp size={32} className="text-primary mb-3" />
                  <h4 className="card-title">
                    {formatDuration(getTotalFocusTime())}
                  </h4>
                  <small className="text-muted">Total Focus Time</small>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                  <CalendarDate size={32} className="text-success mb-3" />
                  <h4 className="card-title">{sessions.length}</h4>
                  <small className="text-muted">Total Sessions</small>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                  <Award size={32} className="text-warning mb-3" />
                  <h4 className="card-title">{currentStreak}</h4>
                  <small className="text-muted">Day Streak</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Activity Breakdown</h5>
              {activityBreakdown.length > 0 ? (
                <div className="list-group list-group-flush">
                  {activityBreakdown.map(([activity, duration]) => (
                    <div
                      key={activity}
                      className="list-group-item d-flex justify-content-between align-items-center border-0"
                    >
                      <span>{activity}</span>
                      <span className="text-muted">
                        {formatDuration(duration)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <p>No sessions recorded yet.</p>
                  <small>Start your first focus session to see activity breakdown here.</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;