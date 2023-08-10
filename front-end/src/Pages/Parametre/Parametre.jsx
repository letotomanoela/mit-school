import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { container, item } from "../../Components/animation";
import { useMutation } from "react-query";
import CircleLoader from "../../Components/CircleLoader/CircleLoader";

const Parametre = () => {
  const dispatch = useDispatch();
  const [oldPseudo, setOldPseudo] = useState("");

  const [newPseudo, setNewPseudo] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [openPseudo, setOpenPseudo] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [canChangePseudo, setCanChangePseudo] = useState(false);
  const [canChangePassword, setCanChangePassword] = useState(false);
  const [showPseudoAlert, setShowPseudoAlert] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    oldPseudo: "",
    newPseudo: "",
  });
  const [id, setId] = useState("");

  const { userId } = useSelector((state) => ({
    ...state.AuthReducer,
  }));

  const fetchVerify = async () => {
    return await fetch("http://localhost:5001/user/changePseudo", {
      body: JSON.stringify({ pseudo: oldPseudo, id: userId }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  const fetchUpdatePseudo = async () => {
    return await fetch("http://localhost:5001/user/updatePseudo", {
      body: JSON.stringify({ pseudo: newPseudo, id }),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  const verifyMutation = useMutation(fetchVerify, {
    onSuccess: (data) => {
      const { message, success, id } = data;
      if (success) {
        setErrors({
          ...errors,
          oldPseudo: "",
        });
        setNewPseudo("");
        setOldPseudo("");
        setId(id);
        setCanChangePseudo(true);
      } else {
        setErrors({
          ...errors,
          oldPseudo: message,
        });
      }
    },
  });

  const updatePseudoMutation = useMutation(fetchUpdatePseudo, {
    onSuccess: (data) => {
      if (data.success) {
        setShowPseudoAlert(true);
        setCanChangePseudo(false);
        setErrors({
          ...errors,
          oldPseudo: "",
          newPseudo: "",
        });
      }
    },
  });

  const handlePseudoClick = () => {
    if (oldPseudo === "") {
      setErrors({
        ...errors,
        oldPseudo: "Veuillez entrer votre ancien pseudo",
      });
      return;
    }
    if (!canChangePseudo) {
      verifyMutation.mutate();
    } else {
      if (newPseudo === "") {
        setErrors({
          ...errors,
          newPseudo: "Veuillez entrer votre nouveau pseudo",
        });

        return;
      }
      if (newPseudo.length < 6) {
        setErrors({
          ...errors,
          newPseudo: "Aumoins 6 caractères",
        });
        return;
      }
      updatePseudoMutation.mutate();
    }
  };

  const fetchVerifyPassword = async () => {
    return await fetch("http://localhost:5001/user/verifyPassword", {
      method: "POST",
      body: JSON.stringify({ password: oldPassword, userId }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  const verifyPasswordMutation = useMutation(fetchVerifyPassword, {
    onSuccess: (data) => {
      const { message, success, id } = data;
      if (success) {
        setErrors({
          ...errors,
          oldPassword: "",
        });

        setId(id);
        setCanChangePassword(true);
      } else {
        setErrors({
          ...errors,
          oldPassword: message,
        });
      }
    },
  });

  const fetchChangePassword = async () => {
    return await fetch("http://localhost:5001/user/changePassword", {
      method: "PUT",
      body: JSON.stringify({ password: newPassword, id }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  const changePasswordMutation = useMutation(fetchChangePassword, {
    onSuccess: (data) => {
      if (data.success) {
        setOldPassword("");
        setCanChangePassword("");
        setConfirmNewPassword("");
        setNewPassword("");
        setShowPasswordAlert(true)
      }
    },
  });

  const handlePasswordClick = () => {
    if (oldPassword === "") {
      setErrors({
        ...errors,
        oldPassword: "Veuillez entrer votre ancien pseudo",
      });
      return;
    }
    if (!canChangePassword) {
      verifyPasswordMutation.mutate();
    } else {
      if (newPassword === "") {
        setErrors({
          ...errors,
          newPassword: "Veuillez entrer votre nouveau pseudo",
        });

        return;
      } else {
        if (newPassword < 8) {
          setErrors({
            ...errors,
            newPassword: "Aumoins 8 caractère",
          });
          return;
        } else {
          if (confirmNewPassword === "") {
            setErrors({
              ...errors,
              confirmNewPassword: "Veuillez confirmer votre mot de passe",
            });
            return;
          } else {
            if (confirmNewPassword !== newPassword) {
              setErrors({
                ...errors,
                confirmNewPassword: "Mot de passe différent",
              });
              return;
            }
          }
        }

        changePasswordMutation.mutate();
      }
    }
  };

  useEffect(() => {
    document.title = "Paramètres";
    dispatch({
      type: "CHANGE_TITLE",
      payload: "Paramètres",
    });
    dispatch({
      type: "CHANGE_ACTIVE",
      payload: "Paramètres",
    });
  }, []);

  useEffect(() => {
    if (showPseudoAlert) {
      setTimeout(() => {
        setShowPseudoAlert(false);
      }, 1500);
    }
  }, [showPseudoAlert]);
  useEffect(() => {
    if (showPasswordAlert) {
      setTimeout(() => {
        setShowPasswordAlert(false);
      }, 1500);
    }
  }, [showPasswordAlert]);
  return (
    <>
      <h1 className="py-5 text-2xl font-bold px-3">Paramètres de compte</h1>

      <p className="px-3">Choississez votre actions : </p>
      <p
        onClick={() => setOpenPseudo(!openPseudo)}
        className="px-4 py-2  underline text-indigo-500 text-lg cursor-pointer"
      >
        {" "}
        Changer le pseudo
      </p>
      {showPseudoAlert && (
        <AnimatePresence>
          <SuccessMessage message={"Votre pseudo a été modifié"} />
        </AnimatePresence>
      )}

      {openPseudo && (
        <AnimatePresence>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="px-5 w-max"
          >
            <motion.div variants={item} className="my-3">
              <label>Entrer votre ancien pseudo : </label>
              <input
                type="text"
                value={oldPseudo}
                onChange={(e) => {
                  setOldPseudo(e.target.value);
                }}
                className="bg-transparent w-96 py-2 px-3 border border-gray-600  ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
              />
              <p className="text-red-500">{errors.oldPseudo}</p>
            </motion.div>
            {canChangePseudo && (
              <motion.div variants={item} className="my-3">
                <label>Entrer votre nouveau pseudo : </label>
                <input
                  type="text"
                  value={newPseudo}
                  onChange={(e) => setNewPseudo(e.target.value)}
                  className="bg-transparent
            w-96 py-2 px-3 border border-gray-600  ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                />
                <p className="text-red-500">{errors.newPseudo}</p>
              </motion.div>
            )}

            <motion.button
              variants={item}
              onClick={handlePseudoClick}
              className="info rounded py-2 px-4 flex justify-center mx-auto "
            >
              {!canChangePseudo
                ? "Chercher mon pseudo"
                : "Enregistrer le nouveau pseudo"}{" "}
              {(verifyMutation.isLoading || updatePseudoMutation.isLoading) && (
                <CircleLoader white={"stroke-white dark:stroke-white"} />
              )}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      )}
      <p
        onClick={() => setOpenPassword(!openPassword)}
        className="px-4 py-2  underline text-indigo-500 text-lg cursor-pointer"
      >
        {" "}
        Changer le mot passe
      </p>
      {showPasswordAlert && (
        <AnimatePresence>
          <SuccessMessage message={"Votre mot de passe a été modifié"} />
        </AnimatePresence>
      )}
      {openPassword && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="px-5 w-max"
        >
          <motion.div variants={item} className="my-3">
            <label>Entrer votre ancien mot de passe : </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="  bg-transparent w-96 py-2 px-3 border border-gray-600  ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
            />
            <p className="text-red-500">{errors.oldPassword}</p>
          </motion.div>
          {canChangePassword && (
            <>
              <motion.div variants={item} className="my-3">
                <label>Entrer votre nouveau mot de passe : </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  className="bg-transparent w-96 py-2 px-3 border border-gray-600  ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                />
                <p className="text-red-500">{errors.newPassword}</p>
              </motion.div>

              <motion.div variants={item} className="">
                <div className="my-3">
                  <label>Confirmer votre nouveau mot de passe : </label>
                  <input
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    type="password"
                    className="bg-transparent w-96 py-2 px-3 border border-gray-600  ease-in-out duration-200 rounded outline-none ring-0 
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
                  />
                  <p className="text-red-500">{errors.confirmNewPassword}</p>
                </div>
              </motion.div>
            </>
          )}

          <button
            onClick={handlePasswordClick}
            className="info rounded py-2 px-4 flex justify-center items-center mx-auto"
          >
            {!canChangePassword
              ? "Vérifier mon mot de passe"
              : "Enregistrer le nouveau mot de passe"}{" "}
            {(verifyPasswordMutation.isLoading ||
              changePasswordMutation.isLoading) && (
              <CircleLoader white={"stroke-white dark:stroke-white"} />
            )}
          </button>
        </motion.div>
      )}
    </>
  );
};

export default Parametre;

function SuccessMessage({ message }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      id="toast-success"
      className="flex items-center w-full max-w-xs p-3 mb-4 text-gray-500 bg-green-100 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
        </svg>
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
    </motion.div>
  );
}
