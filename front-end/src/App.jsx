import "./App.css";
import Layout from "./layouts/Layout";
import ThemeContextProvider from "./context/ThemeContext";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./layouts/LandingPage";
import Login from "./layouts/Login";
import PrivateRoute from "./utils/PrivateRoute";
import SignUp from "./layouts/SignUp";
import StudentLayout from "./layouts/StudentLayout";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
import { useSelector } from "react-redux";

function App() {
  const { role } = useSelector((state) => ({
    ...state.AuthReducer,
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route
              path="*"
              element={
                role === "user" ? (
                  <StudentLayout />
                ) : (
                  role === "admin" && <Layout />
                )
              }
            />
          </Route>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

export default App;
