import React from "react";

const ProfileCard = ({ name, last }) => {
  return (
    <div
      className={`w-12 h-12 border border-white rounded-full overflow-hidden relative `}
    >
      <img
        src={`images/${name}`}
        className="w-full h-full object-cover absolute"
      />
      {last && (
        <div
          className={`w-full h-full text-white  ${
            last && " bg-black bg-opacity-40"
          } absolute flex text-sm items-center justify-center pr-1`}
        >
          +1K
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
