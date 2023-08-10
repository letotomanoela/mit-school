import React from "react";

import Sidebar from "../Components/Sidebar/Sidebar";
import BodyContent from "./BodyContent";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Etudiant from "../Pages/Etudiant";
import Matieres from "../Pages/Matieres";
import Note from "../Pages/Note";
import Dashboard from "../Pages/Dashboard";
import ListeEtudiant from "../Pages/Etudiant/ListeEtudiant";
import AjouterEtudiant from "../Pages/Etudiant/AjouterEtudiant";
import ListeNote from "../Pages/Note/ListeNote";
import ReleveNote from "../Pages/Note/ReleveNote";


export default function Layout() {
  
  const dispatch = useDispatch();
  const { size } = useSelector((state) => ({
    ...state.SidebarReducer,
  }));

  return (
    <>
      <div
        className={`grid h-screen overflow-x-hidden   ${
          size === "full" ? "grid-cols-[250px,1fr]" : "grid-cols-[60px,1fr]"
        } print:grid-cols-[1fr]`}
      >
        <Sidebar />
        <div className="body-content w-full overflow-x-hidden col-[2] dark:bg-zinc-950 text-black dark:text-white transition-colors duration-500">
          <Routes>
            <Route path="" element={<BodyContent />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/etudiant" element={<Etudiant />}>
                <Route path="/etudiant" element={<ListeEtudiant />} />
                <Route
                  path="/etudiant/ajouter-etudiant"
                  element={<AjouterEtudiant />}
                />
              </Route>
              <Route path="/matieres" element={<Matieres />}></Route>
              <Route path="/note" element={<Note />}>
                <Route path="/note" element={<ListeNote />} />
                <Route path="/note/releve-de-note" element={<ReleveNote/>}/> 
                <Route path="/note/releve-de-note/:id" element={<ReleveNote/>}/> 
              </Route>
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}
