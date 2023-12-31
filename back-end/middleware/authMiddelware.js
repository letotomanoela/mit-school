import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        select: {
          id: true,
        },
        where: {
          id: decoded.id,
        },
      });
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Not Authorized" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized" });
  }

  if (!token) {
    res.status(401);
  }
};

export { protect };
