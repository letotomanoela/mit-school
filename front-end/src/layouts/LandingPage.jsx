import React, { useState } from "react";
import NavbarLanding from "../Components/NavbarLanding/NavbarLanding";
import { motion } from "framer-motion";
import { container, item } from "../Components/animation";
import ProfileCard from "../Components/ProfileCard/ProfileCard";
import { v4 as uuidv4 } from "uuid";
import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { BsBook } from "react-icons/bs";
import { TbCertificate } from "react-icons/tb";
import { GiDiploma } from "react-icons/gi";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const sectionData = [
  {
    title: "Excellence académique",
    icon: <GiDiploma />,
    color: "primary",

    content:
      "Le MIT est mondialement reconnu pour son excellence dans l'enseignement et la recherche. En choisissant notre plateforme de gestion des notes, vous bénéficiez d'un système qui correspond aux plus hauts standards académiques.",
  },
  {
    icon: <TbCertificate />,
    color: "success",
    title: "Facilité d'utilisation",
    content:
      "Notre interface conviviale et intuitive rend la gestion des notes simple et efficace.Les étudiants ont un accès clair à leurs notes et à leurs performances.",
  },
  {
    icon: <BsBook />,
    color: "warning",
    title: "Centralisation des données",
    content:
      "Notre système centralise toutes les informations liées aux notes des étudiants, ce qui facilite le suivi et l'analyse. ",
  },
  {
    icon: <BsBook />,
    color: "info",
    title: "Confidentialité et sécurité",
    content:
      "Nous accordons une grande importance à la confidentialité des données. Vos informations personnelles et vos résultats scolaires sont sécurisés et accessibles uniquement aux personnes autorisées. ",
  },
  {
    icon: <GiDiploma />,
    color: "danger",
    title: "Personnalisation",
    content:
      "Notre système de gestion des notes peut être adapté aux besoins spécifiques du MIT. Nous offrons des fonctionnalités personnalisables pour répondre aux exigences académiques uniques de votre institution.",
  },
  {
    icon: <GiDiploma />,
    color: "default",
    title: "Support et assistance",
    content:
      "Notre équipe de support est là pour vous accompagner tout au long de votre expérience. Si vous avez des questions, des problèmes techniques ou des demandes spécifiques, nous sommes prêts à vous aider rapidement et efficacement.",
  },
];

const LandingPage = () => {
  document.title = "MIT"
  const { token } = useSelector((state) => ({
    ...state.AuthReducer,
  }));

  return token !== null ? (
    <Navigate to="/dashboard" />
  ) : (
    <>
      <NavbarLanding />
      <section className="min-h-[500px] w-full pt-12 px-12 flex space-x-5 mb-8 ">
        <div className="w-1/2 h-full pr-4">
          <motion.p
            initial={{ translateX: -300 }}
            animate={{ translateX: 0 }}
            transition={{ type: "spring", damping: 80, stiffness: 300 }}
            className="text-5xl f font-bold"
          >
            Bienvenue sur le site du MIT (Massachusetts Institute of Technology)
          </motion.p>
          <motion.p
            initial={{ translateX: -300 }}
            animate={{ translateX: 0 }}
            transition={{ type: "spring", damping: 80, stiffness: 300 }}
            className="mt-5"
          >
            Au MIT, nous sommes dévoués à la gestion attentive des étudiants et
            de leurs notes, en veillant à leur progression académique. Grâce à
            notre système intégré, nous assurons transparence, équité et soutien
            optimal pour favoriser leur réussite.
          </motion.p>
          <motion.p
            variants={container}
            initial="hidden"
            animate="visible"
            className="h-full flex items-center space-x-4 mt-8"
          >
            {["Se connecter", "S'inscrire"].map((y) => (
              <motion.button
                key={uuidv4()}
                variants={item}
                className={`border  border-gray-900 py-2 px-5 rounded ease-in-out duration-300 ${
                  y === "S'inscrire"
                    ? " hover:bg-gray-900 hover:text-slate-50 hover:ease-in-out hover:duration-500"
                    : " bg-gray-900 text-slate-50 "
                } `}
              >
                {y}
              </motion.button>
            ))}
          </motion.p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            className="mt-10 flex -space-x-3"
          >
            {[1, 3, 4, 5, 6, "p"].map((a) => (
              <motion.div key={uuidv4()} variants={item}>
                {typeof a === "number" && (
                  <ProfileCard
                    name={`image${a}.jpg`}
                    last={Number(a) === 6 && true}
                  />
                )}
                {typeof a === "string" && (
                  <p className="ml-6 font-bold w-32 text-sm flex items-center h-full ">
                    More than 1K+ students
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          className="w-1/2 h-[500px] flex space-x-5"
        >
          {[1, 2].map((num) => (
            <motion.div
              key={uuidv4()}
              variants={Number(num) === 1 ? item : container}
              className={`h-full w-1/2 rounded-lg overflow-hidden relative ${
                Number(num) === 2 && "space-y-2"
              }`}
            >
              {Number(num) === 1 && (
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={"images/image6.jpg"}
                  alt=""
                  className="z-10 w-full h-full object-cover "
                />
              )}
              {Number(num) === 2 &&
                [3, 4, 5].map((number) => (
                  <motion.div
                    key={uuidv4()}
                    variants={item}
                    className="h-1/3 w-full space-y-2 rounded-lg overflow-hidden shadow-md"
                  >
                    <img
                      src={`images/image${number}.jpg`}
                      alt=""
                      className="z-10 w-full h-full object-cover "
                    />
                  </motion.div>
                ))}
            </motion.div>
          ))}
        </motion.div>
      </section>
      <Stats />
      <Section2 />
      <StudentSays />
    </>
  );
};

export default LandingPage;

function Section2({}) {
  return (
    <section className="min-h-[500px] w-full px-12 bg-slate-50 py-4">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="flex flex-wrap"
      >
        <motion.div variants={item} className="w-96 h-72 mr-6 mt-5 ">
          <h1 className="text-4xl font-bold ">
            Pourquoi nous sommes les meilleurs ?
          </h1>
          <p className="text-gray-500">
            En choisissant notre plateforme de gestion des notes, vous optez
            pour une solution fiable, efficace et adaptée aux exigences
            académiques du MIT. Rejoignez-nous dès aujourd'hui et profitez des
            avantages de notre système de gestion des notes pour une expérience
            académique optimisée.
          </p>
        </motion.div>
        {sectionData.map((itemSection) => (
          <Card
            key={itemSection.content}
            title={itemSection.title}
            color={itemSection.color}
            icon={itemSection.icon}
            content={itemSection.content}
            variant={item}
          />
        ))}
      </motion.div>
    </section>
  );
}

function Card({ color, icon, title, content, variant }) {
  return (
    <motion.div
      variants={variant}
      className="w-64 h-68 shadow-lg rounded-lg px-4  py-4 bg-white flex-shrink-0 m-2"
    >
      <div>
        <div
          className={`w-12 h-12 mb-2 ${color} flex items-center justify-center text-3xl rounded`}
        >
          {icon}
        </div>
        <h2 className="font-medium text-sm">{title}</h2>
        <p className="text-sm text-gray-600">{content}</p>
      </div>
    </motion.div>
  );
}

const statsAnim = [
  { number: "800", title: "Nombres d'étudiants" },
  { number: "180", title: "Nombres de matières" },
  { number: "5", title: "Nombres de classes" },
  { number: "7810", title: "Nombres des notes" },
];

function Stats() {
  return (
    <div className="w-full h-36 info ">
      <motion.div
        className="flex justify-center items-center h-full"
        variants={container}
        initial="hidden"
        whileInView="visible"
      >
        {statsAnim.map((stat) => (
          <NumberStats
            key={stat.title}
            variant={item}
            title={stat.title}
            number={stat.number}
          />
        ))}
      </motion.div>
    </div>
  );
}

function NumberStats({ number, title, variant }) {
  return (
    <motion.div
      variants={variant}
      className="w-max px-6 h-full flex flex-col items-center justify-center text-white"
    >
      <div className="text-5xl">{number}</div>
      <p>{title}</p>
    </motion.div>
  );
}

function StudentSays() {
  const [data, setData] = useState([
    {
      size: "w-16 h-16",
      image: "landing.jpg",
      position: "top-[10%] ",
      text: "text",
    },
    {
      size: "w-24 h-24",
      image: "landing1.jpg",
      position: "top-1/3 left-[15%]",
      text: "text1",
    },
    {
      size: "w-16 h-16",
      image: "landing2.jpg",
      position: "top-[10%] transform-y-[10%] left-[30%] transform-x-[30%] ",
      text: "text2",
    },
    {
      size: "w-48 h-48",
      image: "landing3.jpg",
      position: "top-[20%] -transform-y-[20%] left-[44%] -transform-x-[44%] ",
      text: "text3",
    },
    {
      size: "w-16 h-16",
      image: "landing4.jpg",
      position: "top-[10%] -transform-y-[10%] left-[68%] -transform-x-[68%] ",
      text: "text4",
    },
    {
      size: "w-24 h-24",
      image: "landing5.jpg",
      position: "top-1/3 transform-y-1/3 left-[79%] -transform-x-[79%]",
      text: "text5",
    },
    {
      size: "w-16 h-16",
      image: "landing6.jpg",
      position: "top-[10%] transform-x-[10%] left-[90%] transform-x-[90%]",
      text: "text6",
    },
  ]);

  const [activeText, setActiveText] = useState("text3");
  const [activeImage, setActiveImage] = useState("landing3.jpg");
  const [counter,setCounter] = useState(3)

  const prev = () => {
    let old = counter
    if(current <1){
      setCounter(6)
    } else {
      cure
    }
  }

  return (
    <section className="w-full min-h-max py-6 px-12 bg-white">
      <h1 className="text-4xl font-bold text-center">
        Ce que disent nos étudiants
      </h1>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="min-h-[500px] w-full relative overflow-hidden px-8"
      >
        {data.map((x) => (
          <Avatar
            key={x.image}
            size={x.size}
            image={x.image}
            position={x.position}
            variant={item}
          />
        ))}

        <div className="top-[60%] absolute h-max w-full mt-3 flex justify-center items-center">
          <p className="mt-2">John Doe</p>
        </div>
        <div className="top-[65%] absolute h-max w-full mt-3 flex justify-center items-center space-x-3">
          <div className="primary flex-shrink-0 w-8 h-8 rounded-full text-lg overflow-hidden flex items-center justify-center">
            <AiOutlineLeft />
          </div>
          <p className="text-center">
            {activeText}
          </p>
          <div className="primary flex-shrink-0 w-8 h-8 rounded-full text-lg overflow-hidden flex items-center justify-center">
            <AiOutlineRight />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Avatar({ size, image, position, variant }) {
  return (
    <motion.div
      variants={variant}
      className={`${size} overflow-hidden ${position} rounded-full absolute`}
    >
      <img src={image} className="w-full h-full object-cover " />
    </motion.div>
  );
}
