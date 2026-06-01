import { Router } from "express";
import { handleAddMission, handleChallengeMission, handleCompleteMission, handleListStoreMissions, handleListUserChallengingMissions, handleListUserCompletedMissions, } from "./controllers/mission.controller.js";

const missionsRouter = Router();


//미션 추가
missionsRouter.post("/missions/:storeId", handleAddMission);
//미션 목록 조회
missionsRouter.get("/missions/stores/:storeId", handleListStoreMissions);
// 유저한테 미션 도전
missionsRouter.post("/missions/users/:userId/:missionId", handleChallengeMission);
//내가 진행중인 미션 목록
missionsRouter.get("/missions/users/:userId/challenging", handleListUserChallengingMissions);
//내가 진행중인 미션을 완료로 바꾸기
missionsRouter.patch("/missions/users/:userId/:missionId", handleCompleteMission);
//내가 완료한 미션 목록
missionsRouter.get("/missions/users/:userId/completed", handleListUserCompletedMissions);
export default missionsRouter;
