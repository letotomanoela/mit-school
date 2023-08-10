import React from "react";

export default function DropdownItem({ children, options }) {
  return (
    <div
      className={`w-10 text-center  bg-slate-200 py-2 rounded  mb-1 dark:bg-slate-900 ${
        options && options
      }`}
    >
      {children}
    </div>
  );
}
