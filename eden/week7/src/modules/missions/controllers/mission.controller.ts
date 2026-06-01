
import { StatusCodes } from "http-status-codes";
import { 
  completeMission, 
  createMission, 
  listStoreMissions, 
  listUserMissions, 
  startMissionChallenge 
} from "../services/mission.service";
import { AddMissionRequestDTO, handleUserMission, ListStoreMissionsResponse, responseFromMission } from "../dtos/mission.dto";
import { Body, Controller, Get, Patch, Path, Post, Route, Tags, SuccessResponse } from "tsoa";
import { AppError } from "../../../common/errors/app.error";
import { ApiResponse, success } from "../../../common/responses/response.js";

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {

  //특정 가게에 미션 추가 (POST /missions/stores/{storeId})
  @Post("stores/{storeId}")
  @SuccessResponse(StatusCodes.CREATED, "Created")
  public async addMission(
    @Path() storeId: number,
    @Body() missionData: AddMissionRequestDTO
  ): Promise<ApiResponse<{ newMissionId: number }>> {
     if (!storeId || Number.isNaN(storeId)) {
      throw new AppError(
        {
          errorCode: "INVALID_STORE_ID",
          message: "유효하지 않은 storeId 입니다.",
          statusCode: StatusCodes.BAD_REQUEST
        }
      );
    }
    const result = await createMission(storeId, missionData);
    this.setStatus(StatusCodes.CREATED);
    return success(result);
  }

  //특정 가게의 미션 목록 조회 (GET /missions/stores/{storeId})
  @Get("stores/{storeId}")
  public async listStoreMissions(
    @Path() storeId: number
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
    if (!storeId || Number.isNaN(storeId)) {
      throw new AppError(
        {
          errorCode: "INVALID_STORE_ID",
          message: "유효하지 않은 storeId 입니다.",
          statusCode: StatusCodes.BAD_REQUEST
        }
      );
    }
    const missions = await listStoreMissions(storeId);
    return success(missions);
  }

  // 유저가 미션에 도전 (POST missions/users/{userId}/{missionId})
  @Post("users/{userId}/{missionId}")
  @SuccessResponse(StatusCodes.CREATED, "Created")
  public async challengeMission(
    @Path() userId: number,
    @Path() missionId: number
  ): Promise<ApiResponse<{ newUserMissionId: number }>> {
    if (!userId || Number.isNaN(userId)) {
      throw new AppError(
        {
          errorCode: "INVALID_STORE_ID",
          message: "유효하지 않은 storeId 입니다.",
          statusCode: StatusCodes.BAD_REQUEST
        }
      );
    }
    if (!missionId || Number.isNaN(missionId)) {
      throw new AppError(
        {
          errorCode: "INVALID_MISSION_ID",
          message: "유효하지 않은 missionId 입니다.",
          statusCode: StatusCodes.BAD_REQUEST
        }
      );
    }
    const result = await startMissionChallenge(userId, missionId);
    this.setStatus(StatusCodes.CREATED);
    return success(result);
  }

  // 내가 진행중인 미션 목록 (GET /missions/users/{userId}/challenging)
  @Get("users/{userId}/challenging")
  public async listUserChallengingMissions(
    @Path() userId: number
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
    if (!userId || Number.isNaN(userId)) {
      throw new AppError(
        {
          errorCode: "INVALID_USER_ID",
          message: "유효하지 않은 userId 입니다.",
          statusCode: StatusCodes.BAD_REQUEST
        }
      );
    }
    const missions = await listUserMissions(userId);
    return success(missions);
  }

  // 진행중인 미션 완료 처리 (PATCH /missions/users/{userId}/{missionId})
  @Patch("users/{userId}/{missionId}")
  public async completeMission(
    @Path() userId: number,
    @Path() missionId: number
  ): Promise<ApiResponse<{ newUserMissionId: number }>> {
    if (!userId || Number.isNaN(userId)) {
      throw new AppError(
        {
          errorCode: "INVALID_USER_ID",
          message: "유효하지 않은 userId 입니다.",
          statusCode: StatusCodes.BAD_REQUEST
        }
      );
    }
    if (!missionId || Number.isNaN(missionId)) {
      throw new AppError(
        {
          errorCode: "INVALID_MISSION_ID",
          message: "유효하지 않은 missionId 입니다.",
          statusCode: StatusCodes.BAD_REQUEST
        }
      );
    }
    const result = await completeMission(userId, missionId);
    return success(result);
  }

  // 내가 완료한 미션 목록 (GET /missions/users/{userId}/completed)
  @Get("users/{userId}/completed")
  public async listUserCompletedMissions(
    @Path() userId: number
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
    if (!userId || Number.isNaN(userId)) {
      throw new AppError(
        {
          errorCode: "INVALID_USER_ID",
          message: "유효하지 않은 userId 입니다.",
          statusCode: StatusCodes.BAD_REQUEST
        }
      );
    }
    const missions = await listUserMissions(userId);
    return success(missions);
  }
}
