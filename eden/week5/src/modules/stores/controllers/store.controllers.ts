import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { createStore, createReview, createMission } from "../services/store.services.js";
import { AddReviewRequestDTO } from "../dtos/store.dtos.js";

export const handleAddStore = async (req: Request, res: Response, next: NextFunction) => {
 
const { regionId: rawRegionId } = req.params;

if (typeof rawRegionId !== 'string') {
  // regionId가 없거나 이상한 형태일 때 에러 처리
  return res.status(400).json({ message: "유효하지 않은 지역 ID입니다." });
}

const regionId = parseInt(rawRegionId, 10);
  // 요청 본문(body)에서 가게 이름과 카테고리를 가져옵니다.
  const storeData = req.body;

  console.log(`'${regionId}' 지역에 가게 추가를 요청했습니다.`);
  console.log("body:", storeData);

  try {
    const newStore = await createStore(regionId, storeData);
    res.status(StatusCodes.CREATED).json({ result: newStore });
  } catch (err) {
    next(err); // 에러가 발생하면 다음 미들웨어로 전달
  }
};
export const handleAddReview = async (req: Request, res: Response, next: NextFunction) => {
  const { storeId: rawStoreId } = req.params;
    
  if (typeof rawStoreId !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 가게 ID입니다." });
  }

  const storeId = parseInt(rawStoreId, 10);
  
 
  // 요청 본문 전체를 DTO 타입으로 받음
  const reviewData: AddReviewRequestDTO = req.body;

  // 본문에 userId가 있는지 간단히 확인
  if (reviewData.userId === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "userId는 필수입니다." });
  }

  try {
    // 서비스 함수에 DTO 객체 전체를 전달
    const result = await createReview(storeId, reviewData);
    res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    next(err);
  }
};

export const handleAddMission = async (req: Request, res: Response, next: NextFunction) => {
  const { storeId: rawStoreId } = req.params;

  if (typeof rawStoreId !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 가게 ID입니다." });
  }
  const storeId = parseInt(rawStoreId, 10);

  const missionData = req.body;

  try {
    const result = await createMission(storeId, missionData);
    res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    next(err);
  }
};
