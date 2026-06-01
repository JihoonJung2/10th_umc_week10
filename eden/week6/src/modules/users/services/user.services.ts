import * as bcrypt from "bcrypt"; // bcrypt import
import { UserSignUpRequest } from "../dtos/user.dtos.js"; //인터페이스 가져오기 
import { responseFromUser } from "../dtos/user.dtos.js";
import {
  addUser,

  getUser,
  getUserPreferencesByUserId,
 
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

