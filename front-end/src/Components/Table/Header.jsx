import React from "react";

const Header = ({ children }) => {
  return (
    <thead className="bg-slate-200 dark:bg-gray-800 ease-in-out duration-300">
      <tr>{children}</tr>
    </thead>
  );
};

export default Header;
