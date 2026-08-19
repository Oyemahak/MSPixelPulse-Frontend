// src/main.jsx

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import "./index.css";
import "./styles/blog-mobile.css";
import "./styles/project-card-actions.css";

import { AuthProvider } from "@/context/AuthContext.jsx";
import { installApiReliability } from "./lib/apiReliability.js";

installApiReliability();

createRoot(
  document.getElementById("root"),
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);