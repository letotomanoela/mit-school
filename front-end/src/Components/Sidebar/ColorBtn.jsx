import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function ColorBtn({ color }) {
  const dispatch = useDispatch();

  const changeColor = () => {
    dispatch({
      type: "CHANGE_COLOR",
      payload: color,
    });
    console.log("clicked");
  };

  return (
    <div
      onClick={changeColor}
      className={`w-8 h-8 rounded-full ${color} cursor-pointer`}
    ></div>
  );
}
