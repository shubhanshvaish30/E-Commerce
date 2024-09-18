import React, { useState } from "react";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/SideBar/Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import Show from "./pages/Show/Show";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { url } from "./utils/constant";
import { useSelector } from "react-redux";
import Error from "./components/Error/Error";
import Report from "./pages/Report/Report";

function App() {
  const { token } = useSelector(state => state.auth);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const shouldShowSidebar = token && !isAuthPage;

  return (
    <div>
      <ToastContainer />
      <Navbar setShowLogin={setShowLogin} />
      <hr />
      <div className="content">
        {shouldShowSidebar && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login setShowLogin={setShowLogin} />} />
            <Route path="/signup" element={<Login setShowLogin={setShowLogin} />} />
            <Route
              path="/add"
              element={
                token ? <Add url={url} /> : <Navigate to="/error" replace />
              }
            />
            <Route
              path="/show"
              element={
                token ? <Show url={url} /> : <Navigate to="/error" replace />
              }
            />
            <Route
              path="/orders"
              element={
                token ? <Orders url={url} /> : <Navigate to="/error" replace />
              }
            />
            <Route path="/error" element={<Error />} />
            <Route path="/" element={token ? <Report /> : <Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
