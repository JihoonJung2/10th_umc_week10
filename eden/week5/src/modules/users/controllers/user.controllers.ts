import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser, UserSignUpRequest } from "../dtos/user.dtos.js";
import { userSignUp, startMissionChallenge } from "../services/user.services.js";


export const handleUserSignUp = async (req: Request, res: Response, next: NextFunction ) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
 
	//서비스 로직 호출 
  const user = await userSignUp(bodyToUser(req.body as UserSignUpRequest));
  

  //성공 응답 보내기
  res.status(StatusCodes.OK).json({ result: user });
};

export const handleChallengeMission = async (req: Request, res: Response, next: NextFunction) => {
  const { userId: rawUserId, missionId: rawMissionId } = req.params;

  if (typeof rawUserId !== 'string' || typeof rawMissionId !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 사용자 또는 미션 ID입니다." });
  }

  const userId = parseInt(rawUserId, 10);
  const missionId = parseInt(rawMissionId, 10);

  try {
    const result = await startMissionChallenge(userId, missionId);
    res.status(StatusCodes.CREATED).json({ result });
  } catch (err: any) {
    // 서비스에서 409 에러를 보냈는지 확인
    if (err.statusCode === 409) {
      return res.status(StatusCodes.CONFLICT).json({ message: err.message });
    }
    next(err); // 그 외의 에러는 다음 미들웨어로 전달
  }
};
