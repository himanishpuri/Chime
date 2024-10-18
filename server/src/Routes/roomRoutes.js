import { Router } from "express";
import { getRooms } from "../Controllers/room.controller.js";

const router = Router();

router.get("/getRooms", getRooms);

export default router;
