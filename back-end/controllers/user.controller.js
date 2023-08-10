import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import asyncHandler from "../middleware/async";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";

export const createUser = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.create({
    data: {
      pseudo: req.body.pseudo,
      password: bcrypt.hashSync(req.body.password, 10),
      role: "admin",
    },
  });

  res.status(200).json(user);
});

const matchPassword = async (enteredPassword, password) => {
  return await bcrypt.compare(enteredPassword, password);
};

export const authUser = asyncHandler(async (req, res, next) => {
  const { pseudo, password } = req.body;
  // console.log(pseudo)
  const user = await prisma.user.findUnique({
    where: {
      pseudo,
    },
  });
  if (user) {
    const userId = await prisma.etudiant.findUnique({
      select: {
        id: true,
      },
      where: {
        userId: user.id,
      },
    });

    if (await matchPassword(password, user.password)) {
      res.status(200).json({
        success: true,
        id: userId ? userId.id : user.id,
        pseudo: user.pseudo,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Mot de passe incorrect",
        field: "password",
      });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: "Pseudo introuvable", field: "pseudo" });
  }
});

export const registerUser = asyncHandler(async (req, res, next) => {
  const { pseudo, password, numInscription } = req.body;
  const findNumInscription = await prisma.etudiant.findUnique({
    select: {
      numInscription: true,
      nomEtudiant: true,
      userId: true,
      classe: {
        select: {
          nomClasse: true,
        },
      },
      user: {
        select: {
          password: true,
        },
      },
    },
    where: {
      numInscription,
    },
  });

  if (findNumInscription) {
    if (findNumInscription.user.password === null) {
      const findPseudo = await prisma.user.findUnique({
        where: {
          pseudo: pseudo,
        },
      });
      if (findPseudo) {
        return res.status(401).json({
          success: false,
          message: "Cet pseudo éxiste déja, choisisser un autre",
          field: "pseudo",
        });
      } else {
        const user = await prisma.user.update({
          data: {
            pseudo,
            password: bcrypt.hashSync(password, 10),
          },
          where: {
            id: findNumInscription.userId,
          },
        });

        res
          .status(200)
          .json({ success: true, message: "Compte created", user });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Cet étudiant à déja un compte" });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Cet étudiant n'éxiste pas",
      field: "numInscription",
    });
  }
});

export const checkUserAccount = asyncHandler(async (req, res, next) => {
  const { numInscription } = req.body;
  const etudiant = await prisma.etudiant.findUnique({
    select: {
      userId: true,
      user: {
        select: {
          password: true,
        },
      },
    },
    where: {
      numInscription,
    },
  });

  if (etudiant) {
    if (etudiant.user.password === null) {
      return res.status(200).json({ success: true, etudiant });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Vous avez déjà un compte" });
    }
  }
  return res
    .status(400)
    .json({ success: false, message: "Numéro d'inscription introuvable" });
});

export const verifyUser = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await prisma.user.findUnique({
        select: {
          id: true,
        },
        where: {
          id: decoded.id,
        },
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(401).json({ success: false, message: "Not Authorized" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized" });
  }
});

export const changePseudo = asyncHandler(async (req, res, next) => {
  const user = await prisma.etudiant.findUnique({
    select: {
      userId: true,
      user: {
        select: {
          id: true,
          pseudo: true,
        },
      },
    },
    where: {
      id: req.body.id,
    },
  });

  if (user) {
    const pseudo = user.user.pseudo;
    if (pseudo === req.body.pseudo) {
      return res.status(200).json({
        success: true,
        message: "Vous pouvez changer votre pseudo",
        id: user.userId,
      });
    }
    return res
      .status(400)
      .json({ success: false, message: "Ce n'est pas votre pseudo" });
  }
  return res
    .status(400)
    .json({ success: false, message: "Pseudo Introuvable" });
});

export const updatePseudo = asyncHandler(async (req, res, next) => {
  const pseudo = await prisma.user.update({
    data: {
      pseudo: req.body.pseudo,
    },
    where: {
      id: req.body.id,
    },
  });

  res.status(200).json({ success: true });
});

export const verifyPassword = asyncHandler(async (req, res, next) => {
  const { password, userId } = req.body;
  const user = await prisma.etudiant.findUnique({
    select: {
      userId: true,
      user: {
        select: {
          id: true,
          password: true,
        },
      },
    },
    where: {
      id: userId,
    },
  });
  if (user) {
    if (await matchPassword(password, user.user.password)) {
      return res.status(200).json({ success: true, id: user.user.id });
    }
    return res
      .status(400)
      .json({ success: false, message: "Mot de passe incorrect" });
  }
  return res
    .status(400)
    .json({ success: false, message: "Etudiant introuvable" });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.update({
    data: {
      password: bcrypt.hashSync(req.body.password, 10),
    },
    where: {
      id: req.body.id,
    },
  });

  res.status(200).json({ success: true });
});
