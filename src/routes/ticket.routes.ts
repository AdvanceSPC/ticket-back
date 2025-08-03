import { Router } from "express";
import { create, list, update } from "../controllers/hubspot.controller";

const router = Router();
router.post("/", create);
router.get("/", list);
router.patch("/:id", update);

export default router;
