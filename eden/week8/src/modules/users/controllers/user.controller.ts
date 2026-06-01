import {
  Body,
  Controller,
  Get,
  Middlewares,
  Post,
  Request,
  Route,
  Tags,
  Response,
  SuccessResponse,
} from "tsoa";

import { Request as ExpressRequest } from "express";
import { bodyToUser, UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dtos.js";
import { userSignUp } from "../services/user.services.js";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js"; 
import { ApiResponse, success, UserErrorResponse } from "../../../common/responses/response.js";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
    /**
   * 회원가입 API
   * @summary 회원가입을 처리하는 엔드포인트입니다.
   * @param body 회원가입에 필요한 정보가 담긴 객체
   
   */
  
  @Post("signup")
    @SuccessResponse(200, "회원가입 성공")
    @Response<UserErrorResponse>(422, "잘못된 요청(유효성 검증 실패")
@Response<UserErrorResponse>(409, "이미 존재하는 이메일입니다")
@Response<UserErrorResponse>(500, "서버 내부 오류")
  public async handleUserSignUp(@Body() body: UserSignUpRequest): Promise<ApiResponse<UserSignUpResponse>>  {
    console.log("회원가입을 요청했습니다!");
    const user = await userSignUp(bodyToUser(body));
    return success(user);
  }

  
  @Get("guest")
  public async handleGuestPage(): Promise<string> {
    return `
      <h1>게스트 페이지</h1>
      <p>이 페이지는 로그인이 필요 없습니다.</p>
      <ul>
          <li><a href="/api/v1/users/mypage">마이페이지 (로그인 필요)</a></li>
      </ul>
    `;
  }

  
  @Get("login")
  public async handleLoginPage(): Promise<string> {
    return "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>";
  }

  
  @Get("mypage")
  @Middlewares(authorizeUser())
  public async handleMypage(@Request() req: ExpressRequest): Promise<string> {
    const username = req.cookies.username || "사용자";
    return `
      <h1>마이페이지</h1>
      <p>환영합니다, ${username}님!</p>
      <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `;
  }

 
  @Get("set-login")
  public async handleSetLogin(@Request() req: ExpressRequest): Promise<string> {
  
    req.res!.cookie("username", "UMC10th", { maxAge: 3600000, httpOnly: true });
    return `
      로그인 쿠키(username=UMC10th) 생성 완료! 
      <br><a href="/api/v1/users/mypage">마이페이지로 이동</a>
    `;
  }

 
  @Get("set-logout")
  public async handleSetLogout(@Request() req: ExpressRequest): Promise<string> {
    req.res!.clearCookie("username");
    return '로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>';
  }
}