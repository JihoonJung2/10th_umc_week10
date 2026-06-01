import { Router } from "express";
import { handleAddStore } from "./controllers/store.controllers.js";

const storesRouter = Router();


storesRouter.post("/region/:regionId/stores", handleAddStore);


export default storesRouter;