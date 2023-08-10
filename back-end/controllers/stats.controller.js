import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import asyncHandler from "../middleware/async";

export const totalNumber = asyncHandler(async (req, res, next) => {
  const etudiant = await prisma.etudiant.count();
  const matiere = await prisma.matiere.count();
  const classe = await prisma.classe.count();
  const notes = await prisma.note.count();
  const getAllMatiere = await prisma.matiere.findMany({
    select: {
      id: true,
      nomMatiere: true,
      acronyme:true,
      classe: {
        select: {
          nomClasse: true,
          
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
  const getClassesName = await prisma.classe.findMany();

  const etudiantParClasse = await prisma.etudiant.groupBy({
    by: ["classeId"],
    _count: true,
    orderBy: {
      classeId: "asc",
    },
  });

  const etudiantsParClasseAvecNom = [];

  for (let i = 0; i < etudiantParClasse.length; i++) {
    const classeId = etudiantParClasse[i].classeId;

    // Recherche du nom de classe correspondant à l'aide de l'identifiant de classe
    const classeNameObj = getClassesName.find((item) => item.id === classeId);
    const nomClasse = classeNameObj ? classeNameObj.nomClasse : "";

    const etudiantParClasseAvecNomObj = {
      classeId,
      nomClasse,
      _count: etudiantParClasse[i]._count,
    };

    etudiantsParClasseAvecNom.push(etudiantParClasseAvecNomObj);
  }

  const matiereParClasse = await prisma.matiere.groupBy({
    by: ["classeId"],
    _count: true,
  });

  const matiereParClasseAvecNom = [];

  for (let i = 0; i < matiereParClasse.length; i++) {
    const classeId = matiereParClasse[i].classeId;

    // Recherche du nom de classe correspondant à l'aide de l'identifiant de classe
    const classeNameObj = getClassesName.find((item) => item.id === classeId);
    const nomClasse = classeNameObj ? classeNameObj.nomClasse : "";

    const matiereParClasseAvecNomObj = {
      classeId,
      nomClasse,
      _count: matiereParClasse[i]._count,
    };

    matiereParClasseAvecNom.push(matiereParClasseAvecNomObj);
  }

  const etudiantMoyenneParMatiereParClasse = await prisma.note.groupBy({
    by: ["matiereId", "semestre"],
    _count: true,
    orderBy: {
      matiereId: "asc",
    },
    where: {
      noteValue: {
        gte: 10,
      },
    },
  });
  const informationsRegroupees = [];

  // Parcourir chaque élément du tableau etudiantMoyenneParMatiereParClasse
  etudiantMoyenneParMatiereParClasse.forEach((element) => {
    const matiereId = element.matiereId;
    const count = element._count;
    const semestre = element.semestre;

    // Rechercher la matière correspondante dans le tableau getAllMatiere
    const matiere = getAllMatiere.find((m) => m.id === matiereId);

    if (matiere) {
      const nomMatiere = matiere.nomMatiere;
      const acronyme = matiere.acronyme;
      const nomClasse = matiere.classe.nomClasse;

      // Ajouter les informations regroupées au nouveau tableau
      informationsRegroupees.push({
        _count: count,
        matiereId: matiereId,
        nomMatiere: nomMatiere,
        nomClasse: nomClasse,
        semestre: semestre,
        acronyme:acronyme
      });
    }
  });
  matiereParClasseAvecNom.sort((a, b) => {
    if (a.nomClasse < b.nomClasse) {
      return -1;
    }
    if (a.nomClasse > b.nomClasse) {
      return 1;
    }
    return 0;
  });

  res.status(200).json({
    success: true,
    etudiantMoyenneParMatiereParClasse: informationsRegroupees,
    etudiantsParClasseAvecNom,
    matiereParClasseAvecNom,
    etudiant,
    matiere,
    classe,
    notes,
  });
});
