import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Pages/Home";
import UseGetcurrentuser from "./hooks/UseGetcurrentuser";
import { useSelector } from "react-redux";

import Dashboard from "./Pages/Dashboard";
import Generate from "./Pages/Generate";
import Editor from "./Pages/Editor";
import Pricing from "./Pages/pricing";

const App = () => {
  // Get current logged-in user
  UseGetcurrentuser();

  const { userData } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={
            userData ? (
              <Dashboard />
            ) : (
              <Home/>
            )
          }
        />

        <Route
          path="/generate"
          element={
            userData ? (
              <Generate />
            ) : (
              <Home/>
            )
          }
        />
        <Route
          path="/pricing"
          element={
           <Pricing/>
          }
        />
         <Route
          path="/editor/:id"
          element={
            userData ? (
              <Editor/>
            ) : (
              <Home/>
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;