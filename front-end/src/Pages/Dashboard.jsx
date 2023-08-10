import React, { useEffect, useState } from "react";
import PieChart from "../Components/Chart/PieChart";
import BarChart from "../Components/Chart/BarChart";
import StatsBox from "../Components/StatsBox/StatsBox";
import PieCard from "../Components/Card/PieCard";
import BarCard from "../Components/Card/BarCard";
import { useDispatch, useSelector } from "react-redux";
import { motion, useAnimate, stagger } from "framer-motion";
import { container, item } from "../Components/animation";
import {
  lineChartOptions,
  barChartOptions2,
  pieChartOptions,
} from "../utils/chartOptions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { getStats } from "../redux/reducers/DashboardReducer";

import LineChart from "../Components/Chart/LineChart";
export const lineChartData = [
  {
    name: "Nombres des étudiants qui ont eu la moyenne",
    data: [100, 150, 120, 174, 141],
    color: "#4318FF",
  },
];


export default function Dashboard() {
  document.title = "Dashboard";
  const dispatch = useDispatch();
  const {
    generalStatsNumber,
    active_bar_moyenne,
    active_bar_opt,
    isFetching,
    nombre_etudiant_pie,
    nombre_matiere_pie,
    nombre_etudiant_bar,
    activeClasse,
    semestre,
  } = useSelector((state) => ({
    ...state.DashboardReducer,
  }));

  useEffect(() => {
    dispatch({
      type: "CHANGE_TITLE",
      payload: "Dashboard",
    });
    dispatch({
      type: "CHANGE_ACTIVE",
      payload: "Dashboard",
    });

    dispatch(getStats(activeClasse, semestre));
    console.log(active_bar_moyenne);
    console.log(active_bar_opt);
  }, []);

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="stats-section pl-4 pt-5 w-full flex flex-wrap   "
      >
        {generalStatsNumber !== null
          ? generalStatsNumber.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <StatsBox
                  extra={stat.extra}
                  title={stat.title}
                  number={stat.number}
                  icon={stat.icon}
                />
              </motion.div>
            ))
          : ["a", "b", "c", "d"].map((io) => (
              <StatBoxSkeleton key={io} variant={item} />
            ))}
      </motion.div>
      <div className="chart-section pl-4 mt-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap"
        >
          <PieCard variant={item} title="Nombres des étudiants">
            {nombre_etudiant_pie !== null ? (
              <PieChart
                options={pieChartOptions}
                series={nombre_etudiant_pie}
              />
            ) : (
              <div className="w-full flex items-center justify-center">
                <PieSkeleton />
              </div>
            )}
          </PieCard>
          <PieCard variant={item} title="Nombres des matières">
            {nombre_matiere_pie !== null ? (
              <PieChart options={pieChartOptions} series={nombre_matiere_pie} />
            ) : (
              <div className="w-full flex items-center justify-center">
                <PieSkeleton />
              </div>
            )}
          </PieCard>
          <BarCard variant={item} title="Nombres des étudiants">
            {nombre_etudiant_bar !== null ? (
              <BarChart
                chartData={nombre_etudiant_bar}
                chartOptions={barChartOptions2}
              />
            ) : (
              <BarSkeletonContainer />
            )}
          </BarCard>
          <BarCard
            variant={item}
            title="Nombres des étudiants qui ont eu la moyenne par matière"
            width={"w-[750px] h-[400px]"}
          >
            <div className="h-1 absolute right-5 top-5 z-[300]">
              <DropdownClasses />
            </div>

            {active_bar_moyenne !== null ? (
              <BarChart
                chartData={active_bar_moyenne}
                chartOptions={active_bar_opt}
                h={true}
              />
            ) : (
              <BarSkeletonContainer2 />
            )}
          </BarCard>
          <BarCard
            variant={item}
            title="Nombres des étudiants qui ont eu la moyenne générale"
            width={"w-[450px] h-[400px]"}
          >
            <LineChart series={lineChartData} options={lineChartOptions} />
          </BarCard>
        </motion.div>
      </div>
    </>
  );
}

function StatBoxSkeleton({ variant }) {
  return (
    <motion.div
      variants={variant}
      className={`w-[250px] h-[100px] mr-3 mb-2  rounded-lg dark:bg-slate-900`}
    >
      <div className=" h-full flex items-center ">
        <Skeleton circle width={72} height={72} />

        <div className="ml-2">
          <Skeleton width={150} height={19} />
          <Skeleton width={36} height={36} circle />
        </div>
      </div>
    </motion.div>
  );
}

function PieSkeleton() {
  return <Skeleton width={200} height={200} circle />;
}

function BarSkeleton({ h, text, variant, w }) {
  return (
    <motion.div
      variants={variant}
      className="relative flex justify-end items-end"
    >
      <div className="h-max flex flex-col ">
        <Skeleton
          width={w ? w : 30}
          height={h}
          className="rounded-t-full rounded-b-full"
        />
        <p className="text-center">
          {text ? text : <Skeleton width={20} height={15} />}
        </p>
      </div>
    </motion.div>
  );
}

function BarSkeletonContainer() {
  const data = [
    {
      h: 80,
      text: "L1",
    },
    {
      h: 200,
      text: "L2",
    },
    {
      h: 190,
      text: "L3",
    },
    {
      h: 120,
      text: "M1",
    },
    {
      h: 150,
      text: "M2",
    },
  ];
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex justify-between h-full relative mx-5"
    >
      {data.map((d) => (
        <BarSkeleton key={d.h} h={d.h} text={d.text} variant={item} />
      ))}
    </motion.div>
  );
}

function BarSkeletonContainer2() {
  const data = [
    {
      h: 210,
    },
    {
      h: 200,
    },
    {
      h: 190,
    },
    {
      h: 120,
    },
    {
      h: 320,
    },
    {
      h: 300,
    },
    {
      h: 270,
    },
    {
      h: 150,
    },
    {
      h: 250,
    },
  ];
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex justify-between h-full relative mx-5"
    >
      {data.map((d) => (
        <BarSkeleton key={d.h} h={d.h} w={35} variant={item} />
      ))}
    </motion.div>
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

  const { activeClasse, semestre, nombre_etudiant_moyenne_matiere } =
    useSelector((state) => ({
      ...state.DashboardReducer,
    }));

  const handleChoose = (e) => {
    dispatch({
      type: "CHANGE_CLASSE_BAR",
      payload: e.target.innerText,
    });
  };

  useEffect(() => {
    if (nombre_etudiant_moyenne_matiere !== null) {
      dispatch({
        type: "NOMBRE_MOYENNE_PAR_MATIERE_CLASSE",
        payload: {
          activeClasse,
          semestre,
          bigData: nombre_etudiant_moyenne_matiere,
        },
      });
    }
  }, [activeClasse]);

  return (
    <nav className="filter drop-shadow-sm m-0 z-[500] " ref={scope}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center  bg-slate-200 py-2 w-16 justify-center space-x-3 rounded-md dark:bg-slate-800"
      >
        <span>{activeClasse}</span>
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
          className="pointer-events-auto mb-1 flex items-center  bg-slate-200 py-2 w-16 justify-center space-x-3  dark:bg-slate-800"
        >
          L1
        </li>
        <li
          onClick={handleChoose}
          className="cursor-pointer mb-1 flex items-center  bg-slate-200 py-2 w-16 justify-center space-x-3  dark:bg-slate-800"
        >
          L2
        </li>
        <li
          onClick={handleChoose}
          className="cursor-pointer mb-1 flex items-center  bg-slate-200 py-2 w-16 justify-center space-x-3  dark:bg-slate-800"
        >
          L3
        </li>
        <li
          onClick={handleChoose}
          className="cursor-pointer mb-1 flex items-center  bg-slate-200 py-2 w-16 justify-center space-x-3  dark:bg-slate-800"
        >
          M1
        </li>
        <li
          onClick={handleChoose}
          className="cursor-pointer mb-1 flex items-center  bg-slate-200 py-2 w-16 justify-center space-x-3  dark:bg-slate-800"
        >
          M2
        </li>
      </ul>{" "}
    </nav>
  );
}
