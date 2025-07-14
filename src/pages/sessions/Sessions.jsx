import { useContext } from "react";
import {Context} from "../../Context/FocusFlowContext";
import { Alarm, GeoAlt } from "react-bootstrap-icons";
import Header from "../../shared/header/Header";

const Sessions = () => {
  const { formatDuration, sessions } = useContext(Context);

  return (
    <div className="container-fluid gx-0 ">
       <Header />
      <div className="row justify-content-center">
        <div className="col-xl-8">
          <h1 className="h2 mb-4">All Sessions</h1>

          <div className="row g-3">
            {sessions.map((session) => (
              <div key={session.id} className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                          <Alarm size={24} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1">{session.activity}</h6>
                          <small className="text-muted">
                            {formatDuration(session.duration)}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="text-muted">
                          <small>
                            {new Date(session.timestamp).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex align-items-center justify-content-end text-muted">
                          <GeoAlt size={12} className="me-1" />
                          <small>{session.location}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
