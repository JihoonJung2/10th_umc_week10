import { AppError } from "./app.error";

export class DuplicateUserEmailError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "U001",
      statusCode: 409,
      message,
      data,
    });
  }
}
export class DuplicateUserStoreError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "S001",
      statusCode: 409,
      message,
      data,
    });
  }
}

export class UserNotExist extends AppError{
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "U002",
      statusCode: 404,
      message,
      data,
    });
  }
}

export class StoreNotExist extends AppError{
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "S002",
      statusCode: 404,
      message,
      data,
    });
  }
}

export class ReviewNotExist extends AppError{
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "R001",
      statusCode: 404,
      message,
      data,
    });
  }   
}
export class MissionNotExist extends AppError{
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "M001",
      statusCode: 404,
      message,
      data,
    });
  } 
}

export class NO_CHALLENGING_MISSIONS extends AppError{
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "NO_CHALLENGING_MISSIONS",
      statusCode: 404,
      message,
      data,
    });
  } 
}

export class AlreadyChallengingMission extends AppError{
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "ALREADY_CHALLENGING_MISSION",
      statusCode: 422,
      message,
      data,
    });
  } }