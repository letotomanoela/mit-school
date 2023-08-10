import React from "react";
import Logo from "../Logo/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { dropIn } from "../animation";
import { Link } from "react-router-dom";

const NavbarLanding = () => {
  return (
    <nav className="w-full h-16 bg-slate-50 flex justify-between px-6">
      <div className="h-full flex items-center text-2xl font-bold space-x-2">
        <Logo />
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
      </div>
      <div className="h-full flex items-center space-x-4">
        <Link to="/login">
          <button className="border  border-gray-900 py-2 px-5 rounded ease-in-out duration-300 hover:bg-gray-900 hover:text-slate-50 hover:ease-in-out hover:duration-500">
            Se connecter
          </button>
        </Link>
      
      </div>
    </nav>
  );
};

export default NavbarLanding;
