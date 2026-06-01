import * as bcrypt from "bcrypt"; // bcrypt import
import { UserSignUpRequest } from "../dtos/user.dtos.js"; //인터페이스 가져오기 
import { responseFromUser } from "../dtos/user.dtos.js";
import {
  addUser,
  challengeMission,
  getUser,
  getUserPreferencesByUserId,
  isMissionChallenged,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data: UserSignUpRequest) => {
  // 1. 비밀번호 해싱 (salt round는 10~12가 일반적)
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  // 2. 해시된 비밀번호로 addUser 함수 호출
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    password: hashedPassword, // 원본 비밀번호 대신 해시된 비밀번호 전달
    gender: data.gender,
    birth: new Date(data.birth), // 문자열을 Date 객체로 변환해서 넘겨줍니다. 
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

export const startMissionChallenge = async (userId: number, missionId: number) => {
  // 1. 먼저 사용자가 이미 해당 미션에 도전 중인지 확인합니다.
  const isAlreadyChallenged = await isMissionChallenged(userId, missionId);
  if (isAlreadyChallenged) {
    // HTTP 409 Conflict 상태 코드와 함께 에러를 발생시킬 수 있습니다.
    const err = new Error("이미 도전 중인 미션입니다.");
    (err as any).statusCode = 409;
    throw err;
  }

  // 2. 중복이 아니면 미션 도전을 추가합니다.
  // Foreign key 제약조건에 의해 존재하지 않는 user 또는 mission일 경우 여기서 에러가 발생합니다.
  const newUserMissionId = await challengeMission(userId, missionId);

  // 3. 성공적으로 추가된 user_mission 레코드의 ID를 반환합니다.
  return { newUserMissionId };
};

