import { StatusCodes } from "http-status-codes";
import { AddReviewRequestDTO, MyReview, ReviewListResponse} from "../dtos/review.dto";
import { createReview, listMyReviews, listStoreReviews } from "../services/review.service";
import { Body, Controller, Get, Post, Path, Query, Route, Tags, SuccessResponse } from "tsoa";
import { AppError } from "../../../common/errors/app.error";
import { ApiResponse, success } from "../../../common/responses/response";

@Route("reviews")
@Tags("Reviews")
export class ReviewController extends Controller {

  // 특정 가게에 리뷰 추가 (POST /reviews/{storeId})
  @Post("{storeId}")
  @SuccessResponse(StatusCodes.CREATED, "Created")
  public async addReview(
    @Path() storeId: number,
    @Body() reviewData: AddReviewRequestDTO
  ): Promise<ApiResponse<{ newReviewId: number }>> {
  
    const result = await createReview(storeId, reviewData);

    this.setStatus(StatusCodes.CREATED);
    return success(result);
  }

  //내가 작성한 리뷰 목록 조회 (GET /reviews)
  @Get("my")
  public async listMyReviews(
    @Query() userId: number
  ):Promise<ApiResponse<MyReview[]>> {
        const reviews = await listMyReviews(userId);
    return success(reviews);
  }

  //특정 가게의 리뷰 목록 조회 (GET /reviews/{storeId})
  @Get("{storeId}")
  public async listStoreReviews(
    @Path() storeId: number,
    @Query() cursor: number
  ): Promise<ApiResponse< ReviewListResponse>> {
    const reviews = await listStoreReviews(storeId, cursor);
    return success(reviews);
  }
}
