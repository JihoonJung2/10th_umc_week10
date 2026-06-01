import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { 
  completeMission, 
  createMission, 
  listStoreMissions, 
  listUserMissions, 
  startMissionChallenge 
} from "../services/mission.service";
import { AddMissionRequestDTO } from "../dtos/mission.dto";

// 미션 추가 컨트롤러
export const handleAddMission = async (req: Request, res: Response, next: NextFunction) => {
  const storeId = Number(req.params.storeId);
  const missionData: AddMissionRequestDTO = req.body;

  if (isNaN(storeId) || storeId <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효한 가게 ID(양수)가 필요합니다." });
  }

  try {
    const result = await createMission(storeId, missionData);
    return res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    next(err);
  }
};

// 특정 가게의 미션 목록 조회 컨트롤러
export const handleListStoreMissions = async (req: Request, res: Response, next: NextFunction) => {
  const storeId = Number(req.params.storeId);

  if (isNaN(storeId) || storeId <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효한 숫자 형태의 storeId가 필요합니다." });
  }

  try {
    const missions = await listStoreMissions(storeId);
    return res.status(StatusCodes.OK).json(missions);
  } catch (err) {
    next(err);
  }
}

// 진행중인 미션 조회 컨트롤러
export const handleListUserChallengingMissions = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.userId);
  
  if (isNaN(userId) || userId <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효한 숫자 형태의 userId가 필요합니다." });
  }
  
  try {
    const missions = await listUserMissions(userId);
    return res.status(StatusCodes.OK).json(missions);
  } catch (err) {
    next(err);
  }
}

// 완료한 미션 조회 컨트롤러
export const handleListUserCompletedMissions = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.userId);
  
  if (isNaN(userId) || userId <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효한 숫자 형태의 userId가 필요합니다." });
  }
  
  try {
   
    const missions = await listUserMissions(userId);
    return res.status(StatusCodes.OK).json(missions);
  } catch (err) {
    next(err);
  }
}

// 미션 도전 시작 컨트롤러
export const handleChallengeMission = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.userId);
  const missionId = Number(req.params.missionId);

  if (isNaN(userId) || userId <= 0 || isNaN(missionId) || missionId <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 사용자 또는 미션 ID입니다." });
  }

  try {
    const result = await startMissionChallenge(userId, missionId);
    return res.status(StatusCodes.CREATED).json({ result });
  } catch (err: any) {
    if (err.statusCode === 409) {
      return res.status(StatusCodes.CONFLICT).json({ message: err.message });
    }
    next(err); 
  }
};

// 진행중인 미션을 완료시키는 컨트롤러
export const handleCompleteMission = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.userId);
  const missionId = Number(req.params.missionId);

  if (isNaN(userId) || userId <= 0 || isNaN(missionId) || missionId <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 사용자 또는 미션 ID입니다." });
  }

  try {    
    const result = await completeMission(userId, missionId);
    return res.status(StatusCodes.OK).json({ result });
  } catch (err: any) {
    if (err.statusCode === 404) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
    }
    next(err);
  }
};