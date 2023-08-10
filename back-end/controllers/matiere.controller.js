import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { isEmpty } from "../utils/isEmpty.js";
import asyncHandler from "../middleware/async.js";

export const getMatiereByClassByParcours = asyncHandler(
  async (req, res, next) => {
    const matiere = await prisma.matiere.findMany({
      where: {
        classeId: req.params.id,
      },
      orderBy: {
        nomMatiere: "asc",
      },
    });

    if (isEmpty(matiere)) {
      res.status(200).json({ success: false, data: "NOT FOUND" });
    } else {
      res.status(200).json({ success: true, data: matiere });
    }
  }
);

export const createMatiereByClassByParcours = asyncHandler(
  async (req, res, next) => {
    const matiere = await prisma.matiere.create({
      data: { ...req.body },
    });

    if (matiere) {
      const classeId = matiere.classeId;
      const matiereId = matiere.id;
      const etudiants = await prisma.etudiant.findMany({
        select: {
          id: true,
        },
        where: {
          classeId,
        },
      });
      if (!isEmpty(etudiants)) {
        // console.log(etudiants)
        let obj1 = {
          semestre: "",
          noteValue: null,
          etudiantId: "",
          matiereId: "",
        };
        let obj2 = {
          semestre: "",
          noteValue: null,
          etudiantId: "",
          matiereId: "",
        };
        const notes = [];
        etudiants.forEach((etudiant) => {
          obj1 = {
            semestre: "1",
            noteValue: null,
            etudiantId: etudiant.id,
            matiereId,
          };
          obj2 = {
            semestre: "2",
            noteValue: null,
            etudiantId: etudiant.id,
            matiereId,
          };

          notes.push(obj1);
          notes.push(obj2);
        });

        if (!isEmpty(notes)) {
          const addNotes = await prisma.note.createMany({
            data: notes,
          });
        }
      }
      res.status(200).json({ success: true, data: matiere });
    }
  }
);

export const updateMatiereByClassByParcours = asyncHandler(
  async (req, res, next) => {
    const matiere = await prisma.matiere.update({
      data: { ...req.body },
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ success: true, data: matiere });
  }
);

export const deleteMatiere = asyncHandler(async (req, res, next) => {
  const notes = await prisma.note.deleteMany({
    where: {
      matiereId: req.params.id,
    },
  });

  const matiere = await prisma.matiere.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ success: true });
});
