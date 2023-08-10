import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { token } = useSelector((state) => ({
    ...state.AuthReducer,
  }));

  return token !== null ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
