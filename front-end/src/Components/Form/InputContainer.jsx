import React from "react";

const InputContainer = ({ children, label,name,size }) => {

  let tab = label.split("")
  // console.log(tab);
  return (
    <div
    className={`form__group field ${size} mr-2 mb-3`}
    
  >
   {children}
    <label className="form__label" htmlFor={name}>
      {label}
    </label>
  </div>
  );
};

export default InputContainer;
