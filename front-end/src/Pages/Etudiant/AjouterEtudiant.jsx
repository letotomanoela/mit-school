import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import InputContainer from "../../Components/Form/InputContainer";
import DropdownItem from "../../Components/Dropdown/Dropdown";
import { motion } from "framer-motion";
import { container, item } from "../../Components/animation";
import { RiUserLine } from "react-icons/ri";
import { formatedDate } from "../../utils/formatedDate";
import CircleLoader from "../../Components/CircleLoader/CircleLoader";
import Modal from "../../Components/Modal/Modal";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import {
  validerEmail,
  validerNumeroTelephone,
  verifierNumeroTelephone,
} from "../../utils/validateEmail";

import { useMutation } from "react-query";
import Success from "../../Components/Loader/Success";

export default function AjouterEtudiant() {
  document.title = "Ajouter un étudiant";
  const dispatch = useDispatch();
  const [isValid, setIsValid] = useState(true);
  const [modal, setModal] = useState(false);
  const closeModal = () => setModal(false);
  const openModal = () => setModal(true);

  const formRefs = useRef([
    "image",
    "nomEtudiant",
    "cin",
    "numTel",
    "email",
    "numInscription",
    "dateNaissance",
    "adresse",
    "classeId",
    "asc",
  ]);

  const formRef = useRef();
  const [show, setShow] = useState(false);
  const [classeValue, setClasseValue] = useState("Choisser une classe");

  const pathname = useLocation().pathname.split("/")[2];
  const ref = useRef();

  const [etudiantData, setEtudiantData] = useState({
    numInscription: "",
    nomEtudiant: "",
    dateNaissance: "",
    numTel: "",
    cin: "",
    adresse: "",
    asc: "",
    email: "",
    image: "",
    classeId: "",
  });

  const [errors, setErrors] = useState({
    numInscription: "",
    nomEtudiant: "",
    dateNaissance: "",
    numTel: "",
    cin: "",
    adresse: "",
    asc: "",
    email: "",
    image: "",
    classeId: "",
  });

  const fetchCreate = async () => {
    return await fetch("http://localhost:5001/etudiant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(etudiantData),
    }).then((response) => response.json());
  };

  const createStudentMutation = useMutation(fetchCreate, {
    onSuccess: (data) => {
      const { success, field, error } = data;

      if (!success) {
        errorHanling(error, field);
      } else {
        setEtudiantData({
          numInscription: "",
          nomEtudiant: "",
          dateNaissance: "",
          numTel: "",
          cin: "",
          adresse: "",
          asc: "",
          email: "",
          image: "",
          classeId: "",
        });
        openModal();
        setClasseValue("Choississer une classe");
        setTimeout(() => {
          closeModal();
        }, 3000);
      }
    },
  });

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formdata = new FormData();
    formdata.append("image", file);

    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5001/upload",
        formdata,
        config
      );
      setEtudiantData({
        ...etudiantData,
        image: data,
      });
    } catch (error) {
      // console.error(error);
    }
  };

  const classes = [
    {
      id: "6450d395c1f8f4dd5479c28a",
      nomClasse: "L1",
    },
    {
      id: "6452aab81f47b87be7f8cd9b",
      nomClasse: "L2",
    },
    {
      id: "6452aae01f47b87be7f8cd9c",
      nomClasse: "L3",
    },
    {
      id: "6452aae61f47b87be7f8cd9d",
      nomClasse: "M1",
    },
    {
      id: "6452aaea1f47b87be7f8cd9e",
      nomClasse: "M2",
    },
  ];
  const toggleShow = () => {
    setShow(!show);
  };

  const getClasseValue = (e) => {
    setClasseValue(e.target.innerText);
    // console.log(e.target.parentElement.parentElement.id);
    setEtudiantData({
      ...etudiantData,
      classeId: e.target.parentElement.parentElement.id,
    });
    setShow(!show);
  };

  const updateErrors = (prop, value) => {
    setErrors((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };
  function errorHanling(message, field) {
    // console.log(message,field)
    for (let att in errors) {
      if (att === field) updateErrors(att, message);
    }
  }

  const checkError = () => {
    for (let att in etudiantData) {
      if (etudiantData[att] === "") {
        setIsValid(false);

        if (att === "classeId")
          updateErrors(att, "Veuillez choisir une classe");
        else if (att === "image")
          updateErrors(
            att,
            "Veuillez choisir une image en cliquant sur l'icône d'utilisateur "
          );
        else updateErrors(att, "Veuillez remplir ce champ");
      } else {
        if (att === "email") {
          if (!validerEmail(etudiantData[att]))
            updateErrors(att, "Email invalide");
          setIsValid(false);
        }
        if (att === "numTel") {
          if (!validerNumeroTelephone(etudiantData[att]))
            updateErrors(att, "Numero téléphone invalide");
          setIsValid(false);
        }
      }
    }
    return isValid;
  };

  const formHandler = () => {
    console.log("FORM HANDLER");
    setErrors({
      ...errors,
      numInscription: "",
      nomEtudiant: "",
      dateNaissance: "",
      numTel: "",
      cin: "",
      adresse: "",
      asc: "",
      email: "",
      image: "",
      classeId: "",
    });
    if (etudiantData.image === "") {
      setErrors({
        ...errors,
        image: "Veuiller choisir une image",
      });
      return 1;
    }
    if (etudiantData.nomEtudiant === "") {
      setErrors({
        ...errors,
        nomEtudiant: "Veuiller choisir une image",
      });
      return 1;
    }
    if (etudiantData.cin === "") {
      setErrors({
        ...errors,
        cin: "Veuiller remplir ce champs",
      });
      return 1;
    }
    if (etudiantData.numTel === "") {
      setErrors({
        ...errors,
        numTel: "Veuiller remplir ce champs",
      });
      return 1;
    }
    if (etudiantData.email === "") {
      setErrors({
        ...errors,
        email: "Veuiller remplir ce champs",
      });
      return 1;
    }
    if (!validerEmail(etudiantData.email)) {
      setErrors({
        ...errors,
        email: "Email invalide",
      });
      return 1;
    }
    if (etudiantData.numInscription === "") {
      setErrors({
        ...errors,
        numInscription: "Veuiller remplir ce champs",
      });
      return 1;
    }
    if (etudiantData.dateNaissance === "") {
      setErrors({
        ...errors,
        dateNaissance: "Veuiller remplir ce champs",
      });
      return 1;
    }

    if (etudiantData.adresse === "") {
      setErrors({
        ...errors,
        adresse: "Veuiller remplir ce champs",
      });
      return 1;
    }
    if (etudiantData.asc === "") {
      setErrors({
        ...errors,
        asc: "Veuiller remplir ce champs",
      });
      return 1;
    }

    if (etudiantData.classeId === "") {
      setErrors({
        ...errors,
        classeId: "Veuiller choisir une classe",
      });
      return 1;
    }

    if (!validerNumeroTelephone(etudiantData.numTel)) {
      setErrors({
        ...errors,
        numTel: "Numéro téléphone invalide",
      });
    }

    createStudentMutation.mutate(etudiantData);
  };

  useEffect(() => {
    dispatch({
      type: "CHANGE_ACTIVE_NAV",
      payload: pathname,
    });
  }, []);

  useEffect(() => {
    for (let att in etudiantData) {
      if (etudiantData[att] !== "") {
        updateErrors(att, "");
        if (att === "email") {
          if (validerEmail(etudiantData[att])) updateErrors(att, "");
        }
      }
    }
  }, [etudiantData]);

  return (
    <>
      <h1 className="text-2xl font-medium py-2 text-center">
        Ajouter un étudiant
      </h1>
      <form onSubmit={(e) => e.preventDefault()} ref={formRef}>
        <div
          ref={formRefs[0]}
          className="image  relative overflow-hidden  w-48 h-48 rounded-full border  flex items-center justify-center text-white bg-slate-800 mx-auto my-2"
        >
          {etudiantData.image === "" ? (
            <RiUserLine size={"80px"} />
          ) : (
            <img
              className="w-full h-full object-cover"
              src={`http://localhost:5001${etudiantData.image}`}
            />
          )}

          <input
            type="file"
            onChange={uploadFileHandler}
            className="w-full h-full opacity-0 absolute cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-center">
          <ErrorText field={"image"} text={errors.image} />
        </div>
        <div className="flex  w-full mx-auto flex-wrap px-2">
          <InputContainer
            label={"Nom complet"}
            name={"nomEtudiant"}
            size={"w-[500px]"}
          >
            <input
              required=""
              placeholder="Nom complet"
              autoComplete="false"
              className="form__field bg-transparent"
              type="input"
              name="nomEtudiant"
              ref={formRefs[1]}
              value={etudiantData.nomEtudiant}
              onChange={(e) => {
                setEtudiantData({
                  ...etudiantData,
                  nomEtudiant: e.target.value,
                });
              }}
            />
            <ErrorText text={errors.nomEtudiant} field={"nomEtudiant"} />
          </InputContainer>
          <InputContainer label={"Numéro CIN"} name={"cin"} size={"w-[250px]"}>
            <input
              required=""
              autoComplete="false"
              placeholder="Numéro CIN"
              className="form__field bg-transparent"
              type="number"
              name="cin"
              value={etudiantData.cin}
              ref={formRefs[2]}
              onChange={(e) => {
                setEtudiantData({
                  ...etudiantData,
                  cin: e.target.value.toString(),
                });
              }}
            />
            <ErrorText text={errors.cin} field={"cin"} />
          </InputContainer>
          <InputContainer
            label={"Numéro téléphone"}
            name={"numTel"}
            size={"w-[250px]"}
          >
            <input
              required=""
              autoComplete="false"
              placeholder="Numéro téléphone"
              className="form__field bg-transparent"
              type="input"
              name="numTel"
              value={etudiantData.numTel}
              ref={formRefs[3]}
              onChange={(e) => {
                if (verifierNumeroTelephone(e.target)) {
                  // console.log(e.target.accessKey);
                  setEtudiantData({
                    ...etudiantData,
                    numTel: e.target.value,
                  });
                }
              }}
            />
            <ErrorText text={errors.numTel} field={"numTel"} />
          </InputContainer>
          <InputContainer label={"Email"} name={"email"} size={"w-[275px]"}>
            <input
              autoComplete="false"
              placeholder="E-mail"
              className="form__field bg-transparent"
              type="text"
              name="email"
              ref={formRefs[4]}
              value={etudiantData.email}
              onChange={(e) => {
                setEtudiantData({
                  ...etudiantData,
                  email: e.target.value,
                });
              }}
            />
            <ErrorText text={errors.email} field={"email"} />
          </InputContainer>
          <InputContainer
            label={"Numéro d'inscription"}
            name={"numInscription"}
            size={"w-[250px]"}
          >
            <input
              required=""
              autoComplete="false"
              placeholder="Numéro d'inscription"
              className="form__field bg-transparent"
              type="input"
              name="numInscription"
              ref={formRefs[5]}
              value={etudiantData.numInscription}
              onChange={(e) => {
                setEtudiantData({
                  ...etudiantData,
                  numInscription: e.target.value,
                });
              }}
            />
            <ErrorText text={errors.numInscription} field={"numInscription"} />
          </InputContainer>
          <InputContainer
            label={"Date de naissance"}
            name={"dateNaissance"}
            size={"w-[250px]"}
          >
            <input
              required=""
              autoComplete="false"
              placeholder="Date de naissance"
              className="form__field bg-transparent"
              type="date"
              name="dateNaissance"
              ref={formRefs[6]}
              value={formatedDate(etudiantData.dateNaissance)}
              onChange={(e) => {
                setEtudiantData({
                  ...etudiantData,
                  dateNaissance: new Date(e.target.value).toISOString(),
                });
              }}
            />
            <ErrorText text={errors.dateNaissance} field={"dateNaissance"} />
          </InputContainer>
          <InputContainer
            label={"Adresse"}
            name={"adresse"}
            size={"w-[250px] "}
          >
            <input
              required=""
              autoComplete="false"
              placeholder="Adresse"
              className="form__field bg-transparent"
              type="input"
              name="adresse"
              ref={formRefs[7]}
              value={etudiantData.adresse}
              onChange={(e) => {
                setEtudiantData({
                  ...etudiantData,
                  adresse: e.target.value,
                });
              }}
            />
            <ErrorText text={errors.adresse} field={"adresse"} />
          </InputContainer>
          <InputContainer
            label={"Année scolaire"}
            name={"asc"}
            size={"w-[250px] "}
          >
            <input
              required=""
              autoComplete="false"
              placeholder="Année scolaire"
              className="form__field bg-transparent"
              type="input"
              name="asc"
              value={etudiantData.asc}
              onChange={(e) => {
                setEtudiantData({
                  ...etudiantData,
                  asc: e.target.value,
                });
              }}
            />
            <ErrorText text={errors.asc} field={"asc"} />
          </InputContainer>
          <div>
            <div
              className="w-[250px] bg-slate-200 dark:bg-slate-900 py-2 px-1 rounded mt-8"
              onClick={toggleShow}
            >
              {classeValue}
            </div>

            {show && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="my-2 w-full relative flex flex-col  items-end "
                ref={ref}
              >
                {classes.map((classe) => (
                  <motion.div
                    key={classe.id}
                    id={classe.id}
                    variants={item}
                    onClick={getClasseValue}
                  >
                    <DropdownItem>
                      <span>{classe.nomClasse}</span>
                    </DropdownItem>
                  </motion.div>
                ))}
              </motion.div>
            )}
            <ErrorText text={errors.classeId} field={"classeId"} />
          </div>
        </div>
        <button
          className={`px-20 rounded text-lg info py-2 block mx-auto my-10 flex`}
          onClick={formHandler}
        >
          Ajouter
          {createStudentMutation.isLoading && (
            <CircleLoader white={"stroke-white dark:stroke-white"} />
          )}
        </button>
      </form>
      <AnimatePresence>
        {modal && (
          <Modal closeModal={closeModal}>
            <SuccessModal />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function ErrorText({ text, field }) {
  return (
    <p className={`text-red-500 font-sm error-message ${field}`}>{text}</p>
  );
}
function SuccessIcon({}) {
  const icon = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
    },
  };
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 24 24"
    >
      <motion.path
        className="fill-green-800"
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeInOut",
          duration: 0.3,
        }}
        d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z"
      />
    </motion.svg>
  );
}

function SuccessModal() {
  return (
    <motion.div
      initial={{ translateX: -600 }}
      animate={{ translateX: 0 }}
      exit={{ translateX: 1000 }}
      transition={{ duration: 0.5 }}
      className="success-result w-full h-full flex flex-col items-center justify-center"
    >
      <SuccessIcon />
      <h1 className="text-xl">Mise è jour effectuée</h1>
    </motion.div>
  );
}
