import { useContext } from "react";
import {Context} from "../../Context/FocusFlowContext";
import Header from "../../shared/header/Header";

const Settings = () => {

    const {
        dailyGoal,setDailyGoal
    } = useContext(Context);

  return (
     <div className="container-fluid gx-0">
      <Header />
      <div className="col-12 py-2">
      <div className="row justify-content-center">
        <div className="col-xl-6">
          <h1 className="h2 mb-4">Settings</h1>

          <div className="row g-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">Location</h5>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Current location</span>
                      <span className="text-muted">{location.name}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Set location automatically</span>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="autoLocationSwitch"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">Focus Goal</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Daily focus goal (hours)</span>
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: "80px" }}
                      min="1"
                      max="24"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Settings