import React from "react";

const Img = ({ image }) => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <img
        className="w-full h-full object-cover"
        src={`http://localhost:5001${image}`}
        alt=""
      />
    </div>
  );
};

export default Img;
