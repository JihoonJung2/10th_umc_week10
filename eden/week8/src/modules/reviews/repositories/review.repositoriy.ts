import { AppError } from "../../../common/errors/app.error.js";
import { prisma } from "../../../db.config.js";
import { AddReviewRequestDTO, MyReview, ReviewItem, StoreResponseDto } from "../dtos/review.dto.js";


//  리뷰를 데이터베이스에 추가하는 함수
export const addReview = async (storeId: number, data:AddReviewRequestDTO): Promise<number> => {
  try {
    const newReview = await prisma.review.create({
      data: {
        storeId: storeId, 
        userId: data.userId,   
        rating: data.rating,
        comment: data.comment,
      },
    });

   
    return Number(newReview.id);
  } catch (err) {
    throw new AppError({
      errorCode: "REVIEW_ADD_FAILED",
      message: `리뷰 추가 중 오류 발생: ${err}`,
      statusCode: 500
    });
  }
};

//ID로 가게 정보를 조회하는 함수
export const getStoreById = async (storeId: number): Promise <StoreResponseDto | null> => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    
      include: {
        region: {
          select: {
            name: true, 
          },
        },
      },
    });

    if (!store) return null;

    
    return {
      id: Number(store.id),
      name: store.name,
      food_category: store.foodCategory,
      region_name: store.region?.name, 
    };
  } catch (err) {
    throw new AppError({
      errorCode: "STORE_NOT_FOUND",
      message: `가게 조회 중 오류 발생: ${err}`,
      statusCode: 404
    });
  }
};





// 특정 사용자가 작성한 리뷰 목록을 가게 정보와 함께 조회
export const getReviewsByUserId = async (userId: number): Promise<MyReview[]> => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        // userId가 BigInt이므로 변환
        userId: BigInt(userId),
      },
      include: {
        store: true, 
      },
      orderBy: {
        createdAt: 'desc', // 최신순으로 정렬
      }
    });

    // Prisma에서 가져온 원본 데이터를 MyReview 인터페이스 형태에 맞게 매핑(Mapping)
    return reviews.map((review) => ({
      id: Number(review.id), // BigInt -> number
      rating: review.rating,
      comment: review.comment ?? "", // 값이 null일 경우 빈 문자열로 처리
      createdAt: review.createdAt ?? new Date(), // null일 경우 기본 날짜 지정
      store: {
        id: Number(review.store.id), // BigInt -> number
        name: review.store.name,
      }
    }));
  } catch (err) {
    throw new AppError({
      errorCode: "MY_REVIEWS_NOT_FOUND",
      message: `사용자 리뷰 목록 조회 중 오류 발생: ${err}`,
      statusCode: 404
    });
  }
};


export const getAllStoreReviews = async (
    storeId: number,
    cursor: number
  ): Promise<ReviewItem[]> => {
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        comment: true,
        
        store: {
          select: {
            name: true,
          }
        },
        
        user: {
          select: {
            name: true,
          }
        },
      },
      where: {
        storeId: storeId,
        id: {
          gt: cursor,
        },
      },
      orderBy: {
        id: "asc",
      },
      take: 5,
    });
  
    
return reviews as any as ReviewItem[];
  };