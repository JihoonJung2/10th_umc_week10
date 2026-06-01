
// 미션 추가 요청 본문의 타입을 정의합니다.
export interface AddMissionRequestDTO {
  content: string;
  point: number;
}
// 미션 추가 서비스의 응답 형태를 정의하는 DTO
export const responseFromMission = (missionId: number) => {
  return {
    newMissionId: missionId
  };
};

// 요청 파라미터 타입 정의 
export interface ListStoreMissionsRequestParams {
    storeId: string; 
}

// 가게 미션 응답 데이터의 단일 미션 항목 타입 정의


// 가게 미션 최종 응답 데이터 타입 정의 
export type ListStoreMissionsResponse = handleMission[];

export interface handleMission {
    id: number;
    point: number;
    content: string;
    expireAt: Date;
}

//진행중인 미션 데이터 타입정의
export interface handleUserMission {
  id: number;
  storeName: string;
  content: string;
  point: number; 
  expireAt: Date;
}
//최종 응답 데이터
export type ListUserMissionsResponse=handleUserMission[];
//진행중인 미션 응답 데이터 타입 정의
export const responseFromStoreMissions = (data: handleMission[]): ListStoreMissionsResponse => { 
  return data.map(mission => ({
    id: Number(mission.id), 
    point: mission.point,
    content: mission.content,
    expireAt: mission.expireAt, 
  }));
};

export const responseFromChallenge = (userMissionId: number) => {
  return {
    newUserMissionId: userMissionId
  };
};

export const responseFromUserMissions=(mission: handleMission[])=>{
  
}