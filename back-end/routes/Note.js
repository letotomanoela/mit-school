import {
  getNoteEtudiantWithMatiereByAsc,
  updateNotes,
  searchNoteEtudiant,
  getNoteByMatiere,
  researchNotes,
  totalSearchNotes
  
} from "../controllers/note.controller.js";
import { Router } from "express";

const router = Router();

router.route("/").put(updateNotes);
router.route("/asc/:asc/classe/:classe/skip=:skip").get(getNoteEtudiantWithMatiereByAsc);
router.route("/etudiant/:id/asc/:asc").get(searchNoteEtudiant);
router.route("/matiere/:id/asc/:asc").get(getNoteByMatiere);
router.route("/research=:value/asc=:asc/classe=:classe/skip=:skip").get(researchNotes)
router.route("/total/research=:value/asc=:asc/classe=:classe").get(totalSearchNotes)

export default router;
