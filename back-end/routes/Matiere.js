import { Router } from "express";
import { 
    getMatiereByClassByParcours,
    createMatiereByClassByParcours,
    updateMatiereByClassByParcours,
    deleteMatiere

} from "../controllers/matiere.controller.js";

const router = Router();

router
    .route("/")
    .post(createMatiereByClassByParcours)
router
    .route('/:id')
    .get(getMatiereByClassByParcours)
    .put(updateMatiereByClassByParcours)
    .delete(deleteMatiere)

export default router;
