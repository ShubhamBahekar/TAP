import { useContext } from "react";
import {Context} from "../../../Context/FocusFlowContext";
import { GeoAlt } from "react-bootstrap-icons";
const LocationProductivityCard = () => {

  const {isVisible,sessions,location} = useContext(Context);

  return (
    <div
          id="location-card"
          data-observe
          className={`card shadow-sm text-center transition-opacity ${
            isVisible["location-card"] ? "opacity-100" : "opacity-50"
          }`}
          style={{ transition: "opacity 1s ease-in-out" }}
        >
          <div className="card-body">
            <h5 className="card-title mb-4">Location-based Productivity</h5>
    
            <div className="d-flex justify-content-center mb-4">
              <div
                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                style={{ width: "120px", height: "120px" }}
              >
                <div
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <GeoAlt size={32} className="text-white" />
                </div>
              </div>
            </div>
    
            <div>
              <h6 className="fw-bold">{location.name}</h6>
              <small className="text-muted">
                Total sessions:{" "}
                {sessions.filter((s) => s.location === location.name).length}
              </small>
            </div>
          </div>
        </div>
  )
}

export default LocationProductivityCard