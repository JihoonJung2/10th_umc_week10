import { AddStoreRequestDTO, responseFromStore } from "../dtos/store.dtos.js";
import {  addStore,  getStoreById} from "../repositories/store.repositories.js";

export const createStore = async (regionId: number, storeData: AddStoreRequestDTO) => {
  const { name, foodCategory } = storeData;

  
  const newStoreId = await addStore(regionId, { name, foodCategory });

 
  const newStore = await getStoreById(newStoreId);


  return responseFromStore(newStore);
};



