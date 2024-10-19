import { Router } from "express";
import { getRooms } from "../Controllers/room.controller.js";

const router = Router();

router.post("/getRooms", getRooms);

export default router;
