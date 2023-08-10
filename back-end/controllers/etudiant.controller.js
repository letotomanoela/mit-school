import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from "uuid";
import { isEmpty } from "../utils/isEmpty.js";
import asyncHandler from "../middleware/async.js";

export const getEtudiantByClassInASC = asyncHandler(async (req, res, next) => {
  const etudiant = await prisma.etudiant.findMany({
    skip: Number(req.params.skip),
    take: 10,
    select: {
      id: true,
      numInscription: true,
      nomEtudiant: true,
      dateNaissance: true,
      numTel: true,
      cin: true,
      adresse: true,
      asc: true,
      email: true,
      image: true,
      classeId: true,
      classe: {
        select: {
          nomClasse: true,
        },
      },
      userId: true,
    },
    where: {
      classeId: req.params.classe,
      asc: req.params.asc,
    },
  });
  if (isEmpty(etudiant)) {
    return res.status(200).json({ success: false, etudiant: "NOT FOUND" });
  }
  res.status(200).json({ success: true, etudiant });
});

export const createEtudiant = asyncHandler(async (req, res, next) => {
  // console.log(req.body)
  const user = await prisma.user.create({
    data: {
      pseudo: uuidv4(),
      password: null,
    },
  });

  if (user) {
    const userId = user.id;
    const etudiant = await prisma.etudiant.create({
      data: { ...req.body, userId },
    });

    if (etudiant) {
      const classeId = req.body.classeId;
      const etudiantId = etudiant.id;
      const matiere = await prisma.matiere.findMany({
        select: {
          id: true,
        },
        where: {
          classeId: classeId,
        },
      });

      if (matiere.length !== 0) {
        // console.log(matiere,etudiantId,classeId)
        const tabNotes = [];
        let singleNote = {};
        let singleNote2 = {};

        matiere.forEach((mat) => {
          singleNote = {
            semestre: "1",
            noteValue: null,
            etudiantId,
            matiereId: mat.id,
          };
          singleNote2 = {
            semestre: "2",
            noteValue: null,
            etudiantId,
            matiereId: mat.id,
          };

          // console.log(singleNote);

          tabNotes.push(singleNote);
          tabNotes.push(singleNote2);
        });

        const notes = await prisma.note.createMany({
          data: tabNotes,
        });

        res.status(200).json({ success: true });
      }
    }
  }
});

export const getSingleEtudiant = asyncHandler(async (req, res, next) => {
  const etudiant = await prisma.etudiant.findMany({
    select: {
      id: true,
      numInscription: true,
      nomEtudiant: true,
      dateNaissance: true,
      numTel: true,
      cin: true,
      adresse: true,
      asc: true,
      email: true,
      image: true,
      classeId: true,
      classe: {
        select: {
          nomClasse: true,
        },
      },
      userId: true,
    },
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(etudiant);
});

export const updateEtudiant = asyncHandler(async (req, res, next) => {
  const etudiant = await prisma.etudiant.update({
    data: {
      ...req.body,
    },
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ success: true, data: etudiant });
});

export const searchEtudiantByASC = asyncHandler(async (req, res, next) => {
  const etudiant = await prisma.etudiant.findMany({
    skip: Number(req.params.skip),
    take: 10,
    select: {
      id: true,
      numInscription: true,
      nomEtudiant: true,
      dateNaissance: true,
      numTel: true,
      cin: true,
      adresse: true,
      asc: true,
      email: true,
      image: true,
      classeId: true,
      classe: {
        select: {
          nomClasse: true,
        },
      },
      userId: true,
    },
    where: {
      OR: [
        { numInscription: { contains: req.params.value, mode: "insensitive" } },
        { nomEtudiant: { contains: req.params.value, mode: "insensitive" } },
        { cin: { contains: req.params.value, mode: "insensitive" } },
        { numTel: { contains: req.params.value, mode: "insensitive" } },
        { email: { contains: req.params.value, mode: "insensitive" } },
      ],
      asc: req.params.asc,
      classeId: req.params.classe,
    },
  });

  if (isEmpty(etudiant))
    return res.status(200).json({ success: false, etudiant: "NOT FOUND" });

  res.status(200).json({ success: true, etudiant });
});

export const total = asyncHandler(async (req, res, next) => {
  const count = await prisma.etudiant.count();
  res.status(200).json({ count });
});

export const totalASC = asyncHandler(async (req, res, next) => {
  const count = await prisma.etudiant.count({
    where: {
      asc: req.params.asc,
    },
  });
  res.status(200).json({ count });
});

export const totalClasseASC = asyncHandler(async (req, res, next) => {
  try {
    const count = await prisma.etudiant.count({
      where: {
        asc: req.params.asc,
        classeId: req.params.classe,
      },
    });
    res.status(200).json({ count });
  } catch (error) {
    res.json({ error });
  }
});

export const deleteEtudiant = asyncHandler(async (req, res, next) => {
  try {
    const notes = await prisma.note.deleteMany({
      where: {
        etudiantId: req.params.id,
      },
    });
    const etudiant = await prisma.etudiant.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.json(error);
  }
});

export const totalSearchEtudiant = asyncHandler(async (req, res, next) => {
  const count = await prisma.etudiant.count({
    where: {
      OR: [
        { numInscription: { contains: req.params.value, mode: "insensitive" } },
        { nomEtudiant: { contains: req.params.value, mode: "insensitive" } },
        { cin: { contains: req.params.value, mode: "insensitive" } },
        { numTel: { contains: req.params.value, mode: "insensitive" } },
        { email: { contains: req.params.value, mode: "insensitive" } },
      ],
      asc: req.params.asc,
      classeId: req.params.classe,
    },
  });

  res.status(200).json({ success: true, count });
});
