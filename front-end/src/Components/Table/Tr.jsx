import React from "react";

const Tr = ({ children }) => {
  return (
    <tr className="border-b dark:border-gray-800 ease-in-out duration-300">
      {children}
    </tr>
  );
};

export default Tr;
