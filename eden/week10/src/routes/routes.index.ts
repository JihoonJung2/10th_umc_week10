import { Router } from "express";
import usersRouter from "../modules/users/users.routes.js";
import storesRouter from "../modules/stores/stores.routes.js";
import reviewsRouter from "../modules/reviews/reviews.routes.js";
import missionsRouter from "../modules/missions/missions.routes.js";

const apiV1Router = Router();

// 각 도메인별 라우터를 등록합니다.
apiV1Router.use(usersRouter);
apiV1Router.use(storesRouter);
apiV1Router.use(reviewsRouter);
apiV1Router.use(missionsRouter);

export default apiV1Router;