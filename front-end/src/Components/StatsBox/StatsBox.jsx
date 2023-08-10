import React from "react";
import { FcReading, FcBusinessman,FcConferenceCall,FcTodoList,FcViewDetails } from "react-icons/fc";

export default function StatsBox({ extra , title, number, icon}) {
  return (
    <div className={`w-[250px] h-[100px] mr-3 mb-2 ${extra} rounded-lg dark:bg-slate-900`}>
      <div className=" h-full flex items-center ">
        {icon==="students" && <FcReading size={"72px"} />}
        {icon==="teachers" && <FcConferenceCall size={"72px"} />}
        {icon==="courses" && <FcViewDetails size={"72px"} />}
        {icon==="reviews" && <FcTodoList size={"72px"} />}
        
        
        <div className="ml-2">
          <p>{title}</p>
          <p className="text-3xl font-bold">{number}</p>
        </div>
      </div>
    </div>
  );
}
