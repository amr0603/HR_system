import { Routes,Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/DashBord/Dashboard";
import Authregister from "./pages/DashBord/Authregister";
function App() {
  return (
    <>
    <Routes>
      <Route path="/*" element ={<Authregister/>}/>
      <Route path="/dashboard" element={<Dashboard />}></Route>
    </Routes>
      
    </>
  );
}

export default App;
