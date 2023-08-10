import React from "react";
import {
  TiThLargeOutline,
  TiMortarBoard,
  TiTags,
  TiUserOutline,
  TiGroupOutline,
} from "react-icons/ti";
import {AiOutlineSetting} from 'react-icons/ai'
import { SlLogout } from "react-icons/sl";
import { TbSettings2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
export default function Navlink({ title, active }) {
  const dispatch = useDispatch();
  const { size } = useSelector((state) => ({
    ...state.SidebarReducer,
  }));

  return (
    <div
      className={`navlink flex py-2 mb-2  items-center rounded ${
        active === "active" && "bg-white dark:bg-slate-600"
      } `}
    >
      <div className={`icon mr-2 pl-2   ${active === "active" && "text-slate-600 dark:text-slate-200"}`}>
        {title === "Dashboard" && <TiThLargeOutline size={"24px"} />}
        {title === "Etudiant" && <TiGroupOutline size={"24px"} />}
        {title === "Reviews" && <TiTags size={"24px"} />}
        {title === "Note" && <TiUserOutline size={"24px"} />}
        {title === "Paramètres" && <AiOutlineSetting size={"24px"} />}
      
    
        {title === "Matieres" && <TiMortarBoard size={"24px"} />}
        {title === "Relevé de notes" && <TiMortarBoard size={"24px"} />}
        {title === "Goals" && <TiThLargeOutline size={"24px"} />}
        {title === "Déconnecter" && <SlLogout size={"24px"} />}
        {title === "Changer le thème" && <TbSettings2 size={"24px"} />}
      </div>

      <AnimatePresence initial={false} wait={true} onExitComplete={() => null}>
        {size === "full" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`title ${active === "active" && "text-slate-600 dark:text-slate-200"}`}
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
