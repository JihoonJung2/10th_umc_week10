import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { RegisterRoutes } from "./generated/routes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { AppError } from "./common/errors/app.error";
import errorHandler from "./common/middlewares/errorHandeler";

import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import passport from "passport";
import { googleStrategy, jwtStrategy, kakaoStrategy } from "./auth.config";

// 1. 환경 변수 설정
dotenv.config();


passport.use(googleStrategy);
passport.use(kakaoStrategy);
passport.use(jwtStrategy);



const app: Express = express();
app.set("json replacer", (_key: string, value: any) =>
  typeof value === "bigint" ? value.toString() : value
);
app.use(morgan('dev'));
app.use(cookieParser()); 
const port = process.env.PORT || 3000;

declare global {
  namespace Express {
    interface User {
      id?: string;
      email?: string;
      name?: string | null;
      accessToken?: string;
      refreshToken?: string;
    }
    export interface Response {
      error(params: {
        errorCode?: string | null;
        message?: string | null;
        data?: any;
      }): this;
      success(params: {
        message?: string | null;
        data?: any;
      }): this;
    }
  }
}



app.use((_req: Request, res: Response, next: NextFunction) => {
  res.error = function ({ errorCode = null, message = null, data = null }) {
    return this.json({
      resultType: "FAILED",
      error: { errorCode, message, data },
      data: null,
    });
  };
  res.success = function ({ message = null, data = null }) {
    return this.json({
      resultType: "SUCCESS",
      error: null,
      data: { message, data },
    });
  };
  next();
});

// 2. 미들웨어 설정
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(passport.initialize());
// 1. TSOA가 생성한 swagger.json 읽어오기
const swaggerFile = JSON.parse(
  fs.readFileSync(path.resolve("public/swagger.json"), "utf8")
);

// 2. Swagger UI 연결
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// const isLogin = (req: Request, res: Response, next: NextFunction) => {
//     // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
//     const { username } = req.cookies; 

//     if (username) {
     
//         console.log(`[인증 성공] ${username}님, 환영합니다.`);
//         next(); 
//     } else {
    
//         console.log('[인증 실패] 로그인이 필요합니다.');
//         res.status(401).send('<script>alert("로그인이 필요합니다!");location.href="/login";</script>');
//     }
// };
const isLogin = passport.authenticate('jwt', { session: false });

// Express.js에 생성한 엔드 포인트들을 register
const router = express.Router();
RegisterRoutes(router); 
app.use(errorHandler);
app.use("/api/v1", router);

// app.get('/mypage', isLogin, (req, res) => {
//     res.send(`
//         <h1>마이페이지</h1>
//         <p>환영합니다, ${req.cookies.username}님!</p>
//         <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
//     `);
// });
app.get('/mypage', isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user?.name}님의 마이페이지입니다.`,
    data: req.user,
  });
});

app.get("/oauth2/login/google", passport.authenticate("google", { session: false }));
app.get("/oauth2/callback/google",
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  (req, res) => {
    res.status(200).json({ success: true, tokens: req.user });
  }
);

app.get("/oauth2/login/kakao", passport.authenticate("kakao", { session: false }));
app.get("/oauth2/callback/kakao",
  passport.authenticate("kakao", { session: false, failureRedirect: "/login-failed" }),
  (req, res) => {
    res.status(200).json({ success: true, tokens: req.user });
  }
);

app.use((err: AppError, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    message: err.message || null,
    data: err.data || null,
  });
});

// 4. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});

