import React from 'react'
import { useContext } from "react";
import {Context} from "../../../Context/FocusFlowContext";
import { Alarm, GeoAlt } from 'react-bootstrap-icons';
const FocusSessionsCard = () => {

 const {formatDuration,sessions,isVisible} = useContext(Context);

  return (
    <div
          id="sessions-card"
          data-observe
          className={`card shadow-sm transition-opacity ${
            isVisible["sessions-card"] ? "opacity-100" : "opacity-50"
          }`}
          style={{ transition: "opacity 1s ease-in-out" }}
        >
          <div className="card-body">
            <h5 className="card-title mb-4">Focus Sessions</h5>
    
            <div className="list-group list-group-flush">
              {sessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className="list-group-item d-flex justify-content-between align-items-center border-0 bg-light rounded mb-2"
                >
                  <div className="d-flex align-items-center">
                    <Alarm size={20} className="text-primary me-3" />
                    <div>
                      <div className="fw-medium">
                        {formatDuration(session.duration)}
                      </div>
                      <small className="text-muted">{session.activity}</small>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-muted">
                      <small>
                        {new Date(session.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <GeoAlt size={12} className="me-1" />
                      <small>{session.location}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default FocusSessionsCard