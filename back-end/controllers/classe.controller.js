import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { isEmpty } from "../utils/isEmpty";
import asyncHandler from "../middleware/async";

export const getClasse = asyncHandler(async (req, res, next) => {
  const classe = await prisma.classe.findMany();
  if (isEmpty(classe)) {
    res.status(200).json({ data: "NOT FOUND" });
  } else {
    res.status(200).json({ success: true, data: classe });
  }
});
export const createClasse = asyncHandler(async (req, res, next) => {
  const classe = await prisma.classe.create({
    data: {
      ...req.body,
    },
  });
  res.status(200).json({ success: true, data: classe });
});
export const deleteClasse = asyncHandler(async (req, res, next) => {
  const classe = await prisma.classe.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ success: true });
});
export const updateClasse = asyncHandler(async (req, res, next) => {
  const classe = await prisma.classe.update({
    data: {
      ...req.body,
    },
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ success: true });
});

export const getClassesByParcours = asyncHandler(async (req, res, next) => {
  const classe = await prisma.classe.findMany({
    select: {
      id: true,
      nomClasse: true,
    }
  });
  if (isEmpty(classe)) {
    res.status(200).json({ data: "NOT FOUND" });
  } else {
    res.status(200).json({ data: classe });
  }
});
