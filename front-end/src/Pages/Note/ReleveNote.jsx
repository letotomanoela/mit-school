import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import TemplatePDF from "../../Components/TemplatePDF/TemplatePDF";
import ReactToPrint from "react-to-print";

const ReleveNote = () => {
  const dispatch = useDispatch();
  const id = useParams().id;
  document.title = "Rélévé de note de " + id;

  const templateRef = useRef();

  useEffect(() => {
    dispatch({
      type: "CHANGE_ACTIVE_NAV",
      payload: "releve-de-note",
    });
  }, []);

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button className="info text-lg py-2 px-8 rounded absolute right-5">
            Imprimer
          </button>
        )}
        content={() => templateRef.current}
      />
      <div ref={templateRef}>
        <TemplatePDF id={id} />
      </div>
    </>
  );
};

export default ReleveNote;
