import { Router } from "express";
import { totalNumber } from "../controllers/stats.controller";

const router = Router();

router.route("/generalStats").get(totalNumber);

export default router;
