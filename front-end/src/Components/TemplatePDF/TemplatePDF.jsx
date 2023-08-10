import React, { useState } from "react";
import Logo from "../Logo/Logo";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { v4 as uuidv4 } from "uuid";

const calculerMoyenne = (notes, semestre) => {
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

const calculMoyenneGenerale = (notes) => {
  const sum = notes
    .map(
      (note) =>
        (note.noteValue !== null ? note.noteValue : 0) * note.matiere.coef
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const coefSum = notes.reduce(
    (accumulator, note) => accumulator + note.matiere.coef,
    0
  );

  const average = sum / coefSum;

  return average.toFixed(2);
};

const TemplatePDF = ({ id }) => {
  const { asc } = useSelector((state) => ({
    ...state.ListeNoteReducer,
  }));

  const query = useGetQuery({ id, asc });

  const mentionValue = (x) => {
    if (x >= 0 && x < 10) return "Médiocre";
    else if (x >= 10 && x < 12) return "Passable";
    else if (x >= 12 && x < 14) return "Assez bien";
    else if (x >= 14 && x < 16) return "Bien";
    else if (x >= 16 && x < 18) return "Très Bien";
    else if (x >= 18 && x < 20) return "Excellent";
  };

  return (
    <div className="p-4 shadow-md print:shadow-none w-[21cm] print:w-full h-11/12 print:h-full  mx-auto print:mx-0 my-8 print:my-0 print:bg-white bg-slate-50 dark:bg-slate-900">
      <header>
        <div className="flex">
          <div className="w-[30%] h-max py-2 flex items-center space-x-2">
            <div className="w-12 h-12 text-center">
              <Logo />
            </div>
            <div>
              <p className="text-xl">
                <span className="font-bold">M</span>assachusetts
              </p>
              <p className="text-xl">
                <span className="font-bold">I</span>nstitute of
              </p>
              <p className="text-xl">
                <span className="font-bold">T</span>echnology
              </p>
            </div>
          </div>
          <div className="w-[50%] ">
            <h1 className="text-xl font-bold text-center">RELEVE DE NOTE</h1>
            <p className="text-center">Année scolaire : 2022-2023</p>
          </div>
        </div>

        <div className="pl-12">
          <p>
            Nom complet :{" "}
            {query.isLoading || query.isRefetching ? (
              <Skeleton width={250} height={19} />
            ) : query.data?.success ? (
              query.data?.data.nomEtudiant
            ) : (
              "ERREUR"
            )}
          </p>
          <p>
            Numéro d'inscription:{" "}
            <span className="font-bold">
              {query.isLoading || query.isRefetching ? (
                <Skeleton width={250} height={19} />
              ) : query.data?.success ? (
                query.data?.data.numInscription
              ) : (
                "ERREUR"
              )}
            </span>
          </p>
          <p>
            Classe:{" "}
            <span className="font-bold">
              {query.isLoading || query.isRefetching ? (
                <Skeleton width={50} height={19} />
              ) : query.data?.success ? (
                query.data?.data.classe.nomClasse
              ) : (
                "ERREUR"
              )}
            </span>
          </p>
        </div>
      </header>
      <Semestre title={"SEMESTRE 1"} id={id} sem="1" />
      <Semestre title={"SEMESTRE 2"} id={id} sem="2" />

      <div className="border mx-4 text-center mt-1 border-gray-800 bg-gray-500 text-slate-50 text-xl">
        NOTE GENERALE
      </div>
      <div className="border border-t-0 mx-4 text-center mt-0 py-2 border-gray-800 text-sm">
        <p className="">
          {" "}
          <span className="font-bold">Moyenne générale</span> :
          {query.isLoading ? (
            <Skeleton width={50} height={19} />
          ) : (
            query.data.success &&
            `${calculMoyenneGenerale(query.data.data.notes)}/20`
          )}
        </p>{" "}
        <p className="">
          {" "}
          <span className="font-bold">Obervation</span> :
          {query.isLoading ? (
            <Skeleton width={50} height={19} />
          ) : query.data.success &&
            calculMoyenneGenerale(query.data.data.notes) >= 10 ? (
            "Admis"
          ) : (
            "Non Admis"
          )}
        </p>{" "}
        <p>
          {" "}
          <span className="font-bold">Mention</span> :
          {query.isLoading ? (
            <Skeleton width={50} height={19} />
          ) : (
            query.data.success &&
            mentionValue(calculMoyenneGenerale(query.data.data.notes))
          )}
        </p>
      </div>
    </div>
  );
};

export default TemplatePDF;

function Semestre({ title, id, sem }) {
  const { asc } = useSelector((state) => ({
    ...state.ListeNoteReducer,
  }));
  const query = useGetQuery({ id, asc });
  const tab = [1, 2, 3, 4, 6, 7, 8, 9, 10];

  return (
    <section>
      <div className="border mx-4 text-center mt-5 border-gray-800 bg-gray-500 text-slate-50 text-xl">
        {title}
      </div>
      <div className="border print:text-sm border-gray-900  mx-4 border-t-0 px-3 py-2 h-max">
        <div className="w-full flex  border-b border-dashed border-gray-800 pb-2">
          <div className="w-[90%] font-bold flex">
            <p className="w-[70%]">Matière</p>
            <p className="w-[15%] text-center">Code</p>
            <p className="w-[15%] text-center">Coefficient</p>
          </div>
          <p className="w-[10%] font-bold text-center ">Note</p>
        </div>

        {query.isLoading
          ? tab.map((i) => <SemestreItemSkeleton key={uuidv4()} />)
          : query.data.success &&
            query.data.data.notes.map(
              (note) =>
                note.semestre === sem && (
                  <SemestreItem
                    key={uuidv4()}
                    matiere={note.matiere.nomMatiere}
                    code={note.matiere.acronyme}
                    note={Number(note.noteValue)}
                    coef={note.matiere.coef}
                  />
                )
            )}

        <div className="w-full flex  border-b-0 border-dashed border-gray-800 pb-2">
          <div className="w-[90%] font-bold flex">
            <p className="w-[70%]">Résultats</p>
            <p className="w-[15%] text-center"></p>
            <p className="w-[15%] text-center">Moyenne:</p>
          </div>
          <p className="w-[10%] font-bold text-center ">
            {query.isLoading ? (
              <Skeleton height={19} width={50} />
            ) : (
              query.data.success &&
              `${calculerMoyenne(query.data?.data.notes, sem)}/20`
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function SemestreItem({ note, coef, matiere, code }) {
  return (
    <div className="w-full flex  border-b border-dashed border-gray-400 pb-2 my-2 print:my-0">
      <div className="w-[90%] flex">
        <p className="w-[70%] font-bold">{matiere}</p>
        <p className="w-[15%] text-center">{code}</p>
        <p className="w-[15%] text-center">{coef}</p>
      </div>
      <p className="w-[10%] font-bold text-center ">
        {note * coef} / {20 * coef}
      </p>
    </div>
  );
}

function SemestreItemSkeleton({}) {
  return (
    <div className="w-full flex  border-b border-dashed border-gray-400 pb-2 my-2 print:my-0">
      <div className="w-[90%] flex">
        <p className="w-[70%] font-bold">
          <Skeleton width={250} height={19} />
        </p>
        <p className="w-[15%] text-center">
          <Skeleton width={50} height={18} />
        </p>
        <p className="w-[15%] text-center">
          <Skeleton width={30} height={18} />
        </p>
      </div>
      <p className="w-[10%] font-bold text-center ">
        <Skeleton width={50} height={18} />
      </p>
    </div>
  );
}

function useGetQuery({ id, asc }) {
  const getEtudiant = async () => {
    return await fetch(
      `http://localhost:5001/note/etudiant/${id}/asc/${asc}`
    ).then((res) => res.json());
  };
  return useQuery(["releve", id], getEtudiant, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: () => {
      console.log("ERREUR");
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
  });
}
