import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { handleUserSignUp, handleChallengeMission } from "./modules/users/controllers/user.controllers.js";
import { handleAddMission, handleAddReview, handleAddStore } from "./modules/stores/controllers/store.controllers.js";
// 1. 환경 변수 설정
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. 미들웨어 설정
app.use(cors());            // cors 방식 허용                 
app.use(express.static('public'));    // 정적 파일 접근      
app.use(express.json());              // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)     
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 3. 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

app.post("/api/v1/users/signup", handleUserSignUp);
// {
//   "email": "jerry@example.com",
//   "name": "제리",
//   "password": "password123", 
//   "gender": "F",
//   "birth": "2025-03-08",
//   "address": "주소1",
//   "detailAddress": "세부주소1",
//   "phoneNumber": "010-1234-1234",
//   "preferences":["KOREAN"]
// }

//특정 지역에 가게 추가하기
app.post("/api/v1/region/:regionId/stores", handleAddStore);
// {"regionId" :1,
// "foodCategory": "KOREAN",
// "name": "맛집1"}

//가게에 리뷰 추가하기
app.post("/api/v1/stores/:storeId/reviews", handleAddReview);
// {
//     "userId": 8,
//     "rating": 5,
//     "comment": "맛있다!"
// }
app.post("/api/v1/stores/:storeId/missions", handleAddMission);
// {
//   "content": "음식 남기지 않고 다 먹기",
//   "point": 100
// }


//미션 도전중으로 바꾸기(바꿔서 user_mission 테이블에 추가하기)
app.post("/api/v1/users/:userId/missions/:missionId", handleChallengeMission);

// 4. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});