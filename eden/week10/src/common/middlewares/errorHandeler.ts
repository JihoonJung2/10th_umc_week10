import { Request, Response, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { AppError } from "../errors/app.error";

const lastDefenseErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  // 1️ tsoa 유효성 에러 (입력값 오류)
  if (err instanceof ValidateError) {
    return res.status(422).json({
      success: false,
      statusCode: 422,
      errorCode: "VALIDATION_FAILED",
      message: "입력값 형식이 올바르지 않습니다.",
      data: err?.fields,
    });
  }
//커스텀 에러들
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      message: err.message,
      data: err.data || null,
    });
  }

  // 설정하지 못한 모든 서버 에러 다룸
  console.error("🚨 [예측하지 못한 서버 자체 오류 발생]:", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.",
    data: null,
  });
};

export default lastDefenseErrorHandler;