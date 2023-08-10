import React, { useState, useContext, useEffect } from "react";
import Navlink from "./Navlink";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import ColorBtn from "./ColorBtn";
import { Link, redirect, useNavigate } from "react-router-dom";
import { data } from "./data";
import { container, item, dropIn } from "../animation";
import Logo from "../Logo/Logo";

export default function Sidebar() {
  const { toggleTheme, dark } = useContext(ThemeContext);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  const dispatch = useDispatch();
  const { size, active, color, role } = useSelector((state) => ({
    ...state.SidebarReducer,
    ...state.AuthReducer,
  }));

  const variants = {
    open: { width: "250px" },
    closed: { width: "60px" },
  };

  const toggleSidebar = () => {
    if (size === "full") {
      dispatch({
        type: "TOGGLE_SIZE",
        payload: "mini",
      });
    } else {
      dispatch({
        type: "TOGGLE_SIZE",
        payload: "full",
      });
    }
  };

  const logOut = () => {
    dispatch({
      type: "LOG_OUT",
    });
  };

  return (
    <motion.div
      animate={size === "full" ? "open" : "closed"}
      variants={variants}
      className={`sidebar print:hidden z-40 col-[1]  fixed top-0 left-0 bg-slate-200 dark:bg-gray-950 transition-colors duration-500 dark:text-white h-full  ${
        size === "full" ? "w-[250px]" : "w-[60px]"
      }`}
    >
      <div className="logo-container pb-8 relative">
        <div
          className={`logo-info ${
            size === "full" ? " px-4" : " px-1"
          }   mt-8 flex justify-between items-center`}
        >
          <div className="font-bold text-xl flex items-center space-x-2">
            <Logo />
            {size === "full" && (
              <AnimatePresence>
                <motion.div
                  key={1}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropIn}
                  className="text-3xl"
                >
                  MIT
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {size === "full" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseEnter={() => {
                setShowTooltip(true);
              }}
              onMouseLeave={() => {
                setShowTooltip(false);
              }}
              className="dark-switch-container relative w-14 h-7 bg-slate-300 dark:bg-slate-800   rounded-2xl flex items-center px-1"
            >
              <div
                onClick={toggleTheme}
                className={`btn-switcher cursor-pointer w-6 h-6 bg-white dark:bg-zinc-600 rounded-full ${
                  dark ? "translate-x-6" : "translate-x-0"
                } ease-in-out duration-300`}
              ></div>
              {showTooltip && (
                <AnimatePresence
                  initial={false}
                  wait={true}
                  onExitComplete={() => null}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="absolute z-30 flex items-center justify-center w-max p-3 text-datk bg-slate-200 rounded-lg shadow-lg left-16 -top-4 dark:shadow-none shadow-gray-200 dark:bg-gray-800 dark:text-white"
                  >
                    <span className="truncate text-sm ">
                      {dark
                        ? "Changer en mode clair"
                        : "Changer en mode sombre"}
                    </span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute w-6 h-6 text-slate-200  transform rotate-45 -translate-y-1/2 fill-current -left-3 top-1/2 dark:text-gray-800"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path>
                    </svg>
                  </motion.p>
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </div>
        <div
          onClick={toggleSidebar}
          className={`closed-container flex items-center justify-center text-white font- btn-switcher cursor-pointer w-7 h-7  ${color} rounded-full absolute -right-3 -bottom-5 `}
        >
          {size !== "full" ? <AiOutlineRight /> : <AiOutlineLeft />}
        </div>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className={`navlinks-section  ${size === "mini" ? "px-2" : "px-4"}`}
      >
        <p className="mb-4"></p>

        {data.map((d, index) => (
          <motion.div key={index} variants={item}>
            {d.role === role && (
              <Link to={d.to}>
                <Navlink
                  title={d.title}
                  active={active === d.title ? "active" : ""}
                />
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className={`sidebar-bottom px-4 w-full ${
          size === "mini" && "px-2"
        } absolute bottom-5 `}
      >
        <motion.div
          variants={item}
          onClick={() => setShowSetting(!showSetting)}
          className="cursor-pointer"
        >
          <Navlink title={"Changer le thème"} />
        </motion.div>
        {size === "full" && showSetting && (
          <div
            className={`colors-changer h-20 relative  w-full ease-linear duration-300`}
          >
            <div className="flex items-center justify-between py-2 ">
              <ColorBtn color="primary" />
              <ColorBtn color="default" />
              <ColorBtn color="info" />
              <ColorBtn color="danger" />
              <ColorBtn color="warning" />
            </div>
          </div>
        )}

        {role === "user" && (
          <motion.span variants={item} className="cursor-pointer">
            <Link to="/parametre">
              <Navlink
                title={"Paramètres"}
                active={active === "Paramètres" ? "active" : ""}
              />
            </Link>
          </motion.span>
        )}

        <motion.span
          variants={item}
          onClick={logOut}
          className="cursor-pointer"
        >
          <Navlink title={"Déconnecter"} />
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
