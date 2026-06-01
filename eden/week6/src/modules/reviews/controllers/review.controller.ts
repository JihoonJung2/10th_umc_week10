import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AddReviewRequestDTO } from "../dtos/review.dto";
import { createReview, listStoreReviews } from "../services/review.service";

import { listMyReviews } from "../services/review.service.js";

export const handleAddReview = async (req: Request, res: Response, next: NextFunction) => {
 
  
  const storeId =Number(req.params.storeId)
  const reviewData: AddReviewRequestDTO = req.body;

  // storeId가 유효한 숫자인지 확인
  if (isNaN(storeId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효한 storeId가 필요합니다." });
  }

  // 본문에 userId가 있는지 간단히 확인
  if (reviewData.userId === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "userId는 필수입니다." });
  }

  try {
    // 서비스 함수에 DTO 객체 전체를 전달
    const result = await createReview(storeId, reviewData);
    return res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    next(err);
  }
};

// 내가 작성한 리뷰 목록 조회 컨트롤러
export const handleListMyReviews = async (req: Request, res: Response) => {
    try {
        
        const userIdString = req.query.userId as string;

        // 유효성 검사
        if (!userIdString) {
            return res.status(400).send("userId가 필요합니다.");
        }

        const userId = parseInt(userIdString, 10);
        if (isNaN(userId)) {
            return res.status(400).send("유효한 숫자 형태의 userId가 필요합니다.");
        }

        // 서비스 호출 및 응답
        const reviews = await listMyReviews(userId);
        return res.status(200).json(reviews);

    } catch (error) {
        console.error("리뷰 목록 조회 중 오류 발생:", error);
        return res.status(500).send("서버 내부 오류 발생");
    }
}
export const handleListStoreReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    const cursor =
    typeof req.query.cursor === "string"
      ? parseInt(req.query.cursor, 10): 0;
    if(cursor==0)res.status(StatusCodes.BAD_REQUEST).json({ message: "유효한 cursor가 필요합니다." });

    const reviews = await listStoreReviews(storeId, cursor);

    res.status(StatusCodes.OK).json(reviews);
  } catch (err) {
    next(err);
  }
};