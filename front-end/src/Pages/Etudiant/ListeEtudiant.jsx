import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiSearchLine } from "react-icons/ri";
import Td from "../../Components/Table/Td";
import Th from "../../Components/Table/Th";
import Header from "../../Components/Table/Header";
import Tr from "../../Components/Table/Tr";
import Img from "../../Components/Table/Img";
import { RxCross1, RxPencil1, RxEyeOpen } from "react-icons/rx";
import Pagination from "../../Components/Table/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  getEtudiant,
  searchEtudiant,
  getTotalEtudiant,
  totalSearchEtudiant,
} from "../../redux/reducers/ListeEtudiantReducer";
import { v4 as uuidv4 } from "uuid";
import TrSkeleton from "../../Components/Skeleton/TrSkeleton";
import Page404 from "../../Components/404/Page404";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../../Components/Modal/Modal";
import ClasseBtn from "../../Components/ClasseBtn/ClasseBtn";
import { useQuery, useMutation } from "react-query";
import { formatedDate } from "../../utils/formatedDate";
import CircleLoader from "../../Components/CircleLoader/CircleLoader";
import { container, item } from "../../Components/animation";
import DropdownItem from "../../Components/Dropdown/Dropdown";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import { EmptyIcon } from "../Matieres";
export default function ListeEtudiant() {
  document.title = "Liste des étudiants"
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
  const dispatch = useDispatch();
  const {
    listeEtudiant,
    activeClasse,
    skip,
    asc,
    pagination,
    isFetching,
    error,
    errorMessage
  } = useSelector((state) => ({
    ...state.ListeEtudiantReducer,
  }));
  const [val, setVal] = useState("");
  const [infoModal, setInfoModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const toggleInfoModal = () => {
    setInfoModal(!infoModal);
  };
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const handleId = (e) => {
    console.log;
    const id = e.target.parentElement.id;
    setSelectedId(id);
  };

  const handleInfoClick = (e) => {
    handleId(e);
    toggleInfoModal();
  };

  const handleDeleteClick = (e) => {
    handleId(e);
    toggleDeleteModal();
  };

  const handleUpdateClick = (e) => {
    handleId(e);
    toggleUpdateModal();
  };

  const searchFunc = (e) => {
    setVal(e.target.value);
  };

  async function fetchInfo() {
    return await fetch(`http://localhost:5001/etudiant/${selectedId}`).then(
      (res) => res.json()
    );
  }

  useEffect(() => {
    dispatch({
      type: "CHANGE_ACTIVE_NAV",
      payload: "liste-etudiant",
    });
  }, []);

  useEffect(() => {
    if (val === "") {
      dispatch(getTotalEtudiant(activeClasse, asc));
      dispatch(getEtudiant(activeClasse, asc, skip));
    } else {
      dispatch(totalSearchEtudiant(activeClasse, asc, val));
      dispatch(searchEtudiant(activeClasse, asc, val, skip));
      dispatch({
        type: "CHANGE_SKIP",
        payload: 1,
      });
    }
  }, [activeClasse, val]);

  return (
    <>
      <p className="text-xl my-2 ">Liste des étudiants</p>
      {isFetching && (
        <div className="w-12 h-12 mx-auto">
          <CircleLoader rayon={20} options="w-[48px]" />
        </div>
      )}
      <div className="my-3 flex justify-between">
        <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
          {classes.map((classe) => (
            <ClasseBtn
              key={uuidv4()}
              id={classe.id}
              text={classe.nomClasse}
              activeClasse={activeClasse}
            />
          ))}
        </div>
        <div className="border border-slate-300 dark:border-slate-500 w-80 rounded flex py-2 px-3 items-center space-x-2">
          <RiSearchLine size={"20px"} />
          <input
            onChange={searchFunc}
            value={val}
            type="text"
            className="outline-none bg-transparent w-full"
          />
        </div>
      </div>
      {error ? (
        <div className="w-full h-[500px] flex flex-col items-center justify-center">
            <EmptyIcon/>  
            <h1 className="text-3xl">Une erreur s'est produite</h1>
            <h2 className="text-lg">{errorMessage}</h2>
        </div>
      ) : (
        <table className="w-full mb-4">
          <TableHeader />
          <Tbody
            listeEtudiant={listeEtudiant}
            handleInfoClick={handleInfoClick}
            handleDeleteClick={handleDeleteClick}
            handleUpdateClick={handleUpdateClick}
            val={val}
            setVal={setVal}
          />
        </table>
      )}

      <div className="w-full flex justify-center mb-5">
        {pagination > 1 && <Pagination />}
      </div>
      <AnimatePresence>
        {infoModal && (
          <InfoModal
            toggleInfoModal={toggleInfoModal}
            selectedId={selectedId}
          />
        )}
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
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Tbody({
  listeEtudiant,
  handleInfoClick,
  val,
  handleDeleteClick,
  setVal,
  handleUpdateClick,
}) {
  const tab = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <tbody
      className={
        typeof listeEtudiant === "string" ? "relative h-96 w-full" : ""
      }
    >
      {typeof listeEtudiant === "string" ? (
        <Page404 search={val} setVal={setVal} />
      ) : listeEtudiant.length !== 0 ? (
        listeEtudiant.map((etudiant) => (
          <Tr key={uuidv4()}>
            <Td>
              <div className="flex space-x-1 items-center">
                <Img image={etudiant.image} />
                <p>{etudiant.numInscription}</p>
              </div>
            </Td>
            <Td>{etudiant.nomEtudiant}</Td>
            <Td>{etudiant.cin}</Td>
            <Td>{etudiant.numTel}</Td>
            <Td>{etudiant.email}</Td>
            <Td>
              <div className="flex space-x-2">
                <span
                  className="cursor-pointer"
                  id={etudiant.id}
                  onClick={handleDeleteClick}
                >
                  <RxCross1 size={"24px"} />
                </span>
                <span
                  className="cursor-pointer"
                  id={etudiant.id}
                  onClick={handleUpdateClick}
                >
                  <RxPencil1 size={"24px"} />
                </span>
                <span
                  className="cursor-pointer"
                  id={etudiant.id}
                  onClick={handleInfoClick}
                >
                  <RxEyeOpen size={"24px"} />
                </span>
              </div>
            </Td>
          </Tr>
        ))
      ) : (
        tab.map((t) => <TrSkeleton key={uuidv4()} />)
      )}
    </tbody>
  );
}

function useGetInfoQuery({ selectedId }) {
  const fetchInfo = async () => {
    return await fetch(`http://localhost:5001/etudiant/${selectedId}`).then(
      (res) => res.json()
    );
  };

  return useQuery(["info", selectedId], fetchInfo, {
    enabled: false,
  });
}

function InfoModal({ toggleInfoModal, selectedId }) {
  const getInfoQuery = useGetInfoQuery({ selectedId });

  useEffect(() => {
    if (selectedId !== "") getInfoQuery.refetch();
  }, [selectedId]);

  return (
    <Modal closeModal={toggleInfoModal} options="w-[500px] h-[600px]">
      <h1 className="text-center text-xl font-bold">Informations</h1>
      {getInfoQuery.isLoading && (
        <div className="flex justify-center items-center">
          <Skeleton circle width={192} height={192} />
        </div>
      )}

      {getInfoQuery.isSuccess && (
        <div className="w-48 h-48 rounded-full overflow-hidden bg-cyan-950 mx-auto my-3">
          <img
            src={`http://localhost:5001${getInfoQuery.data[0].image}`}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
      )}
      <p className="text-lg">
        <span className="font-bold">Nom complet</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess && getInfoQuery.data[0].nomEtudiant}
      </p>
      <p className="text-lg">
        <span className="font-bold">Date de naissance</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess &&
          formatedDate(getInfoQuery.data[0].dateNaissance)}
      </p>
      <p className="text-lg">
        <span className="font-bold">Numéro d'inscription</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess && getInfoQuery.data[0].numInscription}
      </p>
      <p className="text-lg">
        <span className="font-bold">Numéro téléphone</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess && getInfoQuery.data[0].numTel}
      </p>
      <p className="text-lg">
        {" "}
        <span className="font-bold">Numéro CIN</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess && getInfoQuery.data[0].cin}
      </p>
      <p className="text-lg">
        {" "}
        <span className="font-bold">Email</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess && getInfoQuery.data[0].email}
      </p>
      <p className="text-lg">
        {" "}
        <span className="font-bold">Adresse</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess && getInfoQuery.data[0].adresse}
      </p>
      <p className="text-lg">
        {" "}
        <span className="font-bold">Classe</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess && getInfoQuery.data[0].classe.nomClasse}
      </p>
      <p className="text-lg">
        {" "}
        <span className="font-bold">Année scolaire</span> :{" "}
        {getInfoQuery.isLoading && <Skeleton width={200} height={20} />}
        {getInfoQuery.isSuccess && getInfoQuery.data[0].asc}
      </p>

      <button
        className="danger px-12 py-2 text-lg rounded-md block mx-auto mt-5"
        onClick={toggleInfoModal}
      >
        Fermer
      </button>
    </Modal>
  );
}

function TableHeader({}) {
  return (
    <Header>
      <Th options="rounded-tl-2xl px-1">Numéro d'inscription</Th>
      <Th>Nom complet</Th>
      <Th>CIN</Th>
      <Th>Téléphone</Th>
      <Th>Email</Th>
      <Th options={"rounded-tr-2xl"}>Actions</Th>
    </Header>
  );
}

function DeleteModal({ toggleDeleteModal, selectedId }) {
  const [show, setShow] = useState(true);
  const { activeClasse, skip, asc } = useSelector((state) => ({
    ...state.ListeEtudiantReducer,
  }));
  const dispatch = useDispatch();
  const deleteStudent = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await fetch(`http://localhost:5001/etudiant/${selectedId}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  const deleteMutation = useMutation(deleteStudent, {
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
      dispatch(getTotalEtudiant(activeClasse, asc));
      dispatch(getEtudiant(activeClasse, asc, skip));
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
            Vouler vraiment supprimer cet étudiant ?
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
              <h1 className="text-xl">L'étudiant a été supprimé</h1>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Modal>
  );
}

export function FcFullTrash({}) {
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
      width="150"
      height="150"
      viewBox="0 0 48 48"
    >
      <motion.path
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          default: { duration: 0.5, ease: "easeInOut" },
          fill: { duration: 0.5, ease: [1, 0, 0.8, 1] },
        }}
        className="fill-[#ff8a65]"
        d="M24 21.3L12.7 10L26 1.7L38.3 10z"
      />
      <motion.path
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          default: { duration: 1, ease: "easeInOut" },
          fill: { duration: 1, ease: [1, 0, 0.8, 1] },
        }}
        className="fill-[#FFAB91]"
        d="M24 21.3L12.7 10L17 4.7L38.3 10z"
      />
      <motion.path
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          default: { duration: 1.5, ease: "easeInOut" },
          fill: { duration: 1.5, ease: [1, 0, 0.8, 1] },
        }}
        className="fill-[#B39DDB]"
        d="M30.6 44H17.4c-2 0-3.7-1.4-4-3.4L9 11h30l-4.5 29.6c-.3 2-2 3.4-3.9 3.4z"
      />
      <motion.path
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          default: { duration: 2, ease: "easeInOut" },
          fill: { duration: 2, ease: [1, 0, 0.8, 1] },
        }}
        className="fill-[#7E57C2]"
        d="M38 13H10c-1.1 0-2-.9-2-2s.9-2 2-2h28c1.1 0 2 .9 2 2s-.9 2-2 2z"
      />
    </motion.svg>
  );
}

function UpdateModal({ selectedId, toggleUpdateModal }) {
  const [etudiantData, setEtudiantData] = useState({
    numInscription: "",
    nomEtudiant: "",
    dateNaissance: "",
    numTel: "",
    cin: "",
    adresse: "",
    asc: "",
    email: "",
  });
  const [show, setShow] = useState(false);
  const [updateShow, setupdateShow] = useState(true);

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

  const [image, setImage] = useState("");
  const [classeId, setClasseId] = useState("");
  const [nomClasse, setNomClasse] = useState("");

  const getInfoQuery = useGetInfoQuery({ selectedId });

  const toggleShow = () => {
    setShow(!show);
  };
  const { activeClasse, skip, asc } = useSelector((state) => ({
    ...state.ListeEtudiantReducer,
  }));
  const dispatch = useDispatch();

  const getClasseValue = (e) => {
    setNomClasse(e.target.innerText);
    setClasseId(e.target.parentElement.parentElement.id);
    setShow(!show);
  };

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
      setImage(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUpdate = async () => {
    const newData = {
      ...etudiantData,
      image: image,
      classeId: classeId,
    };
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await fetch(`http://localhost:5001/etudiant/${selectedId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    }).then((res) => res.json());
  };

  const updateMutation = useMutation(fetchUpdate);

  const handleUpdate = () => {
    setupdateShow(!updateShow);
    updateMutation.mutate();
  };

  useEffect(() => {
    if (selectedId !== "") {
      getInfoQuery.refetch();
    }
  }, []);

  useEffect(() => {
    if (getInfoQuery.data) {
      setEtudiantData({
        numInscription: getInfoQuery.data[0].numInscription,
        nomEtudiant: getInfoQuery.data[0].nomEtudiant,
        dateNaissance: getInfoQuery.data[0].dateNaissance,
        numTel: getInfoQuery.data[0].numTel,
        cin: getInfoQuery.data[0].cin,
        adresse: getInfoQuery.data[0].adresse,
        asc: getInfoQuery.data[0].asc,
        email: getInfoQuery.data[0].email,
      });
      setImage(getInfoQuery.data[0].image);
      setClasseId(getInfoQuery.data[0].classeId);
      setNomClasse(getInfoQuery.data[0].classe.nomClasse);
    }
  }, [getInfoQuery.isFetching, getInfoQuery.isRefetching]);

  useEffect(() => {
    if (updateMutation.isSuccess) {
      dispatch(getTotalEtudiant(activeClasse, asc));
      dispatch(getEtudiant(activeClasse, asc, skip));
      setTimeout(() => {
        toggleUpdateModal();
      }, 1500);
    }
  }, [updateMutation.isSuccess]);

  return (
    <Modal
      closeModal={toggleUpdateModal}
      options={`${
        updateShow ? "w-[1064px]" : "w-[520px] flex items-center"
      }  h-max`}
    >
      {updateShow && (
        <div className="update-form">
          <h1 className="text-center font-medium text-2xl ">
            Modifier un étudiant
          </h1>

          <div className="image  relative overflow-hidden  w-48 h-48 rounded-full border  flex items-center justify-center text-white bg-slate-800 mx-auto my-2">
            <img
              className="w-full h-full object-cover"
              src={`http://localhost:5001${image}`}
            />

            <input
              type="file"
              onChange={uploadFileHandler}
              className="w-full h-full opacity-0 absolute cursor-pointer"
            />
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap pt-3"
          >
            <div className="flex items-center pl-2">
              <p>Classe : </p>
              <div className="w-max relative flex">
                <div
                  className="w-max px-10 h-max  bg-slate-200 dark:bg-slate-700 py-2  rounded mt-2 ml-1 mr-1"
                  onClick={toggleShow}
                >
                  {nomClasse}
                </div>

                {show && (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className=" my-2 w-max flex "
                  >
                    {classes.map((classe) => (
                      <motion.div
                        key={classe.id}
                        id={classe.id}
                        variants={item}
                        onClick={getClasseValue}
                      >
                        <DropdownItem options="dark:bg-slate-700 mr-1">
                          <span>{classe.nomClasse}</span>
                        </DropdownItem>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {Object.entries(etudiantData).map(([key, value]) => (
              <InputGroup
                key={key}
                label={key}
                type="text"
                name={key}
                myItem={item}
                state={etudiantData}
                setState={setEtudiantData}
              />
            ))}
          </motion.div>
          <div className="flex justify-center space-x-4 mt-10">
            <button
              onClick={handleUpdate}
              className="info py-2 px-8 text-lg rounded-md"
            >
              Modifier
            </button>
            <button
              className="default py-2 px-8 text-lg rounded-md"
              onClick={toggleUpdateModal}
            >
              Annuler
            </button>
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
            className="loading-update w-full h-full flex flex-col items-center justify-center"
          >
            <Loader />
            <h1 className="text-xl mt-6">Mise à jour en cours ...</h1>
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
              <h1 className="text-xl">Mise è jour effectuée</h1>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Modal>
  );
}

function InputGroup({ label, state, setState, name, type, myItem }) {
  switch (label) {
    case "numInscription":
      label = "Numero d'inscription";

      break;
    case "cin":
      label = "Numero de CIN";
      type = "number";
      break;
    case "numTel":
      label = "Numero de telephone";

      break;
    case "adresse":
      label = "Adresse";
      break;
    case "nomEtudiant":
      label = "Nom complet";
      break;
    case "dateNaissance":
      label = "Date de naissance";
      type = "date";
      break;
    case "asc":
      label = "Année scolaire";
      break;
    case "email":
      label = "Email";
      break;
  }
  return (
    <motion.div
      variants={myItem}
      className="flex space-x-5 ml-2 my-2 items-center justify-center"
    >
      <label htmlFor={label}>{label} : </label>
      <input
        value={
          name === "dateNaissance" ? formatedDate(state[name]) : state[name]
        }
        onChange={(e) => setState({ ...state, [name]: e.target.value })}
        className="bg-transparent rounded outline-none border ringo-0
                           border-gray-400 dark:border-gray-500 w-[250px] h-[40px] px-2 text-lg"
        type={type}
        name={name}
      />
    </motion.div>
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
