import React from "react";

const Td = ({ children, item, classFlex }) => {
  return (
    <td
      className={`px-2 py-2 text-sm font-medium text-gray-700 dark:text-slate-50 whitespace-nowrap ease-in-out duration-300 ${
        classFlex && classFlex
      }`}
    >
      {children}
    </td>
  );
};

export default Td;
