import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const LayoutPublic = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) return navigate("/app/home");
  }, [auth]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default LayoutPublic;