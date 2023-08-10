import React, { useEffect, useState } from "react";
import { getData } from "../../redux/reducers/StudentDashboardReducer";
import { motion, useAnimate, stagger } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LineChart from "../../Components/Chart/LineChart";
import { useSelector, useDispatch } from "react-redux";
import { formatedDate } from "../../utils/formatedDate";
import CircleLoader from "../../Components/CircleLoader/CircleLoader";
import './wave.css'
const StudentDashboard = () => {
  const dispatch = useDispatch();
  const {
    data,
    isFetching,
    error,
    lineChartData,
    lineChartOptions,
    userId,
    semestre,
  } = useSelector((state) => ({
    ...state.StudentDashboardReducer,
    ...state.AuthReducer,
  }));

  useEffect(() => {
    document.title = "Dashboard";
    dispatch({
      type: "CHANGE_TITLE",
      payload: "Dashboard",
    });
    dispatch({
      type: "CHANGE_ACTIVE",
      payload: "Dashboard",
    });

    dispatch(getData(userId, semestre));
  }, []);
  return (
    <div className="w-full h-screen grid grid-cols-2">
      <div>
        <p className="text-3xl font-bold">
          Bonjour,{" "}
          {data === null ? (
            <Skeleton width={200} height={20} />
          ) : (
            data.nomEtudiant
          )}
        </p>

        <div className="w-full min-h-[384px]  rounded-lg bg-slate-100 dark:bg-slate-900 my-6 relative ">
          <p className="text-center font-bold text-xl py-6 flex flex-col items-center justify-center">
            Liste des notes par matières{" "}
            {isFetching && <CircleLoader white={"dark:stroke-white"} options={"w-12 h-12"}/>}
          </p>
          <div className="h-1 absolute right-5 top-16 z-[300]">
            <DropdownClasses />
          </div>
          {lineChartData === null ? (
            <LineChartSkeleton />
          ) : (
            <LineChart series={lineChartData} options={lineChartOptions} />
          )}
        </div>
      </div>
      <motion.div>
        <h1 className="text-2xl font-bold text-center">Informations</h1>
        <div className="w-48 h-48  rounded-full overflow-hidden mx-auto my-5">
          {data === null ? (
            <Skeleton circle width={192} height={192} />
          ) : (
            <img
              src={`http://localhost:5001${data.image}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="text-lg">
          <p className="text-center">
            {" "}
            <span className="font-bold">Nom complet :</span>{" "}
            {data === null ? (
              <Skeleton width={200} height={20} />
            ) : (
              data.nomEtudiant
            )}
          </p>
          <p className="text-center">
            <span className="font-bold">Classe :</span>{" "}
            {data === null ? (
              <Skeleton width={200} height={20} />
            ) : (
              data.classe.nomClasse
            )}
          </p>

          <p className="text-center">
            <span className="font-bold">Date de naissance :</span>{" "}
            {data === null ? (
              <Skeleton width={200} height={20} />
            ) : (
              formatedDate(data.dateNaissance)
            )}
          </p>
          <p className="text-center">
            <span className="font-bold">Numéro d'inscription:</span>{" "}
            {data === null ? (
              <Skeleton width={200} height={20} />
            ) : (
              data.numInscription
            )}
          </p>
          <p className="text-center">
            <span className="font-bold">Email :</span>{" "}
            {data === null ? <Skeleton width={200} height={20} /> : data.email}
          </p>
          <p className="text-center">
            <span className="font-bold">Numéro Téléphone :</span>{" "}
            {data === null ? <Skeleton width={200} height={20} /> : data.numTel}
          </p>
          <p className="text-center">
            <span className="font-bold">Numéro CIN :</span>{" "}
            {data === null ? <Skeleton width={200} height={20} /> : data.cin}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;

function LineChartSkeleton({}) {
  return (
    <div
      className="w-full h-[280px] wave"
     
    >
      <Skeleton width="100%" height={"100%"} />
    </div>
  );
}

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });
function useMenuAnimation(isOpen) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(".arrow", { rotate: isOpen ? 180 : 0 }, { duration: 0.2 });

    animate(
      "ul",
      {
        clipPath: isOpen
          ? "inset(0% 0% 0% 0% round 10px)"
          : "inset(10% 50% 90% 50% round 10px)",
      },
      {
        type: "spring",
        bounce: 0,
        duration: 0.5,
      }
    );

    animate(
      "li",
      isOpen
        ? { opacity: 1, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
      {
        duration: 0.2,
        delay: isOpen ? staggerMenuItems : 0,
      }
    );
  }, [isOpen]);

  return scope;
}

function DropdownClasses() {
  const [isOpen, setIsOpen] = useState(false);
  const scope = useMenuAnimation(isOpen);
  const dispatch = useDispatch();

  const { userId, semestre, data } = useSelector((state) => ({
    ...state.StudentDashboardReducer,
    ...state.AuthReducer,
  }));

  const handleChoose = (e) => {
    console.log(e.target.id);
    dispatch({
      type: "CHANGE_SEMESTRE_DASHBOARD_ETUDIANT",
      payload: e.target.id,
    });
  };

  useEffect(() => {
    if (data !== null) {
      dispatch(getData(userId, semestre));
    }
  }, [semestre]);

  return (
    <nav className="filter drop-shadow-sm m-0 z-[500] " ref={scope}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center  bg-slate-200 py-2 px-2 w-max justify-center space-x-3 rounded-md dark:bg-slate-800"
      >
        <span>SEMESTRE {semestre}</span>
        <div className="arrow" style={{ transformOrigin: "50% 55%" }}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 20 20"
            className="dark:fill-white"
          >
            <path d="M0 7 L 20 7 L 10 16" />
          </svg>
        </div>
      </motion.button>
      <ul
        style={{
          clipPath: "inset(10% 50% 90% 50% round 10px)",
        }}
        className="mt-1 mb-1 z-[300]   "
      >
        <li
          onClick={handleChoose}
          id="1"
          className="pointer-events-auto cursor-pointer mb-1 flex items-center  bg-slate-200 py-2 px-2 w-[142px] justify-center space-x-3  dark:bg-slate-800"
        >
          SEMESTRE 1
        </li>
        <li
          onClick={handleChoose}
          id="2"
          className="cursor-pointer mb-1 flex items-center  bg-slate-200 py-2 px-2 w-[142px] justify-center space-x-3  dark:bg-slate-800"
        >
          SEMESTRE 2
        </li>
      </ul>{" "}
    </nav>
  );
}
