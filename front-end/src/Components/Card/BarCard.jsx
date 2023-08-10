import React from 'react'
import { motion } from "framer-motion";

const BarCard = (props) => {
  return (
    <motion.div variants={props.variant} className={`relative flex flex-col  ${props.width ? props.width : "w-[400px] h-[275px]"} rounded-lg bg-slate-200 dark:bg-slate-900 mr-4 mb-4`}>
    <div>
      <p className="text-xl font-semibold pl-4 pt-2">{props.title}</p>
    </div>
    {props.children}
  </motion.div>
  )
}

export default BarCard