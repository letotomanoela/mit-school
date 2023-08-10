import React from "react";
import { motion } from "framer-motion";
export default function PieCard(props) {
  return (
    <motion.div variants={props.variant} className="flex flex-col h-[275px] w-[300px] rounded-lg bg-slate-200 dark:bg-slate-900 mr-4 mb-4">
      <div>
        <p className="text-xl font-semibold pl-4 pt-2">{props.title}</p>
      </div>
      {props.children}
    </motion.div>
  );
}
