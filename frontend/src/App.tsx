import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IncidentsPage from "./pages/IncidentPages";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IncidentsPage />} />
        <Route path="/incident/new" element={<CreateIncidentPage />} />
        <Route path="/incident/:id" element={<IncidentDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
