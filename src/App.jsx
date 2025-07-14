import Home from "./pages/home/Home";
import Settings from "./pages/settings/Settings";
import Sessions from "./pages/sessions/Sessions";
import Statistics from "./pages/statistics/Statistics";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FocusFlowContextProvider from "./Context/FocusFlowProvider";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <FocusFlowContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </FocusFlowContextProvider>
    </>
  );
}

export default App;
