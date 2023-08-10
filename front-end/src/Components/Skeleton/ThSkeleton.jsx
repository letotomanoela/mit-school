import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Th from "../Table/Th";

const ThSkeleton = () => {
  return (
    <Th>
      <Skeleton width={150} height={19} />
    </Th>
  );
};

export default ThSkeleton;
