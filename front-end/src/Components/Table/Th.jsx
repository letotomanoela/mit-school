import React from "react";

const Th = ({ children, options, title }) => {
  return (
    <th
      scope="col"
      title={title && title}
      className={`px-2 ${options && options} ${title && " cursor-pointer"}  py-3 text-sm font-normal text-left  text-black dark:text-gray-400`}
    >
      {children}
    </th>
  );
};

export default Th;
