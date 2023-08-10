import React from "react";
import NavbarLink from "./NavbarLink";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { activeNav, active } = useSelector((state) => ({
    ...state.NavbarReducer,
    ...state.SidebarReducer,
  }));

  // console.log(active);

  return (
    <nav className="w-full h-12 bg-slate-50 dark:bg-slate-950 px-4 flex print:hidden">
      {active === "Etudiant" && (
        <>
          <Link to="/etudiant">
            <NavbarLink
              title="Liste des étudiants"
              active={activeNav === "liste-etudiant" ? true : false}
            />
          </Link>
          <Link to="/etudiant/ajouter-etudiant">
            <NavbarLink
              title="Ajouter un étudiant"
              active={activeNav === "ajouter-etudiant" ? true : false}
            />
          </Link>
        </>
      )}
      {active === "Note" && (
        <>
          <Link to="/note">
            <NavbarLink
              title="Liste des notes"
              active={activeNav === "liste-note" ? true : false}
            />
          </Link>

          <NavbarLink
            title="Relevé des notes"
            active={activeNav === "releve-de-note" ? true : false}
          />
        </>
      )}
    </nav>
  );
}
