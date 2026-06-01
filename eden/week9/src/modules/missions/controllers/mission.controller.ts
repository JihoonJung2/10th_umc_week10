import { StatusCodes } from "http-status-codes";
import {
  completeMission,
  createMission,
  listStoreMissions,
  listUserMissions,
  startMissionChallenge
} from "../services/mission.service";
import { AddMissionRequestDTO, ListStoreMissionsResponse } from "../dtos/mission.dto";
import { Body, Controller, Get, Middlewares, Patch, Path, Post, Request, Route, Tags, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import { ApiResponse, MissionErrorResponse, success } from "../../../common/responses/response.js";
import { Response } from "tsoa";
import { authorizeAdmin, authorizeUser } from "../../../common/middlewares/auth.middleware.js";

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {

  /**
   * 특정 가게에 미션 추가 (관리자 전용)
   * @summary 특정 가게에 미션을 추가하는 엔드포인트입니다.
   * @param storeId 미션을 추가할 대상 가게의 고유 식별 번호 (ID)
   */
  @Post("stores/{storeId}")
  @Middlewares(authorizeAdmin())
  @SuccessResponse(StatusCodes.CREATED, "성공")
  @Response<MissionErrorResponse>(401, "인증이 필요합니다")
  @Response<MissionErrorResponse>(403, "관리자만 접근 가능합니다")
  @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async addMission(
    @Path() storeId: number,
    @Body() missionData: AddMissionRequestDTO
  ): Promise<ApiResponse<{ newMissionId: number }>> {
    const result = await createMission(storeId, missionData);
    this.setStatus(StatusCodes.CREATED);
    return success(result);
  }

  /**
   * 특정 가게에 미션 목록조회
   * @summary 특정 가게에 미션목록을 조회하는 엔드포인트입니다.
   * @param storeId 미션 목록을 조회할 대상 가게의 고유 식별 번호 (ID)
   */
  @Get("stores/{storeId}")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.OK, "성공")
  @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async listStoreMissions(
    @Path() storeId: number
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
    const missions = await listStoreMissions(storeId);
    return success(missions);
  }

  /**
   * 유저가 미션에 도전
   * @summary 로그인한 유저가 미션에 도전하는 엔드포인트입니다.
   * @param missionId 도전할 미션의 고유 식별 번호 (ID)
   */
  @Post("{missionId}/challenge")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.CREATED, "성공")
  @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<MissionErrorResponse>(409, "이미 진행 중인 미션입니다")
  @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async challengeMission(
    @Request() req: ExpressRequest,
    @Path() missionId: number
  ): Promise<ApiResponse<{ newUserMissionId: number }>> {
    const userId = Number(req.user?.id);
    const result = await startMissionChallenge(userId, missionId);
    this.setStatus(StatusCodes.CREATED);
    return success(result);
  }

  /**
   * 내가 진행중인 미션목록
   * @summary 로그인한 유저의 진행중인 미션목록을 조회하는 엔드포인트입니다.
   */
  @Get("my/challenging")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.OK, "성공")
  @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async listUserChallengingMissions(
    @Request() req: ExpressRequest
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
    const userId = Number(req.user?.id);
    const missions = await listUserMissions(userId);
    return success(missions);
  }

  /**
   * 진행중인 미션 완료 처리
   * @summary 진행중인 미션을 완료 처리하는 엔드포인트입니다.
   * @param missionId 완료 처리할 미션의 고유 식별 번호 (ID)
   */
  @Patch("{missionId}/complete")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.OK, "성공")
  @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async completeMission(
    @Request() req: ExpressRequest,
    @Path() missionId: number
  ): Promise<ApiResponse<{ newUserMissionId: number }>> {
    const userId = Number(req.user?.id);
    const result = await completeMission(userId, missionId);
    return success(result);
  }

  /**
   * 내가 완료한 미션 목록 조회
   * @summary 로그인한 유저의 완료한 미션목록을 조회하는 엔드포인트입니다.
   */
  @Get("my/completed")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.OK, "성공")
  @Response<MissionErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<MissionErrorResponse>(500, "서버 내부 오류")
  public async listUserCompletedMissions(
    @Request() req: ExpressRequest
  ): Promise<ApiResponse<ListStoreMissionsResponse>> {
    const userId = Number(req.user?.id);
    const missions = await listUserMissions(userId);
    return success(missions);
  }
}
