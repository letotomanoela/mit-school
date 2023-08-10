import React from "react";
import { useSelector, useDispatch } from "react-redux";

const ClasseBtn = ({ id, text , activeClasse}) => {
  const dispatch = useDispatch();
  const { active, color } = useSelector((state) => ({
    ...state.SidebarReducer,
  }));

  const changeClasse = (e) => {
    if(active === "Etudiant"){
      dispatch({
        type: "CHANGE_CLASSE",
        payload: e.target.id,
      });
      dispatch({
        type: "CHANGE_SKIP",
        payload: 1,
      });
    }
    if(active === "Note"){
      dispatch({
        type: "CHANGE_CLASSE_NOTE",
        payload: e.target.id,
      });
      dispatch({
        type: "CHANGE_SKIP_NOTE",
        payload: 1,
      });
    }
    if(active === "Matieres"){
      dispatch({
        type: "CHANGE_MATIERE_CLASSE",
        payload: e.target.id,
      });
    }
    
  };
  return (
    <button
      onClick={changeClasse}
      id={id}
      className={`px-5 py-2 text-xs font-medium  transition-colors duration-200  sm:text-sm ${
        activeClasse === id && color + " text-white"
      } 0 dark:text-gray-300`}
    >
      {text}
    </button>
  );
};

export default ClasseBtn;
