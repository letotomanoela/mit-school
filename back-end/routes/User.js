import { Router } from "express";
import {
  createUser,
  authUser,
  registerUser,
  checkUserAccount,
  verifyUser,
  changePseudo,
  updatePseudo,
  verifyPassword,
  changePassword
} from "../controllers/user.controller";

const router = Router();

router.route("/").post(createUser);
router.route("/login").post(authUser);
router.route("/register").put(registerUser);
router.route("/checkUser").post(checkUserAccount);
router.route("/verifyUser").get(verifyUser);
router.route("/changePseudo").post(changePseudo);
router.route("/updatePseudo").put(updatePseudo);
router.route("/verifyPassword").post(verifyPassword);
router.route("/changePassword").put(changePassword)

export default router;
