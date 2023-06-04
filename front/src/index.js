import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/reset.css";
import "./styles/index.css";
import "./styles/navbar.css";
import "./styles/home.css";
import "./styles/artist-profile.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
//import { AuthProvider } from "./context/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </React.StrictMode>
);
