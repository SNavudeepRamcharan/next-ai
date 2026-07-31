import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { ThemeProvider } from "./context/ThemeContext";

import {
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <AuthProvider>
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);