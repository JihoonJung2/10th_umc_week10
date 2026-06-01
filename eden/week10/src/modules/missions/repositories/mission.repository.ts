import { AppError } from "../../../common/errors/app.error.js";
import { prisma } from "../../../db.config.js";
import { UserMissionStatus } from "../../../generated/prisma/enums.js";
import { StoreResponseDTO } from "../../stores/dtos/store.dtos.js";
import { AddMissionRequestDTO, handleMission, handleUserMission } from "../dtos/mission.dto.js";

// 미션을 데이터베이스에 추가하는 함수
export const addMission = async (storeId: number, data: AddMissionRequestDTO): Promise<number> => {
  try {
    const newMission = await prisma.mission.create({
      data: {
        storeId: storeId,  
        content: data.content,
        point: data.point,
      },
    });

    // BigInt 직렬화 에러를 방지하기 위해 생성된 ID를 Number로 변환하여 반환
    return Number(newMission.id);
  } catch (err) {
    throw new AppError({
      errorCode: "MISSION_ADD_FAILED",
      message: `미션 추가 중 오류 발생: ${err}`,
      statusCode: 500
    });
  }
};

// ID로 가게 정보를 조회하는 함수 
export const getStoreById = async (storeId: number): Promise<StoreResponseDTO | null> => {
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
      region: store.region?.name, 
      foodCategory: store.foodCategory, 
    };
  } catch (err) {
    throw new AppError({
      errorCode: "STORE_NOT_FOUND",
      message: `가게 조회 중 오류 발생: ${err}`,
      statusCode: 404
    });
  }
};

// 특정 가게의 미션 목록을 조회
export const getMissionsByStoreId = async (storeId: number): Promise<handleMission[]|null> => {
    const missions = await prisma.mission.findMany({
        where: {
            storeId: storeId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    if (!missions || missions.length === 0) {
        return null; 
    }
    return missions.map((mission) => ({
        id: Number(mission.id),       
        point: mission.point ?? 0,    
        content: mission.content,
        expireAt: mission.expireAt ?? new Date(), 
    }));
}
//유저 아이디로 ㅈ진행중인 미션 목록 조회
export const getUserMissionsByUserId=async(userId:number): Promise<handleUserMission[]|null>=>{
  const userMissions = await prisma.userMission.findMany({
    where:{
      userId:userId,
      status:UserMissionStatus.CHALLENGING,
    },
    include:{
      mission:{
        include:{
          store:true,
        }
      }
    }
  })
  if (!userMissions || userMissions.length === 0) {
    return null;}
  return userMissions.map((userMission) => ({
    id: Number(userMission.id),
    storeName: userMission.mission.store.name,
    content: userMission.mission.content,
    point: userMission.mission.point?? 0,
    expireAt: userMission.mission.expireAt?? new Date(),
  }));
}
//유저 아이디로 완료한 미션 목록 조회
export const getUserCompletedMissionsByUserId=async(userId:number)=>{
  return await prisma.userMission.findMany({
    where:{
      userId:userId,
      status:UserMissionStatus.COMPLETED,
    },
    include:{
      mission:{
        include:{
          store:true,
        }
      }
    }
  })
}

//사용자가 특정 미션에 도전중인지 확인하는 함수
export const getChallengingMission = async (userId: number, missionId: number) => {
  try {
  
    const mission = await prisma.userMission.findFirst({
      where: {
        userId: userId,
        missionId: missionId,
        status: UserMissionStatus.CHALLENGING,
      },
    });

  
    return mission;
  } catch (err) {
    throw new AppError({
      errorCode: "CHALLENGING_MISSION_CHECK_FAILED",
      message: `미션 도전 여부 확인 중 오류 발생: ${err}`,
      statusCode: 500
    });
  }
}
//사용자가 미션을 완료하는 함수
export const completeMissionChallenge = async (userId: number, missionId: number): Promise<number> => {
  try{
    await prisma.userMission.updateMany({
      where: {
        userId: userId,
        missionId: missionId,
        status: UserMissionStatus.CHALLENGING
      },
      data: {
        status: UserMissionStatus.COMPLETED
      }
    })
    return missionId;
  }
  catch(err){
    throw new AppError({
      errorCode: "MISSION_COMPLETE_FAILED",
      message: `미션 완료 중 오류 발생: ${err}`,
      statusCode: 500
    });
  }
}

// 사용자의 미션 도전을 데이터베이스에 추가하는 함수

export const challengeMission = async (userId: number, missionId: number): Promise<number> => {
  try {
    const newUserMission = await prisma.userMission.create({
      data: {
        userId: userId,
        missionId: missionId,
        status: UserMissionStatus.CHALLENGING,
      },
    });

   
    return Number(newUserMission.id);
  } catch (err) {
   
    throw new AppError({
      errorCode: "MISSION_CHALLENGE_FAILED",
      message: `미션 도전 추가 중 오류 발생: ${err}`,
      statusCode: 500
    });
  }
};
export const getMission = async (missionId: number): Promise<handleMission | null> => {
  try {
   
    const mission = await prisma.mission.findUnique({
      where: {
        id: missionId,
      },
    });
if (!mission) {
      return null;
    }
   
   return {
      id: Number(mission.id), 
      point: mission.point ?? 0, 
      content: mission.content,
      expireAt: mission.expireAt ?? new Date(), 
    };
  } catch (err) {
  
    throw new AppError({
      errorCode: "MISSION_NOT_FOUND",
      message: `미션 조회 중 오류 발생: ${err}`,
      statusCode: 404
    });
  }
};
