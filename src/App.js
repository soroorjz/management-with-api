import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import "./App.css";
import LoginPage from "./pages/MainPage/LogIn/LoginPage";
import { SnackbarProvider } from "notistack";
import AccessLevel from "./pages/MainPage/AccessLevel/AccessLevel";
import UserProfile from "./pages/MainPage/UserProfile/UserProfile";
import AccessManager from "./pages/MainPage/AccessManager/AccessManager";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./AuthContext"; // Adjust path based on your AuthContext location
import { firstLoadHandler } from "./apiService";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed queries once
      staleTime: 1000 * 60 * 5, // Default stale time of 5 minutes
    },
  },
});

function App() {
    firstLoadHandler();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          autoHideDuration={3000}
          content={(key, message, options) => {
            const variant = options?.variant || "info";
            return (
              <div key={key} className="loginSnackbar">
                {message}
              </div>
            );
          }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/MainPage" element={<MainPage />} />
              <Route path="/UserProfile" element={<UserProfile />} />
              <Route path="/AccessLevel" element={<AccessLevel />} />
              <Route path="/AccessManager" element={<AccessManager />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
