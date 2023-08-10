import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import LoginSlide from "../Components/LoginSlide/LoginSlide";
import Logo from "../Components/Logo/Logo";
import { Navigate } from "react-router-dom";
import { useQuery } from "react-query";
import CircleLoader from "../Components/CircleLoader/CircleLoader";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

const Login = () => {
  document.title = "Se connecter"
  const { token } = useSelector((state) => ({
    ...state.AuthReducer,
  }));
  const dispatch = useDispatch();
  const datas = [
    {
      img: "form3.jpg",
      text: "L'administrateur peut gérer les étudiants et les notes",
      description:
        "Il peut modifier,supprimer, ajouter un étudiant , ses notes et le matières dans une classe",
    },
    {
      img: "form2.jpg",
      text: "L'étudiant peut voir ses notes et son bulletin",
      description: "Il peut voir ses progressions sur ses notes ",
    },
  ];

  const [data, setData] = useState({
    img: "form3.jpg",
    text: "L'administrateur peut gérer les étudiants et les notes",
    description:
      "Il peut modifier,supprimer, ajouter un étudiant , ses notes et le matières dans une classe",
  });

  const changeContent = (e) => {
    const id = e.target.id;
    setData({
      text: datas[id].text,
      img: datas[id].img,
      description: datas[id].description,
    });
  };

  const [pseudoError, setPseudoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");

  const { refetch, isLoading, isRefetching } = useQuery("login", fetchLogin, {
    enabled: false,
  });
  const formHandler = (e) => {
    if (e.target.name === "pseudo") {
      setPseudo(e.target.value);
      if (e.target.value !== "") {
        setPseudoError("");
      }
    } else {
      setPassword(e.target.value);
      if (e.target.value !== "") {
        setPasswordError("");
      }
    }
  };

  const formValidation = (field = "", message = "") => {
    setPseudoError("");
    setPasswordError("");
    if (pseudo === "") {
      setPseudoError("Veuillez entrer un pseudo");
    }
    if (password === "") {
      setPasswordError("Veuillez entrer un mot de passe");
    }

    if (pseudo !== "" && password !== "") {
      refetch();
    }

    if (field === "pseudo") {
      setPseudoError(message);
    }
    if (field === "password") {
      setPasswordError(message);
    }
  };

  async function fetchLogin() {
    await fetch(`http://localhost:5001/user/login`, {
      method: "POST",
      body: JSON.stringify({ pseudo, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { field, success, message } = json;
        if (!success) {
          formValidation(field, message);
        } else {
          dispatch({
            type: "LOG_IN",
            payload: {
              token: json.token,
              userId: json.id,
              role: json.role,
            },
          });
        }
      });
  }
  return token !== null ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-full flex justify-center overflow-hidden">
        <LoginSlide
          text={data.text}
          description={data.description}
          img={data.img}
          changeContent={changeContent}
        />
        <motion.div
          initial={{ translateX: 900 }}
          animate={{ translateX: 0 }}
          transition={{ type: "spring", damping: 80, stiffness: 500 }}
          className="w-[40%]  rounded-xl my-2  px-4"
        >
          <div className="flex  justify-center h-full flex-col px-12 ">
            <div className="w-max mx-auto mb-3">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold mb-10 text-center ">
              Connecter vous à votre compte
            </h1>
            <form action="" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="pseudo">Pseudo</label>
                <input
                  type="text"
                  onChange={formHandler}
                  value={pseudo}
                  name="pseudo"
                  className="w-full py-2 px-3 border border-gray-600 ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                />
                <p className="text-red-500">{pseudoError}</p>
              </div>
              <div className="mt-3">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  onChange={formHandler}
                  value={password}
                  name="password"
                  className="w-full py-2 px-3 border border-gray-600  ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                />
                <p className="text-red-500">{passwordError}</p>
              </div>
              <p className="text-indigo-600 my-3 flex justify-end">
                <a href="">Mot de passe oublié?</a>
              </p>
              <button
                onClick={formValidation}
                className="flex items-center justify-center  w-full bg-indigo-600 text-white py-2 rounded-lg"
              >
                {(isLoading || isRefetching) ? "Connexion..." : "Se connecter"}
                {(isLoading || isRefetching) && <CircleLoader white={"stroke-white dark:stroke-white"} />}
              </button>
            </form>
            <p className="text-center mt-6">
              <span>
                Vous n'avez pas encore un compte?{" "}
                <Link to="/signup" className="text-indigo-600">
                
                  Veuiller s'incrire ici
                
                
                </Link>
                
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
