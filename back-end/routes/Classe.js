import {
  createClasse,
  getClasse,
  updateClasse,
  deleteClasse,
  getClassesByParcours,
} from "../controllers/classe.controller";
import { Router } from "express";
import { protect } from "../middleware/authMiddelware";
const router = Router();

router.route("/").get(protect,getClasse).post(createClasse);
router.route("/:id").delete(deleteClasse).put(updateClasse);
router.route("/parcours/:name").get(getClassesByParcours);


export default router;
