import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../Components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../Pages/StudentSection/StudentDashboard";
import BodyContent from "./BodyContent";

import Bulletin from "../Pages/StudentSection/Bulletin";
import Parametre from "../Pages/Parametre/Parametre";

const StudentLayout = () => {
  const { size } = useSelector((state) => ({
    ...state.SidebarReducer,
  }));
  return (
    <div
      className={`grid h-screen overflow-x-hidden   ${
        size === "full" ? "grid-cols-[250px,1fr]" : "grid-cols-[60px,1fr]"
      } print:grid-cols-[1fr]`}
    >
      <Sidebar />
      <div className="body-content w-full overflow-x-hidden col-[2] dark:bg-zinc-950 text-black dark:text-white transition-colors duration-500">
        <Routes>
          <Route path="" element={<BodyContent />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/releve" element={<Bulletin />} />
            <Route path="/parametre" element={<Parametre/>} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default StudentLayout;
