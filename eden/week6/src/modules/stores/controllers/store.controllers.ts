import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { createStore } from "../services/store.services.js";
import { AddStoreRequestDTO } from "../dtos/store.dtos.js";

export const handleAddStore = async (req: Request, res: Response, next: NextFunction) => {
  
  const regionId = Number(req.params.regionId);
  const storeData: AddStoreRequestDTO = req.body;

 
  if (isNaN(regionId) || regionId <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      message: "유효한 지역 ID(양수)가 필요합니다." 
    });
  }

  try {
   
    const newStore = await createStore(regionId, storeData);
    
   
    return res.status(StatusCodes.CREATED).json({ result: newStore });
  } catch (err) {
  
    next(err); 
  }
};