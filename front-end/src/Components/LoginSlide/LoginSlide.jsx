import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import Logo from "../Logo/Logo";
import { dropIn } from "../animation";

const LoginSlide = ({ img, text, description, changeContent }) => {
  const animation1 = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  const spring = {
    type: "spring",
    damping: 80,
    stiffness: 500,
  };
  return (
    <AnimatePresence>
      <motion.div
        variants={animation1}
        transition={spring}
        className="w-[40%] bg-indigo-600 my-2 rounded-xl overflow-hidden"
      >
        <div className="h-[60%] overflow-hidden ">
          <motion.img
            key={img}
            initial={{ scale: 0 }}
            animate={{ scale: 1, translateX: 80 }}
            transition={{ type: "spring", damping: 200, stiffness: 500 }}
            className="pt-8"
            src={`images/${img}`}
            alt=""
          />
        </div>
        <AnimatePresence>
          <div className="h-[40%] bg-slate-900 mt-2 px-10 py-4">
            <div className="w-max flex items-center space-x-2">
              <Logo />
              <AnimatePresence>
                <motion.div
                  key={1}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropIn}
                  className="text-3xl font-bold text-white"
                >
                  MIT
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.h1
              key={text}
              initial={{ opacity: 0, translateX: -200 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: 200 }}
              transition={{ type: "spring", damping: 100, stiffness: 300 }}
              className="text-2xl font-bold text-white"
            >
              {text}
            </motion.h1>
            <motion.p
              key={description}
              initial={{ opacity: 0, translateX: -200 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: 200 }}
              transition={{ type: "spring", damping: 100, stiffness: 300 }}
              className="text-gray-400 text-sm pt-2"
            >
              {description}
            </motion.p>
            <div className="w-full flex items-end justify-center mt-10 space-x-5">
              <button
                id="0"
                onClick={changeContent}
                className="w-5 h-5 rounded-full bg-indigo-600"
              ></button>
              <button
                id="1"
                onClick={changeContent}
                className="w-5 h-5 rounded-full bg-indigo-600 bg-opacity-50"
              ></button>
            </div>
          </div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginSlide;
