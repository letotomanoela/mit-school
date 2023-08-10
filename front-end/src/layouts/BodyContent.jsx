import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar/Navbar";
import { SkeletonTheme } from "react-loading-skeleton";

import { ThemeContext } from "../context/ThemeContext";
export default function BodyContent() {
  const { title } = useSelector((state) => ({
    ...state.titlePageReducer,
  }));
  const { highlightColor, baseColor } = useContext(ThemeContext);

  return (
    <div className="body-content w-full">
      <div className="print:hidden page-title sticky top-0 z-10 backdrop-filter backdrop-blur-lg bg-opacity-30 dark:bg-opacity-80 bg-white dark:bg-gray-950 text-2xl font-semibold w-full py-4 pl-4">
        {title}
      </div>
      {title === "Etudiant"  && <Navbar />}
      {title === "Note"  && <Navbar />}
      <div className="px-4 w-full overflow-hidden print:px-0">
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
          <Outlet />
        </SkeletonTheme>
      </div>
    </div>
  );
}
