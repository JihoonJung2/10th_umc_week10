
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

import { ApiResponse, MissionErrorResponse, success } from "../../../common/responses/response.js";
import { Response } from "tsoa"; 

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {

  //특정 가게에 미션 추가 (POST /missions/stores/{storeId})
   /**
   * 특정 가게에 미션 추가
   * @summary 특정 가게에 미션을 추가하는 엔드포인트입니다.
   *  @param storeId 미션을 추가할 대상 가게의 고유 식별 번호 (ID)
   
   */
  @Post("stores/{storeId}")
  @SuccessResponse(StatusCodes.CREATED, "성공")

    @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
    @Response<MissionErrorResponse>(422, "잘못된 요청")
      @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async addMission(
   
    @Path() storeId: number,
    @Body() missionData: AddMissionRequestDTO
  ): Promise<ApiResponse<{ newMissionId: number }>> {
    
    const result = await createMission(storeId, missionData);
    this.setStatus(StatusCodes.CREATED);
    return success(result);
  }

  //특정 가게의 미션 목록 조회 (GET /missions/stores/{storeId})
   /**
   * 특정 가게에 미션 목록조회
   * @summary 특정 가게에 미션목록을 조회하는 엔드포인트입니다.
   * @param storeId 미션 목록을 조회할 대상 가게의 고유 식별 번호 (ID)
   
   */
  @Get("stores/{storeId}")
@SuccessResponse(StatusCodes.OK, "성공")

    @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
    @Response<MissionErrorResponse>(422, "잘못된 요청")
      @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async listStoreMissions(
    @Path() storeId: number
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
    const missions = await listStoreMissions(storeId);
    return success(missions);
  }

  // 유저가 미션에 도전 (POST missions/users/{userId}/{missionId})
   /**
   * 유저가 미션에 도전
   * @summary 유저가 미션에 도전하는 엔드포인트입니다.
   * @param userId 미션에 도전할 유저의 고유 식별 번호 (ID)
   * @param missionId 도전할 미션의 고유 식별 번호 (ID)
   
   */
  @Post("users/{userId}/{missionId}")
  @SuccessResponse(StatusCodes.CREATED, "성공")

    @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
    @Response<MissionErrorResponse>(422, "잘못된 요청")
      @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async challengeMission(
    @Path() userId: number,
    @Path() missionId: number
  ): Promise<ApiResponse<{ newUserMissionId: number }>> {
   
    const result = await startMissionChallenge(userId, missionId);
    this.setStatus(StatusCodes.CREATED);
    return success(result);
  }

  // 내가 진행중인 미션 목록 (GET /missions/users/{userId}/challenging)
   /**
   * 내가 진행중인 미션목록
   * @summary 내가 진행중인 미션목록을 조회하는 엔드포인트입니다.
   * @param userId 미션 목록을 조회할 유저의 고유 식별 번호 (ID)
   
   */
  @Get("users/{userId}/challenging")
    @SuccessResponse(StatusCodes.OK, "성공")

    @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
    @Response<MissionErrorResponse>(422, "잘못된 요청")
      @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async listUserChallengingMissions(
    @Path() userId: number
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
   
    const missions = await listUserMissions(userId);
    return success(missions);
  }

  // 진행중인 미션 완료 처리 (PATCH /missions/users/{userId}/{missionId})
   /**
   * 진행중인 미션 완료 처리
   * @summary 진행중인 미션을 완료 처리하는 엔드포인트입니다
   * @param userId 완료 처리할 미션에 도전한 유저의 고유 식별 번호 (ID)
   * @param missionId 완료 처리할 미션의 고유 식별 번호 (ID)
   
   */
  @Patch("users/{userId}/{missionId}")
    @SuccessResponse(StatusCodes.OK, "성공")

    @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
    @Response<MissionErrorResponse>(422, "잘못된 요청")
      @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async completeMission(
    @Path() userId: number,
    @Path() missionId: number
  ): Promise<ApiResponse<{ newUserMissionId: number }>> {
    
    const result = await completeMission(userId, missionId);
    return success(result);
  }

  // 내가 완료한 미션 목록 (GET /missions/users/{userId}/completed)
   /**
   * 내가 완료한 미션 목록 조회
   * @summary 내가 완료한 미션목록을 조회하는 엔드포인트입니다. 
   * @param userId 완료한 미션 목록을 조회할 유저의 고유 식별 번호 (ID)
   
   */
  @Get("users/{userId}/completed")
    @SuccessResponse(StatusCodes.OK, "성공")

    @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
    @Response<MissionErrorResponse>(422, "잘못된 요청")
      @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async listUserCompletedMissions(
    @Path() userId: number
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
   
    const missions = await listUserMissions(userId);
    return success(missions);
  }
}
