import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Components/Modal/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { container, item } from "../Components/animation";
import { v4 as uuidv4 } from "uuid";
import ClasseBtn from "../Components/ClasseBtn/ClasseBtn";
import Td from "../Components/Table/Td";
import Th from "../Components/Table/Th";
import Tr from "../Components/Table/Tr";
import Header from "../Components/Table/Header";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CircleLoader from "../Components/CircleLoader/CircleLoader";
import { RxCross1, RxPencil1, RxEyeOpen } from "react-icons/rx";
import { getMatieres } from "../redux/reducers/MatiereReducer";
import { useMutation } from "react-query";
import Loader from "../Components/Loader/Loader";
import { FcFullTrash } from "./Etudiant/ListeEtudiant";

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

export default function Matieres() {
  let pathname = useLocation().pathname.split("/")[1];
  pathname = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const dispatch = useDispatch();

  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedToUpdate, setSelectedToUpdate] = useState("");
  const toggleAddModal = () => setAddModal(!addModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);

  const { isFetching, matieres } = useSelector((state) => ({
    ...state.MatiereReducer,
  }));

  useEffect(() => {
    if (!toggleDeleteModal) setSelectedId("");
  }, [deleteModal]);

  useEffect(() => {
    dispatch({
      type: "CHANGE_TITLE",
      payload: pathname,
    });
    dispatch({
      type: "CHANGE_ACTIVE",
      payload: pathname,
    });
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold py-5 text-center ">
        Liste des matières
      </h1>
      <div className="flex items-center justify-center">
        <div className="w-12 h-12">
          {isFetching && <CircleLoader rayon={20} options="w-[48px]" />}
        </div>
      </div>
      <div className="flex items-center justify-end mr-12">
        <span onClick={toggleAddModal}>
          <Button color="info" text="Ajouter" />
        </span>
      </div>
      <div className=" relative inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
        <ClassesList />
      </div>
      <table
        className={`w-[85%] mx-auto my-8 ${
          typeof matieres === "string" && " relative h-80"
        } `}
      >
        <TableHeader />
        <TableBody
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          toggleDeleteModal={toggleDeleteModal}
          toggleUpdateModal={toggleUpdateModal}
          setSelectedToUpdate={setSelectedToUpdate}
        />
      </table>
      <AnimatePresence>
        {addModal && <AddModal closeModal={toggleAddModal} />}
        {deleteModal && (
          <DeleteModal
            toggleDeleteModal={toggleDeleteModal}
            selectedId={selectedId}
          />
        )}
        {updateModal && (
          <UpdateModal
            toggleUpdateModal={toggleUpdateModal}
            selectedId={selectedId}
            selectedToUpdate={selectedToUpdate}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Button({ color, text, options }) {
  return (
    <button
      className={`py-2 px-12 text-lg rounded-md ${color} ${options && options}`}
    >
      {text}
    </button>
  );
}

function AddModal({ closeModal }) {
  const [matiereData, setMatiereData] = useState({
    nomMatiere: "",
    acronyme: "",
    coef: 1,
    classeId: "",
  });

  const [errors, setErrors] = useState({
    nomMatiere: "",
    acronyme: "",
    coef: "",
    classeId: "",
  });

  const [nomClasse, setNomClasse] = useState("Choississer une classe");
  const [show, setShow] = useState(true);

  const [dropdown, setDropdown] = useState(false);
  const toggle = () => setDropdown(!dropdown);

  const getClasseValue = (e) => {
    setMatiereData({
      ...matiereData,
      classeId: e.target.id,
    });
    setNomClasse(e.target.innerText);
    toggle();
  };
  const addErrors = (prop, value) => {
    setErrors((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const fetchAdd = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return await fetch(`http://localhost:5001/matiere`, {
      method: "POST",
      body: JSON.stringify(matiereData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  const addMutation = useMutation(fetchAdd, {
    onSuccess: (data) => {
      if (data.success) {
      }
    },
  });

  const addMatiere = () => {
    setErrors({
      nomMatiere: "",
      acronyme: "",
      coef: "",
      classeId: "",
    });
    for (let att in matiereData) {
      if (matiereData[att] === "") {
        addErrors(att, "Veuiller remplir ce champs");
        return false;
      }
    }
    setShow(false);
    addMutation.mutate();
  };

  const dispatch = useDispatch();
  const { activeClasse } = useSelector((state) => ({
    ...state.MatiereReducer,
  }));

  useEffect(() => {
    dispatch(getMatieres(activeClasse));
    if (addMutation.isSuccess) {
      setTimeout(() => {
        closeModal();
      }, 3000);
    }
  }, [addMutation.isSuccess]);

  return (
    <Modal closeModal={closeModal} options="w-[500px] h-auto">
      {show && (
        <div>
          <h2 className="text-center text-xl font-medium mb-6">
            Ajouter une matière
          </h2>
          <div className="flex flex-col space-x-2 mb-3">
            <div>
              <label htmlFor="nomMatiere">Nom matière : </label>
              <input
                type="text"
                value={matiereData.nomMatiere}
                onChange={(e) => {
                  setMatiereData({
                    ...matiereData,
                    nomMatiere: e.target.value,
                  });
                }}
                className="bg-transparent outline-none  text-lg border rounded  border-gray-400 dar px-2 py-1 w-3/5"
              />
            </div>
            <p className="text-sm text-red-700 text-center">
              {errors.nomMatiere}
            </p>
          </div>
          <div className="flex flex-col  space-x-2 mb-3">
            <div>
              <label htmlFor="acronyme">Acronyme : </label>
              <input
                type="text"
                value={matiereData.acronyme}
                onChange={(e) => {
                  setMatiereData({
                    ...matiereData,
                    acronyme: e.target.value,
                  });
                }}
                className="bg-transparent outline-none  text-lg border rounded border-gray-400 px-2 py-1 w-3/5"
              />
            </div>
            <p className="text-sm text-red-700 text-center">
              {errors.acronyme}
            </p>
          </div>
          <div className="flex flex-col space-x-2 mb-3">
            <div>
              <label htmlFor="coef">Coefficient : </label>
              <input
                type="number"
                value={matiereData.coef}
                onChange={(e) => {
                  const value = e.target.value;

                  // Remove any occurrence of "e" from the input value
                  const sanitizedValue = value.replace(/e/gi, "");
                  if (
                    Number(sanitizedValue) >= 0 &&
                    Number(sanitizedValue) < 7
                  ) {
                    setMatiereData({
                      ...matiereData,
                      coef: Number(sanitizedValue),
                    });
                  } else {
                    console.log("LIMIT");
                  }
                }}
                className="bg-transparent outline-none  text-lg border rounded border-gray-400 px-2 py-1 w-1/3"
              />
            </div>
            <p className="text-sm text-red-700 text-center">{errors.coef}</p>
          </div>
          <div className="flex items-center space-x-3">
            <label htmlFor="classeId">Classe : </label>
            <div className="relative">
              <div
                onClick={toggle}
                className="default text-lg py-2 px-6 rounded w-max cursor-pointer h-max"
              >
                {nomClasse}
              </div>
              <AnimatePresence>
                {dropdown && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={container}
                    className="relative flex flex-col flex-nowrap  items-end"
                  >
                    {classes.map((classe) => (
                      <motion.div
                        key={classe.id}
                        id={classe.id}
                        variants={item}
                        onClick={getClasseValue}
                        className="default text-lg py-2 px-6  text-center cursor-pointer h-max w-[75px]"
                      >
                        {classe.nomClasse}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-sm text-red-700 text-center">
              {errors.classeId}
            </p>
          </div>
          <div className="my-4 flex justify-center space-x-4 ">
            <span onClick={addMatiere}>
              <Button
                text={"Ajouter"}
                color={"info"}
                options="text-medium px-8"
              />
            </span>
            <span onClick={closeModal}>
              <Button
                text={"Fermer"}
                color={"default"}
                options="text-medium px-8"
              />
            </span>
          </div>
        </div>
      )}
      <AnimatePresence>
        {addMutation.isLoading ? (
          <motion.div
            initial={{ translateX: -600 }}
            animate={{ translateX: 0 }}
            exit={{ translateX: 1000 }}
            transition={{ duration: 0.5 }}
            className="loading-add w-full py-24 h-full flex flex-col items-center justify-center"
          >
            <Loader />
            <h1 className="text-xl mt-6">Ajout en cours ...</h1>
          </motion.div>
        ) : (
          addMutation.isSuccess && (
            <motion.div
              initial={{ translateX: -600 }}
              animate={{ translateX: 0 }}
              exit={{ translateX: 1000 }}
              transition={{ duration: 0.5 }}
              className="success-result w-full h-full flex flex-col items-center justify-center"
            >
              <SuccessIcon />
              <h1 className="text-xl">Ajout effectuée</h1>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Modal>
  );
}
function DeleteModal({ toggleDeleteModal, selectedId }) {
  const [show, setShow] = useState(true);
  const { activeClasse } = useSelector((state) => ({
    ...state.MatiereReducer,
  }));
  const dispatch = useDispatch();
  const deleteMatiere = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await fetch(`http://localhost:5001/matiere/${selectedId}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  const deleteMutation = useMutation(deleteMatiere, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const handleDelete = () => {
    setShow(!show);
    deleteMutation.mutate();
  };

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      dispatch(getMatieres(activeClasse));
      setTimeout(() => {
        toggleDeleteModal();
      }, 1500);
    }
  }, [deleteMutation.isSuccess]);

  return (
    <Modal closeModal={toggleDeleteModal} options="w-[550px] h-[350px]">
      {show && (
        <div className="delete-confirmation">
          <h1 className="text-center text-2xl ">
            Vouler vraiment supprimer cet matière {selectedId}?
          </h1>
          <div className="flex items-center justify-center my-5">
            <FcFullTrash />
          </div>
          <div className="flex justify-center space-x-4 mt-10">
            <button
              onClick={handleDelete}
              className="danger py-2 px-8 text-lg rounded-md"
            >
              Supprimer
            </button>
            <button
              className="default py-2 px-8 text-lg rounded-md"
              onClick={toggleDeleteModal}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {deleteMutation.isLoading ? (
          <motion.div
            initial={{ translateX: -600 }}
            animate={{ translateX: 0 }}
            exit={{ translateX: 1000 }}
            transition={{ duration: 0.5 }}
            className="loading-delete w-full h-full flex flex-col items-center justify-center"
          >
            <CircleLoader options={"w-36"} />
            <h1 className="text-xl">Suppression en cours ...</h1>
          </motion.div>
        ) : (
          deleteMutation.isSuccess && (
            <motion.div
              initial={{ translateX: -600 }}
              animate={{ translateX: 0 }}
              exit={{ translateX: 1000 }}
              transition={{ duration: 0.5 }}
              className="success-result w-full h-full flex flex-col items-center justify-center"
            >
              <SuccessIcon />
              <h1 className="text-xl">Le matière a été supprimé</h1>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Modal>
  );
}

function UpdateModal({ toggleUpdateModal, selectedId, selectedToUpdate}) {
  const [matiereData, setMatiereData] = useState(selectedToUpdate);
  const dispatch = useDispatch()
  const {activeClasse} = useSelector((state)=>({
    ...state.MatiereReducer
  }))

  const [errors, setErrors] = useState({
    nomMatiere: "",
    acronyme: "",
    coef: "",
  });


  const [show, setShow] = useState(true);



  const updateErrors = (prop, value) => {
    setErrors((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const fetchUpdate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return await fetch(`http://localhost:5001/matiere/${selectedId}`, {
      method: "PUT",
      body: JSON.stringify(matiereData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  const updateMutation = useMutation(fetchUpdate, {
    onSuccess: (data) => {
      if (data.success) {
      }
    },
  });
  const addErrors = (prop, value) => {
    setErrors((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const updateMatiere = () =>{
    setErrors({
      nomMatiere: "",
      acronyme: "",
      coef: "",
    });
    for (let att in matiereData) {
      if (matiereData[att] === "") {
        addErrors(att, "Veuiller remplir ce champs");
        return false;
      }
    }
    setShow(false);
    updateMutation.mutate();
  }

  useEffect(() => {
    if (updateMutation.isSuccess) {
      dispatch(getMatieres(activeClasse));
      setTimeout(() => {
        toggleUpdateModal();
      }, 1500);
    }
  }, [updateMutation.isSuccess]);

  return (
    <Modal closeModal={toggleUpdateModal}>
       {show && (
        <div>
          <h2 className="text-center text-xl font-medium mb-6">
            Modifier une matière
          </h2>
          <div className="flex flex-col space-x-2 mb-3">
            <div>
              <label htmlFor="nomMatiere">Nom matière : </label>
              <input
                type="text"
                value={matiereData.nomMatiere}
                onChange={(e) => {
                  setMatiereData({
                    ...matiereData,
                    nomMatiere: e.target.value,
                  });
                }}
                className="bg-transparent outline-none  text-lg border rounded  border-gray-400 dar px-2 py-1 w-3/5"
              />
            </div>
            <p className="text-sm text-red-700 text-center">
              {errors.nomMatiere}
            </p>
          </div>
          <div className="flex flex-col  space-x-2 mb-3">
            <div>
              <label htmlFor="acronyme">Acronyme : </label>
              <input
                type="text"
                value={matiereData.acronyme}
                onChange={(e) => {
                  setMatiereData({
                    ...matiereData,
                    acronyme: e.target.value,
                  });
                }}
                className="bg-transparent outline-none  text-lg border rounded border-gray-400 px-2 py-1 w-3/5"
              />
            </div>
            <p className="text-sm text-red-700 text-center">
              {errors.acronyme}
            </p>
          </div>
          <div className="flex flex-col space-x-2 mb-3">
            <div>
              <label htmlFor="coef">Coefficient : </label>
              <input
                type="number"
                value={matiereData.coef}
                onChange={(e) => {
                  const value = e.target.value;

                  // Remove any occurrence of "e" from the input value
                  const sanitizedValue = value.replace(/e/gi, "");
                  if (
                    Number(sanitizedValue) >= 0 &&
                    Number(sanitizedValue) < 7
                  ) {
                    setMatiereData({
                      ...matiereData,
                      coef: Number(sanitizedValue),
                    });
                  } else {
                    console.log("LIMIT");
                  }
                }}
                className="bg-transparent outline-none  text-lg border rounded border-gray-400 px-2 py-1 w-1/3"
              />
            </div>
            <p className="text-sm text-red-700 text-center">{errors.coef}</p>
          </div>
          
          <div className="my-4 flex justify-center space-x-4 ">
            <span onClick={updateMatiere}>
              <Button
                text={"Modifier"}
                color={"info"}
                options="text-medium px-8"
              />
            </span>
            <span onClick={toggleUpdateModal}>
              <Button
                text={"Fermer"}
                color={"default"}
                options="text-medium px-8"
              />
            </span>
          </div>
        </div>
      )}
      <AnimatePresence>
        {updateMutation.isLoading ? (
          <motion.div
            initial={{ translateX: -600 }}
            animate={{ translateX: 0 }}
            exit={{ translateX: 1000 }}
            transition={{ duration: 0.5 }}
            className="loading-add w-full py-24 h-full flex flex-col items-center justify-center"
          >
            <Loader />
            <h1 className="text-xl mt-6">Modification  en cours ...</h1>
          </motion.div>
        ) : (
          updateMutation.isSuccess && (
            <motion.div
              initial={{ translateX: -600 }}
              animate={{ translateX: 0 }}
              exit={{ translateX: 1000 }}
              transition={{ duration: 0.5 }}
              className="success-result w-full h-full flex flex-col items-center justify-center"
            >
              <SuccessIcon />
              <h1 className="text-xl">Modification effectuée</h1>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Modal>
  );
}

function ClassesList() {
  const { activeClasse } = useSelector((state) => ({
    ...state.MatiereReducer,
  }));

  return (
    <>
      {classes.map((classe) => (
        <ClasseBtn
          key={uuidv4()}
          id={classe.id}
          text={classe.nomClasse}
          activeClasse={activeClasse}
        />
      ))}
    </>
  );
}

function TableHeader() {
  return (
    <Header>
      <Th options="rounded-tl-2xl px-1">Nom matière</Th>
      <Th>Acronyme</Th>
      <Th>Coefficient</Th>
      <Th options={"rounded-tr-2xl"}>Actions</Th>
    </Header>
  );
}

function TableBody({
  toggleDeleteModal,
 
  setSelectedId,
  toggleUpdateModal,
  setSelectedToUpdate,
}) {
  const { matieres, activeClasse, isFetching } = useSelector((state) => ({
    ...state.MatiereReducer,
  }));

  const tab = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const dispatch = useDispatch();
  const handleDelete = (e) => {
    setSelectedId(e.target.parentElement.id);
    toggleDeleteModal();
  };

  const handleUpdate = (e) => {
    setSelectedId(e.target.parentElement.id);
    const row =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.childNodes;
    let obj = {
      nomMatiere: row[0].innerText,
      acronyme: row[1].innerText,
      coef: Number(row[2].innerText),
    };

    setSelectedToUpdate(obj);

    toggleUpdateModal();
  };

  useEffect(() => {
    dispatch(getMatieres(activeClasse));
  }, [activeClasse]);

  return (
    <>
      {matieres === null ? (
        <tbody>
          {tab.map((item) => (
            <TrSkeleton key={uuidv4()} />
          ))}
        </tbody>
      ) : typeof matieres !== "string" ? (
        <tbody>
          {matieres.map((matiere) => (
            <Tr key={uuidv4()}>
              <Td>{matiere.nomMatiere}</Td>
              <Td>{matiere.acronyme}</Td>
              <Td>{matiere.coef}</Td>
              <Td>
                <Td>
                  <div className="flex space-x-2">
                    <span
                      onClick={handleDelete}
                      className="cursor-pointer"
                      id={matiere.id}
                    >
                      <RxCross1 size={"24px"} />
                    </span>
                    <span
                      onClick={handleUpdate}
                      className="cursor-pointer"
                      id={matiere.id}
                    >
                      <RxPencil1 size={"24px"} />
                    </span>
                  </div>
                </Td>
              </Td>
            </Tr>
          ))}
        </tbody>
      ) : (
        <div className="w-full h-full absolute text-center flex flex-col items-center justify-center ">
          <EmptyIcon />
          <h1>Il n'y pas de matière dans cette classe</h1>
        </div>
      )}
    </>
  );
}

function TrSkeleton({}) {
  return (
    <Tr>
      <Td>
        <Skeleton width={150} height={19} />
      </Td>
      <Td>
        <Skeleton width={150} height={19} />
      </Td>
      <Td>
        <Skeleton width={150} height={19} />
      </Td>
      <Td>
        <div className="flex space-x-6">
          <Skeleton circle width={40} height={40} />
          <Skeleton circle width={40} height={40} />
        </div>
      </Td>
    </Tr>
  );
}

export function EmptyIcon({}) {
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
      width="96"
      height="96"
      viewBox="0 0 48 48"
    >
      <motion.path
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          default: { duration: 2, ease: "easeInOut" },
          fill: { duration: 2, ease: [1, 0, 0.8, 1] },
        }}
        className="fill-[#d1c4e9]"
        d="M38 7H10c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12H10c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm0 12H10c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z"
      />
      <motion.circle
        cx="38"
        cy="38"
        r="10"
        variants={icon}
        initial="hidden"
        animate="visible"
        className="fill-[#F44336]"
        transition={{
          default: { duration: 1, ease: "easeInOut" },
          fill: { duration: 1, ease: [1, 0, 0.8, 1] },
        }}
      />

      <g fill="#fff">
        <motion.path
          variants={icon}
          initial="hidden"
          animate="visible"
          transition={{
            default: { duration: 2, ease: "easeInOut" },
            fill: { duration: 2, ease: [1, 0, 0.8, 1] },
          }}
          d="m43.31 41.181l-2.12 2.122l-8.485-8.484l2.121-2.122z"
        />
        <motion.path
          variants={icon}
          initial="hidden"
          animate="visible"
          transition={{
            default: { duration: 2, ease: "easeInOut" },
            fill: { duration: 2, ease: [1, 0, 0.8, 1] },
          }}
          d="m34.819 43.31l-2.122-2.12l8.484-8.485l2.122 2.121z"
        />
      </g>
    </motion.svg>
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
