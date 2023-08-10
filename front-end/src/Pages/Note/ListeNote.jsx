import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiSearchLine } from "react-icons/ri";
import { RxPencil1 } from "react-icons/rx";
import { CgFileDocument } from "react-icons/cg";
import {
  getMatiereByClass,
  getNotes,
  getTotalNotes,
  getTotalSearchNotes,
  searchNotes,
} from "../../redux/reducers/ListeNoteReducer";
import Header from "../../Components/Table/Header";
import Page404 from "../../Components/404/Page404";
import Tr from "../../Components/Table/Tr";
import Td from "../../Components/Table/Td";
import Th from "../../Components/Table/Th";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ThSkeleton from "../../Components/Skeleton/ThSkeleton";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import NoteSkeleton from "../../Components/Skeleton/NoteSkeketon";
import ClasseBtn from "../../Components/ClasseBtn/ClasseBtn";
import PaginationNote from "../../Components/Table/PaginationNote";
import Modal from "../../Components/Modal/Modal";
import Loader from "../../Components/Loader/Loader";
import Success from "../../Components/Loader/Success";
import { Link } from "react-router-dom";
import CircleLoader from "../../Components/CircleLoader/CircleLoader";
import { EmptyIcon } from "../Matieres";
import Img from "../../Components/Table/Img";

const ListeNote = () => {
  document.title = "Liste des notes"
  const dispatch = useDispatch();

  const tab = [1, 1, 1, 1, 1];
  const {
    activeClasse,
    listeMatiere,
    asc,
    listeNote,
    skip,
    pagination,
    semestre,
    color,
    isFetchingNote,
    error,
    errorMessage,
  } = useSelector((state) => ({
    ...state.SidebarReducer,
    ...state.ListeNoteReducer,
  }));

  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [animateInput, setAnimateInput] = useState(false);
  const [updateDataMap, setUpdateDataMap] = useState([]);
  const [listeNoteMap, setListeNoteMap] = useState([]);

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

  const changeSemestre = (e) => {
    dispatch({
      type: "CHANGE_SEMESTRE",
      payload: e.target.id,
    });
  };

  const searchFunc = (e) => {
    setVal(e.target.value);
  };

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const handleUpdate = (e) => {
    toggleModal();
    setSelectedId(e.target.parentElement.id);
  };
  const [selectedId, setSelectedId] = useState("");
  const [updateData, setUpdateData] = useState([]);

  const getUpdateData = () => {
    fetch(`http://localhost:5001/note/etudiant/${selectedId}/asc/${asc}`)
      .then((response) => response.json())
      .then((json) => {
        setUpdateData([...json.data.notes]);
        // console.log(json)
      });
  };

  const updateNotes = async () => {
    await fetch(`http://localhost:5001/note`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setSuccess(true);
          setSelectedId("");
          setUpdateData([]);
        }
      });
  };

  const handleInputChange = (event, noteId) => {
    if (parseFloat(event.target.value) < 20) {
      const updatedUpdateData = updateData.map((note) => {
        if (note.id === noteId) {
          return { ...note, noteValue: parseFloat(event.target.value) };
        }
        return note;
      });

      setUpdateData(updatedUpdateData);
    }
  };

  const handleUpdateClick = () => {
    setLoading(true);
  };
  const calculerMoyenne = (notes) => {
    const filteredNotes = notes.filter((note) => note.semestre === semestre);

    const sum = filteredNotes
      .map(
        (note) =>
          (note.noteValue !== null ? note.noteValue : 0) * note.matiere.coef
      )
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const coefSum = filteredNotes.reduce(
      (accumulator, note) => accumulator + note.matiere.coef,
      0
    );

    const average = sum / coefSum;

    return average.toFixed(2);
  };

  useEffect(() => {
    dispatch({
      type: "CHANGE_ACTIVE_NAV",
      payload: "liste-note",
    });
  }, []);

  useEffect(() => {
    if (val !== "") {
      dispatch(searchNotes(activeClasse, asc, skip, val));
      dispatch(getTotalSearchNotes(activeClasse, asc, val));
    } else {
      dispatch(getMatiereByClass(activeClasse));
      dispatch(getNotes(activeClasse, asc, skip));
      dispatch(getTotalNotes(activeClasse, asc));
    }
  }, [activeClasse, semestre, success]);

  useEffect(() => {
    if (val === "") {
      dispatch(getTotalNotes(activeClasse, asc));
      dispatch(getNotes(activeClasse, asc, skip));
    } else {
      dispatch(searchNotes(activeClasse, asc, skip, val));
      dispatch(getTotalSearchNotes(activeClasse, asc, val));
      dispatch({
        type: "CHANGE_SKIP_NOTE",
        payload: 1,
      });
    }
  }, [val]);

  useEffect(() => {
    if (selectedId !== "") {
      getUpdateData();
    }
  }, [selectedId]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        updateNotes();
      }, 1500);
    }
  }, [loading]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
        toggleModal();
      }, 2000);
    }
  }, [success]);
  useEffect(() => {
    if (updateData.length !== 0) {
      const updatedMap = updateData.map(
        (note) =>
          note.semestre === semestre && (
            <div
              key={note.id}
              className="flex space-x-5 ml-2 my-2 items-center justify-center"
            >
              <label htmlFor={`${note.matiere.nomMatiere}`}>
                {note.matiere.acronyme}({note.matiere.nomMatiere}) (
                {note.matiere.coef})
              </label>
              <input
                id={note.id}
                value={
                  note.noteValue === null ? "" : parseFloat(note.noteValue)
                }
                onChange={(event) => handleInputChange(event, note.id)}
                className="bg-transparent rounded outline-none border ringo-0
                           border-gray-400 dark:border-gray-500 w-[150px] h-[40px] px-2 text-lg"
                type="number"
              />
            </div>
          )
      );

      setUpdateDataMap(updatedMap);
    }
  }, [updateData, semestre]);

  return (
    <>
      <p className="text-xl my-4">Liste des notes</p>
      {isFetchingNote && (
        <div className="w-12 h-12 mx-auto">
          <CircleLoader rayon={20} options="w-[48px]" />
        </div>
      )}

      <div className="my-3 flex justify-between w-full">
        <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
          {classes.map((classe) => (
            <ClasseBtn
              activeClasse={activeClasse}
              key={uuidv4()}
              id={classe.id}
              text={classe.nomClasse}
            />
          ))}
        </div>
        <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900  dark:border-gray-700 dark:divide-gray-700">
          <button
            id="1"
            onClick={changeSemestre}
            className={`px-5 py-2 text-xs font-medium  transition-colors duration-200  sm:text-sm ${
              semestre === "1" && color + " text-white"
            } 0 dark:text-gray-300`}
          >
            SEMESTRE 1
          </button>
          <button
            id="2"
            onClick={changeSemestre}
            className={`px-5 py-2 text-xs font-medium  transition-colors duration-200  sm:text-sm ${
              semestre === "2" && color + " text-white"
            } 0 dark:text-gray-300`}
          >
            SEMESTRE 2
          </button>
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
          <EmptyIcon />
          <h1 className="text-3xl">Une erreur s'est produite</h1>
          <h2 className="text-lg">{errorMessage}</h2>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full">
            <Header>
              <Th options={"rounded-tl-2xl"}>Numero Inscription</Th>
              <Th>Nom complet</Th>

              {typeof listeMatiere === "string"
                ? ""
                : listeMatiere.length !== 0
                ? listeMatiere.map((matiere) => (
                    <Th key={uuidv4()} title={matiere.nomMatiere}>
                      {matiere.acronyme}
                    </Th>
                  ))
                : tab.map((t) => <ThSkeleton key={uuidv4()} />)}
              <Th>Moyenne</Th>
              <Th options={"rounded-tr-2xl"}>Actions</Th>
            </Header>
            <tbody
              className={
                typeof listeNote === "string"
                  ? "relative h-[400px] w-full "
                  : ""
              }
            >
              {typeof listeNote === "string" ? (
                <Page404 search={val} setVal={setVal} />
              ) : listeNote.length !== 0 ? (
                listeNote.map((etudiant) => (
                  <Tr key={uuidv4()}>
                    <Td classFlex="flex items-center space-x-2">
                      <Img  image={etudiant.image}/>
                      <span>{etudiant.numInscription}</span>
                      </Td>
                    <Td>{etudiant.nomEtudiant}</Td>
                    {etudiant.notes.map(
                      (note) =>
                        note.semestre === semestre && (
                          <Td key={uuidv4()} id={note.id}>
                            {note.noteValue === null ? "NULL" : note.noteValue}
                          </Td>
                        )
                    )}
                    <Td>{calculerMoyenne(etudiant.notes)}</Td>
                    <Td>
                      <div className="flex space-x-2">
                        <span
                          className={`cursor-pointer ${
                            isFetchingNote &&
                            " pointer-events-none cursor-not-allowed"
                          }`}
                          onClick={handleUpdate}
                          id={etudiant.id}
                        >
                          <RxPencil1 size={"24px"} />
                        </span>
                        <Link to={`/note/releve-de-note/${etudiant.id}`}>
                          <span className="cursor-pointer" id={etudiant.id}>
                            <CgFileDocument size={"24px"} />
                          </span>
                        </Link>
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : (
                [1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1].map((t) => (
                  <NoteSkeleton key={uuidv4()} />
                ))
              )}
            </tbody>
          </table>
          <div className="w-full flex justify-center mb-5">
            {pagination > 1 && <PaginationNote />}
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <Modal closeModal={toggleModal} options={"w-[700px] min-h-[500px]"}>
            {!loading ? (
              <>
                <h2 className="text-xl font-bold ">Modifier les notes</h2>
                <div className="flex flex-wrap">
                  {updateData.length === 0
                    ? listeMatiere.map((matiere) => (
                        <div
                          key={uuidv4()}
                          className="flex space-x-5 ml-2 my-2 items-center justify-center"
                        >
                          <label htmlFor={`${matiere.nomMatiere}`}>
                            {matiere.acronyme}({matiere.nomMatiere})
                          </label>
                          {updateData.length === 0 && (
                            <Skeleton width={150} height={40} />
                          )}
                        </div>
                      ))
                    : updateDataMap}
                </div>
                <div className="btns-container flex justify-center space-x-11 mt-5">
                  <button
                    onClick={handleUpdateClick}
                    className="info w-[150px] h-[40px] rounded-md"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={toggleModal}
                    className="danger  w-[150px] h-[40px] rounded-md "
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : success ? (
              <Success />
            ) : (
              <div className="w-full min-h-[500px] flex flex-col space-y-5 justify-center items-center">
                <Loader />
                <p>Mise à jour en cours ...</p>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ListeNote;
