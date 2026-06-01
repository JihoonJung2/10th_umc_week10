import { DuplicateUserStoreError } from "../../../common/errors/errors.js";
import { AddStoreRequestDTO, responseFromStore } from "../dtos/store.dtos.js";
import {  addStore,  getStoreById} from "../repositories/store.repositories.js";

export const createStore = async (regionId: number, storeData: AddStoreRequestDTO) => {
  const { name, foodCategory } = storeData;

  
  const newStoreId = await addStore(regionId, { name, foodCategory });

 if(newStoreId === null) {
    throw new DuplicateUserStoreError("이미 존재하는 가게입니다.");
  }
  const newStore = await getStoreById(newStoreId);


  return responseFromStore(newStore);
};



