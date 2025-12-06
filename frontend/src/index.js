
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { OIDC_CONFIG } from "./config";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...OIDC_CONFIG}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
