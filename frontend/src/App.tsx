import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      {/* Toast notifications for collaboration module and other features */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f1f1f",
            color: "#fff",
            border: "1px solid #38AE56",
          },
          success: {
            iconTheme: {
              primary: "#38AE56",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#e74c3c",
              secondary: "#fff",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
