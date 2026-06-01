import { AddStoreRequestDTO, AddReviewRequestDTO, AddMissionRequestDTO } from "../dtos/store.dtos.js";
import { addReview, addStore, getStoreById, addMission } from "../repositories/store.repositories.js";

export const createStore = async (regionId: number, storeData: AddStoreRequestDTO) => {
  // 데이터베이스에 가게 추가
  const newStoreId = await addStore(regionId, {
    name: storeData.name,
    foodCategory: storeData.foodCategory,
  });

  // 추가된 가게의 전체 정보 조회 후 반환
  const newStore = await getStoreById(newStoreId);

  return {
    id: newStore.id,
    name: newStore.name,
    region: newStore.region_name,
    foodCategory: newStore.food_category,
  };
};

// createReview 함수의 파라미터를 DTO 객체로 받도록 수정
export const createReview = async (storeId: number, reviewData: AddReviewRequestDTO) => {
  // 가게가 실제로 존재하는지 확인
  const store = await getStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  // 가게가 존재하면 리뷰를 추가 (DTO에서 userId 추출)
  const newReviewId = await addReview(storeId, reviewData.userId, {
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  // 공적으로 추가된 리뷰의 ID를 반환
  return { newReviewId };
};

export const createMission = async (storeId: number, missionData: AddMissionRequestDTO) => {
  // 1. 가게가 실제로 존재하는지 확인 (기존 함수 재사용)
  const store = await getStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  // 2. 가게가 존재하면 미션을 추가
  const newMissionId = await addMission(storeId, {
    content: missionData.content,
    point: missionData.point,
  });

  // 3. 성공적으로 추가된 미션의 ID를 반환
  return { newMissionId };
};
