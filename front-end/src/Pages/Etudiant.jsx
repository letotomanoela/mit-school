import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
export default function Etudiant() {
  let pathname = useLocation().pathname.split("/")[1];
  pathname = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "CHANGE_TITLE",
      payload: pathname,
    });
    dispatch({
      type: "CHANGE_ACTIVE",
      payload: pathname,
    });
  }, []);

  return (
    <>
      
      <Outlet />
    </>
  );
}
