import React from "react";
import { useSelector } from "react-redux";

export default function NavbarLink({ title, active }) {
  const { color } = useSelector((state) => ({
    ...state.SidebarReducer,
  }));

  return (
    <div className="h-full w-max flex items-center relative mr-2">
      <span className="block">{title}</span>
      <div
        className={`${
          active ? "w-full" : "w-0"
        }  h-1 ${color} absolute bottom-0 ease-linear duration-500`}
      ></div>
    </div>
  );
}
