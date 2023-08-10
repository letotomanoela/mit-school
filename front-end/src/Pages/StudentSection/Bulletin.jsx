import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TemplatePDF from "../../Components/TemplatePDF/TemplatePDF";
import ReactToPrint from "react-to-print";

const Bulletin = () => {
  const { userId } = useSelector((state) => ({
    ...state.AuthReducer,
  }));
  const templateRef = useRef();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: "CHANGE_TITLE",
      payload: "Relevé de notes",
    });
    dispatch({
      type: "CHANGE_ACTIVE",
      payload: "Relevé de notes",
    });
    document.title = "Bulletin de notes";
  }, []);
  return (
    <>
    <ReactToPrint
        trigger={() => <button className="info text-lg py-2 px-8 rounded absolute right-5">Imprimer</button>}
        content={() => templateRef.current}
      />
      <div ref={templateRef}>
        <TemplatePDF id={userId} />
      </div>
      
    </>
  );
};

export default Bulletin;
