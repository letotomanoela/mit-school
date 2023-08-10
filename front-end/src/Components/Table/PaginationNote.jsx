import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotes } from "../../redux/reducers/ListeNoteReducer";
import { v4 as uuidv4 } from "uuid";

const PaginationNote = () => {
  const dispatch = useDispatch();
  const table = [];
  const { pagination, activeClasse, asc, skip, color } = useSelector(
    (state) => ({
      ...state.ListeNoteReducer,
      ...state.SidebarReducer,
    })
  );
  
  if (pagination !== 1) {
    for (let i = 1; i <= pagination; i++) table.push(i);
  }
  const changePage = (e) => {
    dispatch({
      type: "CHANGE_SKIP_NOTE",
      payload: Number(e.target.id),
    });
  };

  const previousPage = (e) => {
    dispatch({
      type: "CHANGE_SKIP_NOTE",
      payload: Number(skip) - 1,
    });
  };
  const nextPage = (e) => {
    dispatch({
      type: "CHANGE_SKIP_NOTE",
      payload: Number(skip) + 1,
    });
  };

  useEffect(() => {
    dispatch(getNotes(activeClasse, asc, skip));
  }, [skip]);
  return (
    <div className="flex my-6">
      <a
        onClick={previousPage}
        className={` px-4 py-2 mx-1  capitalize   rounded-md ${
          skip === 1
            ? " pointer-events-none cursor-not-allowed text-gray-400 bg-gray-300 dark:text-gray-600"
            : color + " text-white cursor-pointer"
        } dark:bg-gray-800 `}
      >
        <div className="flex items-center -mx-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mx-1 rtl:-scale-x-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>

          <span className="mx-1">Precedent</span>
        </div>
      </a>

      {table.map((item) => (
        <a
          id={item}
          key={uuidv4()}
          onClick={changePage}
          className={`hidden px-4 py-2 mx-1 text-gray-700  ${
            Number(skip) === Number(item)
              ? color + " text-white"
              : "hover:bg-slate-300 hover:text-slate-900"
          }  transition-colors duration-300 transform bg-white rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 cursor-pointer `}
        >
          {item}
        </a>
      ))}

      <a
        onClick={nextPage}
        className={`px-4 py-2 mx-1  capitalize   rounded-md ${
          Number(skip) === Number(pagination)
            ? "cursor-not-allowed text-gray-400 bg-gray-300"
            : color + " text-white "
        }
         dark:bg-gray-800`}
      >
        <div className="flex items-center -mx-1">
          <span className="mx-1">Suivante</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mx-1 rtl:-scale-x-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </a>
    </div>
  );
};

export default PaginationNote;
