// 리뷰 추가 요청 본문의 타입을 정의
export interface AddReviewRequestDTO {
  /** 리뷰를 작성한 유저의 ID
   * @example 1
   */
  userId: number; 
  /** 평점
   * @example 4
   */
  rating: number;
  /** 리뷰 내용
   * @example "맛있어요!"
   */
  comment: string;
}
export interface StoreResponseDto {
  id: number;
  name: string;
  food_category: string; 
  region_name?: string;  
}


// 응답 데이터의 단일 리뷰 항목 타입 정의
export interface MyReview {
  /** @example 1 */
  id: number;
  /** @example 4 */
  rating: number;
  /** @example "맛있어요!" */
  comment: string;
  /** @example "2024-01-01T00:00:00.000Z" */
  createdAt: Date;
  store: {
    /** @example 1 */
    id: number;
    /** @example "맛있는 가게" */
    name: string;
  };
}



// 레포지토리에서 받은 데이터를 API 응답 형태로 변환하는 함수
export const responseFromMyReviews = (data: MyReview[]): MyReview[] => {
    return data.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        store: {
            id: review.store.id,
            name: review.store.name,
        }
    }));
}
export const responseFromReviews = (
reviews: ReviewItem[]): ReviewListResponse => {
    const lastReview = reviews[reviews.length - 1];
  
    return {
      data: reviews,
      pagination: {
        cursor: lastReview ? lastReview.id : null,
      },
    };
  };
export interface ReviewItem {
  /** @example 1 */
  id: number;
  /** @example "정말 맛있어요!" */
  comment: string;
  store: {
    /** @example "맛있는 가게" */
    name: string;
  };
  user: {
    /** @example "홍길동" */
    name: string;
  };
}
export interface ReviewListResponse {
  data: ReviewItem[];
  pagination: {
    /** @example 5 */
    cursor: number | null; // 다음 페이지를 위한 커서 (마지막 리뷰의 ID)
  };
}
