import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // ⬅️ import AuthProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* ⬅️ wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
