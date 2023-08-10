import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import { isEmpty } from "../utils/isEmpty";
import asyncHandler from "../middleware/async";

export const getNoteEtudiantWithMatiereByAsc = asyncHandler(
  async (req, res, next) => {
    const notes = await prisma.etudiant.findMany({
      skip: Number(req.params.skip),

      take: 10,
      select: {
        numInscription: true,
        id: true,
        nomEtudiant: true,
        image: true,
        notes: {
          select: {
            id: true,
            noteValue: true,
            semestre: true,
            matiere: {
              select: {
                id: true,
                nomMatiere: true,
                coef: true,
              },
            },
          },
          orderBy: {
            matiere: {
              nomMatiere: "asc",
            },
          },
        },
        classeId: true,
        classe: {
          select: {
            nomClasse: true,
          },
        },
      },

      where: {
        asc: req.params.asc,
        classeId: req.params.classe,
      },
    });
    if (isEmpty(notes)) {
      res.status(200).json({ success: false, notes: "NOT FOUND" });
    } else {
      res.status(200).json({ success: true, notes });
    }
  }
);

export const createNote = asyncHandler(async (req, res, next) => {
  const note = await prisma.note.createMany({
    data: req.body,
  });

  res.status(200).json({
    success: true,
    data: note,
  });
});

export const searchNoteEtudiant = asyncHandler(async (req, res, next) => {
  console.log(req.params)
  const notes = await prisma.etudiant.findUnique({
    select: {
      numInscription: true,
      nomEtudiant: true,
      dateNaissance:true,
      cin:true,
      numTel:true,
      email:true,
      image:true,
      notes: {
        select: {
          id: true,
          noteValue: true,
          semestre: true,
          rattrapage: true,
          matiere: {
            select: {
              id: true,
              nomMatiere: true,
              coef: true,
              acronyme: true,
            },
          },
        },
        orderBy: {
          matiere: {
            nomMatiere: "asc",
          },
        },
      },
      classe: {
        select: {
          nomClasse: true,
        },
      },
    },

    where: {
      id: req.params.id,
    },
  });
  let success = true;
  let data = notes;
  if (notes.length === 0) {
    success = false;
    data = `L'étudiant dont le numInscription contient ${req.params.id} n'a pas des notes pendant l'année scolaire ${req.params.asc}`;
  }

  res.status(200).json({
    success,
    data,
  });
});

export const getNoteByMatiere = asyncHandler(async (req, res, next) => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      semestre: true,
      noteValue: true,
      rattrapage: true,

      etudiant: {
        select: {
          numInscription: true,
          nomEtudiant: true,
        },
      },
      matiere: {
        select: {
          nomMatiere: true,
        },
      },
    },
    where: {
      matiere: {
        nomMatiere: { contains: req.params.id },
      },
      etudiant: {
        asc: req.params.asc,
      },
    },
  });

  let success = true;
  let data = notes;
  if (notes.length === 0) {
    success = false;
    data = `Il n'y pas de notes sur le matière ${req.params.id}`;
  }

  res.status(200).json({
    success,
    data,
  });
});

export const getNoteByClasse = asyncHandler(async (req, res, next) => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      semestre: true,
      noteValue: true,
      rattrapage: true,
      matiere: {
        select: {
          nomMatiere: true,
        },
      },

      etudiant: {
        select: {
          numInscription: true,
          nomEtudiant: true,
          classe: {
            select: {
              nomClasse: true,
            },
          },
        },
      },
    },
    where: {
      etudiant: {
        classe: {
          id: req.params.value,
        },
      },
      matiere: {
        nomMatiere: req.params.matiere,
      },
    },
  });

  res.status(200).json({
    success: true,
    data: notes,
  });
});

const updateSingleNote = async (data) => {
  let note = await prisma.note.update({
    where: {
      id: data.id,
    },
    data: {
      noteValue: data.noteValue,
      rattrapage: data.rattrapage,
      semestre: data.semestre,
    },
  });
  return note;
};

export const updateNotes = asyncHandler((req, res, next) => {
  const tabNotes = req.body;
  tabNotes.forEach((singleNote) => {
    if (singleNote.noteValue !== null) {
      updateSingleNote(singleNote);
    }
  });
  res.status(200).json({ success: true });
});

export const researchNotes = asyncHandler(async (req, res, next) => {
  const notes = await prisma.etudiant.findMany({
    skip: Number(req.params.skip),

    take: 10,
    select: {
      numInscription: true,
      id: true,
      nomEtudiant: true,
      image: true,
      notes: {
        select: {
          id: true,
          noteValue: true,
          semestre: true,
          matiere: {
            select: {
              id: true,
              nomMatiere: true,
              coef: true,
            },
          },
        },
        orderBy: {
          matiere: {
            nomMatiere: "asc",
          },
        },
      },
      classeId: true,
      classe: {
        select: {
          nomClasse: true,
        },
      },
    },

    where: {
      OR: [
        {
          numInscription: { contains: req.params.value, mode: "insensitive" },
        },
        { nomEtudiant: { contains: req.params.value, mode: "insensitive" } },
      ],
      asc: req.params.asc,
      classeId: req.params.classe,
    },
  });
  if (isEmpty(notes)) {
    res.status(200).json({ success: false, notes: "NOT FOUND" });
  } else {
    res.status(200).json({ success: true, notes });
  }
});

export const totalSearchNotes = asyncHandler(async (req, res, next) => {

    const count = await prisma.etudiant.count({
      where: {
        OR: [
          {
            numInscription: { contains: req.params.value, mode: "insensitive" },
          },
          { nomEtudiant: { contains: req.params.value, mode: "insensitive" } },
        ],
        asc: req.params.asc,
        classeId: req.params.classe,
      },
    });

    res.status(200).json({ success: true, count });
 
});
