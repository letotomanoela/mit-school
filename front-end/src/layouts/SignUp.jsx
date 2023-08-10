import React, { useState, useEffect } from "react";
import LoginSlide from "../Components/LoginSlide/LoginSlide";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../Components/Logo/Logo";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { container, item } from "../Components/animation";
import CircleLoader from "../Components/CircleLoader/CircleLoader";
const SignUp = () => {
  document.title = "S'inscrire";
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

  const [canSignUp, setCanSignUp] = useState(false);
  const [canSignUpMessage, setCanSignUpMessage] = useState("");

  const [btnText, setBtnText] = useState("Chercher mon numéro d'inscription");
  const [showSuccess, setShowSuccess] = useState(false);

  const [registerData, setRegisterData] = useState({
    numInscription: "",
    pseudo: "",
    password: "",
    passConfirm: "",
  });
  const [errors, setErrors] = useState({
    numInscription: "",
    pseudo: "",
    password: "",
    passConfirm: "",
  });

  const fetchCheckAccount = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await fetch(`http://localhost:5001/user/checkUser`, {
      method: "POST",
      body: JSON.stringify(registerData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response.json();
    });
  };

  const checkMutation = useMutation(fetchCheckAccount, {
    onSuccess: (data) => {
      const { message, success } = data;
      if (success) {
        setCanSignUpMessage("Vous pouvez s'inscrire");
        setCanSignUp(true);
        setBtnText("S'inscrire");
      } else {
        setErrors({
          ...errors,
          numInscription: message,
        });
      }
    },
    onError: () => {
      setErrors({
        ...errors,
        numInscription: "Une erreur s'est produite",
      });
    },
  });

  const fetchRegister = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await fetch(`http://localhost:5001/user/register`, {
      method: "PUT",
      body: JSON.stringify(registerData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  const registerMutation = useMutation(fetchRegister, {
    onError: () => {
      console.log("UNE ERREUR S'EST PRODUITE");
    },
    onSuccess: (data) => {
      const { message, success, field } = data;
      if (!success) {
        setErrors({
          ...errors,
          [field]: message,
        });
      } else {
        setRegisterData({
          numInscription: "",
          pseudo: "",
          password: "",
          passConfirm: "",
        });
        setErrors({
          numInscription: "",
          pseudo: "",
          password: "",
          passConfirm: "",
        });
        setCanSignUp(false);
        setShowSuccess(true);
        setCanSignUpMessage('')
      }
    },
  });

  const handleClick = () => {
    setErrors({
      numInscription: "",
    });

    if (registerData.numInscription === "") {
      return setErrors({
        ...errors,
        numInscription: "Veuillez entrer votre numéro d'inscription",
      });
    }
    if (!canSignUp) {
      checkMutation.mutate();
    } else {
      setErrors({
        numInscription: "",
        pseudo: "",
        password: "",
        passConfirm: "",
      });
      for (let att in registerData) {
        console.log(att);
        if (registerData[att] === "") {
          setErrors((prevState) => ({
            ...prevState,
            [att]:
              att === "pseudo"
                ? "Veuillez entrer un pseudo"
                : att === "password"
                ? "Veuillez entrer un mot de passe"
                : att === "passConfirm"
                ? "Veuillez confirmer le mot de passe"
                : "Veuiller remplir ce champ",
          }));
          return 1;
        }
      }
      if (registerData.pseudo.length < 6) {
        setErrors({
          ...errors,
          pseudo: "Aumoins 6 caractères",
        });
        return 1;
      }
      if (registerData.password.length < 8) {
        setErrors({
          ...errors,
          password: "Aumoins 8 caractère",
        });
        return 1;
      }

      if (registerData.password !== registerData.passConfirm) {
        setErrors({
          ...errors,
          passConfirm: "Mot de passe différent",
        });

        return 1;
      }

      registerMutation.mutate();
    }
  };

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
    }
  }, [showSuccess]);
  return (
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
              S'inscrire
            </h1>
            {showSuccess && <SuccessAlert />}

            <form action="" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="pseudo">
                  Entrer votre numero d'inscription
                </label>
                <input
                  type="text"
                  name="pseudo"
                  value={registerData.numInscription}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      numInscription: e.target.value,
                    })
                  }
                  className="w-full py-2 px-3 border border-gray-600 ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                />
                <p className="text-red-500">{errors.numInscription}</p>
                <p className="text-green-500">{canSignUpMessage}</p>
              </div>
              {canSignUp && (
                <AnimatePresence>
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={item}>
                      <label htmlFor="pseudo">Pseudo</label>
                      <input
                        value={registerData.pseudo}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            pseudo: e.target.value,
                          })
                        }
                        type="text"
                        name="pseudo"
                        className="w-full py-2 px-3 border border-gray-600 ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                      />
                      <p className="text-red-500">{errors.pseudo}</p>
                    </motion.div>
                    <motion.div variants={item} className="mt-3">
                      <label htmlFor="password">Mot de passe</label>
                      <input
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        type="password"
                        name="password"
                        className="w-full py-2 px-3 border border-gray-600  ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                      />
                      <p className="text-red-500">{errors.password}</p>
                    </motion.div>
                    <motion.div variants={item} className="mt-3">
                      <label htmlFor="passwordC">
                        Confirmer votre mot de passe{" "}
                      </label>
                      <input
                        value={registerData.passConfirm}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            passConfirm: e.target.value,
                          })
                        }
                        type="password"
                        name="passwordC"
                        className="w-full py-2 px-3 border border-gray-600  ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                      />
                      <p className="text-red-500">{errors.passConfirm}</p>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              )}
              <p className="text-indigo-600 my-3 flex justify-end">
                <a href="">Mot de passe oublié?</a>
              </p>
              <button
                onClick={handleClick}
                className="flex items-center justify-center  w-full bg-indigo-600 text-white py-2 rounded-lg"
              >
                {checkMutation.isLoading || registerMutation.isLoading ? (
                  <CircleLoader white={"stroke-white dark:stroke-white"} />
                ) : (
                  btnText
                )}
              </button>
            </form>
            <p className="text-center mt-6">
              <span>
                Vous un déjà un compte?{" "}
                <Link to="/login" className="text-indigo-600">
                  Se connecter
                </Link>
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;

function SuccessAlert() {
  return (
    <AnimatePresence>
      <motion.div
        positionTransition
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className="w-3/4 py-2 success text-lg  text-white rounded mx-auto my-3 flex items-center justify-center"
      >
        Vous êtes inscrit
      </motion.div>
    </AnimatePresence>
  );
}
