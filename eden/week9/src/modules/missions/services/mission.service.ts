
import { AppError } from "../../../common/errors/app.error";
import { AlreadyChallengingMission, MissionNotExist, NO_CHALLENGING_MISSIONS, StoreNotExist, UserNotExist } from "../../../common/errors/errors";
import { getUser } from "../../users/repositories/user.repository";
import { AddMissionRequestDTO, responseFromChallenge, responseFromMission, responseFromStoreMissions, } from "../dtos/mission.dto";
import { addMission, challengeMission, completeMissionChallenge, getChallengingMission, getMission, getMissionsByStoreId, getStoreById, getUserMissionsByUserId} from "../repositories/mission.repository";

export const createMission = async (storeId: number, missionData: AddMissionRequestDTO) => {
  // 가게가 실제로 존재하는지 확인
  const store = await getStoreById(storeId);
  if (!store) {
    throw new StoreNotExist("존재하지 않는 가게입니다.");
  }

  // 가게가 존재하면 미션을 추가
  const newMissionId = await addMission(storeId, {
    content: missionData.content,
    point: missionData.point,
  });

  // 매퍼를 사용하여 결과 반환 
  return responseFromMission(newMissionId);
};

// 특정 가게의 미션 목록 조회 서비스
export const listStoreMissions = async (storeId: number) => {
   
    const missions = await getMissionsByStoreId(storeId);
    if(missions==null){
        throw new MissionNotExist("해당 가게에 미션이 존재하지 않습니다.");
    }

   
    return responseFromStoreMissions(missions);
}
//진행중인 미션 목록 조회 서비스
export const listUserMissions=async(userId:number)=>{
 
  const missions=await getUserMissionsByUserId(userId);
  if(missions==null){
    throw new NO_CHALLENGING_MISSIONS("진행 중인 미션이 존재하지 않습니다.");
   }
  return responseFromStoreMissions(missions);
}

export const startMissionChallenge = async (userId: number, missionId: number) => {
  // 사용자 존재 여부 확인
  const user = await getUser(userId); 
  if (!user) {
    throw new UserNotExist("존재하지 않는 사용자입니다.");
  }

  // 미션 존재 여부 확인
  const mission = await getMission(missionId); 
  if (!mission) {
    throw new MissionNotExist("존재하지 않는 미션입니다.");}
  //이미 진행중인지 확인
  const existingChallenge = await getChallengingMission(userId, missionId);
  if (existingChallenge) {
    throw new AlreadyChallengingMission("이미 진행 중인 미션입니다.");
  }

  // 모든 검증을 통과하면 미션 도전 추가
  const newUserMissionId = await challengeMission(userId, missionId);

  // 매퍼를 사용하여 결과 반환
  return responseFromChallenge(newUserMissionId);
};

//미션 완료 서비스
export const completeMission = async (userId: number, missionId: number) => {
  // 진행 중인 미션 확인
  const existingChallenge = await getChallengingMission(userId, missionId);

  if (!existingChallenge) {
    throw new NO_CHALLENGING_MISSIONS("진행 중인 미션이 존재하지 않습니다.");
  }
  const existCompleteChallenge = await getUserMissionsByUserId(userId);
  if (existCompleteChallenge && existCompleteChallenge.some(mission => mission.id === missionId)) {
    throw new MissionNotExist("이미 완료된 미션입니다.");
  }
  // 업데이트
  const mission=await completeMissionChallenge(userId, missionId);
  return responseFromChallenge(mission)
};

