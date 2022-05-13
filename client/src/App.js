// Dependencies
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Component and Function Imports
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Template/Header";
import SessionDetails from "./components/Session/SessionDetails";
import Auth from "./components/Auth/Auth";
import UserProfile from "./components/Template/UserProfile";
import Notification from "./components/Notification/Notification";
import { getLocalToken } from "./utils/localStorage";

const App = () => {
  const [token, setToken] = useState(getLocalToken());

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return (
    <div style={{ background: "#e9f4f7", height: "100%", width: "100%", position: "absolute" }}>
      <BrowserRouter>
        <Header setToken={setToken} />
        <Routes>
          <Route 
            exact 
            path="/" 
            element={<Dashboard />} 
          />

          <Route
            exact
            path="/session"
            element={<SessionDetails setToken={setToken} />}
          />
          
          <Route 
            exact 
            path="/notification" 
            element={<Notification />} 
          />

          <Route 
            exact 
            path="/user" 
            element={<UserProfile />} 
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
