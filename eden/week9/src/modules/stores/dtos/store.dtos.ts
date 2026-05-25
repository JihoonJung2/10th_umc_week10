
import { StoreFoodCategory } from '../../../generated/prisma/enums';
// 요청 본문의 타입을 정의
export interface AddStoreRequestDTO {
    /** 가게 이름
     * @example "맛있는 가게"
     */
  name: string;
  /** 음식 카테고리
   * @example "KOREAN"
   */
  foodCategory: StoreFoodCategory;
}

// 응답 타입을 정의
export interface StoreResponseDTO {
  /** @example 1 */
  id: number;
  /** @example "맛있는 가게" */
  name: string;
  /** @example "서울" */
  region: string;
  /** @example "KOREAN" */
  foodCategory: StoreFoodCategory;
}

export const responseFromStore = (store: any): StoreResponseDTO => {
  return {
    id: store.id,
    name: store.name,
    region: store.region_name,
    foodCategory: store.food_category,
  };
};

