import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Tr from "../Table/Tr";
import Td from "../Table/Td";

const NoteSkeleton = () => {
  return (
    <Tr>
      
      <Td>
        <Skeleton width={50} height={19} />
      </Td>
     
      <Td>
        <Skeleton width={150} height={19} />
      </Td>
      <Td>
        <Skeleton width={150} height={19} />
      </Td>
      <Td>
        <Skeleton width={150} height={19} />
      </Td>
      <Td>
        <Skeleton width={150} height={19} />
      </Td>
      
      <Td>
        <div className="flex space-x-2">
          <Skeleton circle width={40} height={40} />
          <Skeleton circle width={40} height={40} />
          <Skeleton circle width={40} height={40} />
        </div>
      </Td>
    </Tr>
  );
};

export default  NoteSkeleton;
