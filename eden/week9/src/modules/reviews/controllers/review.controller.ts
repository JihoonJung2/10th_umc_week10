import { StatusCodes } from "http-status-codes";
import { AddReviewRequestDTO, MyReview, ReviewListResponse } from "../dtos/review.dto";
import { createReview, listMyReviews, listStoreReviews } from "../services/review.service";
import { Body, Controller, Get, Post, Path, Query, Route, Tags, SuccessResponse, Middlewares, Request } from "tsoa";
import { Request as ExpressRequest } from "express";
import { ApiResponse, ReviewErrorResponse, success } from "../../../common/responses/response";
import { Response } from "tsoa";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js";

@Route("reviews")
@Tags("Reviews")
export class ReviewController extends Controller {

  /**
   * 특정 가게에 리뷰 추가
   * @summary 특정 가게에 리뷰를 추가하는 엔드포인트입니다.
   * @param storeId 리뷰를 추가할 대상 가게의 고유 식별 번호 (ID)
   */
  @Post("{storeId}")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.CREATED, "성공")
  @Response<ReviewErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<ReviewErrorResponse>(422, "잘못된 요청(유효성 검증 실패")
  @Response<ReviewErrorResponse>(409, "이미 존재하는 리뷰입니다")
  @Response<ReviewErrorResponse>(500, "서버 내부 오류")
  public async addReview(
    @Request() req: ExpressRequest,
    @Path() storeId: number,
    @Body() reviewData: AddReviewRequestDTO
  ): Promise<ApiResponse<{ newReviewId: number }>> {
    const userId = Number(req.user?.id);
    const result = await createReview(storeId, userId, reviewData);
    this.setStatus(StatusCodes.CREATED);
    return success(result);
  }

  /**
   * 내가 작성한 리뷰 목록 조회
   * @summary 내가 작성한 리뷰 목록을 조회하는 엔드포인트입니다.
   */
  @Get("my")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.OK, "성공")
  @Response<ReviewErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<ReviewErrorResponse>(500, "서버 내부 오류")
  public async listMyReviews(
    @Request() req: ExpressRequest
  ): Promise<ApiResponse<MyReview[]>> {
    const userId = Number(req.user?.id);
    const reviews = await listMyReviews(userId);
    return success(reviews);
  }

  /**
   * 특정 가게에 리뷰 목록조회
   * @summary 특정 가게에 리뷰목록을 조회하는 엔드포인트입니다.
   * @param storeId 리뷰 목록을 조회할 대상 가게의 고유 식별 번호 (ID)
   * @param cursor 페이지네이션을 위한 커서 값 (옵션)
   */
  @Get("{storeId}")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.OK, "성공")
  @Response<ReviewErrorResponse>(404, "정보가 유효하지 않습니다")
  @Response<ReviewErrorResponse>(500, "서버 내부 오류")
  public async listStoreReviews(
    @Path() storeId: number,
    @Query() cursor: number
  ): Promise<ApiResponse<ReviewListResponse>> {
    const reviews = await listStoreReviews(storeId, cursor);
    return success(reviews);
  }
}
