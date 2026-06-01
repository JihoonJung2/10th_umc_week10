import {addReview, getAllStoreReviews, getReviewsByUserId} from "../repositories/review.repositoriy.js";
import { AddReviewRequestDTO, responseFromMyReviews, responseFromReviews, ReviewListResponse } from "../dtos/review.dto.js";
import { getStoreById } from "../repositories/review.repositoriy.js";



// createReview 함수의 파라미터를 DTO 객체로 받도록 수정
export const createReview = async (storeId: number, reviewData: AddReviewRequestDTO) => {
  // 가게가 실제로 존재하는지 확인
  const store = await getStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }
  //유저가 존재하는지 확인
  const userId= reviewData.userId;
  if (!userId) {
    throw new Error("존재하지 않는 유저입니다.");
   }

  // 가게가 존재하면 리뷰를 추가
  const newReviewId = await addReview(storeId, {
    userId: reviewData.userId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  // 공적으로 추가된 리뷰의 ID를 반환
  return { newReviewId };
};

// 내가 작성한 리뷰 목록 조회 서비스
export const listMyReviews = async (userId: number) => {
    
    const reviews = await getReviewsByUserId(userId);
   for (const review of reviews) {
    if (getStoreById(review.store.id) === null) {
      throw new Error(`리뷰 (ID: ${review.id})에 해당하는 가게 정보가 존재하지 않습니다.`);
    }
  }
    return responseFromMyReviews(reviews);
}


export const listStoreReviews = async (
storeId: number, cursor: number): Promise<ReviewListResponse> => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};