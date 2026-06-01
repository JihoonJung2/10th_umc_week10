import { StatusCodes } from "http-status-codes";
import { createStore } from "../services/store.services.js";
import { AddStoreRequestDTO, StoreResponseDTO } from "../dtos/store.dtos.js";
import { Body, Path, Post, Route, Tags, SuccessResponse } from "tsoa";
import { ApiResponse, success } from "../../../common/responses/response.js";



@Route("region")
@Tags("Stores")
export class StoreController {


@Post("{regionId}/stores")
  @SuccessResponse(StatusCodes.CREATED, "Created")
  public async addStore(
    @Path() regionId: number, 
    @Body() storeData: AddStoreRequestDTO 
  ):Promise<ApiResponse<StoreResponseDTO >> {
  
    const newStore = await createStore(regionId, storeData);
    
   
    return success(newStore);
  }
}
