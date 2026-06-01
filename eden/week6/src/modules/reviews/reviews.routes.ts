import { Router } from "express";
import { handleAddReview, handleListMyReviews, handleListStoreReviews } from "./controllers/review.controller.js";

const reviewsRouter = Router();

// /api/v1/stores/:storeId/reviews
reviewsRouter.post("/reviews/:storeId", handleAddReview);
reviewsRouter.get("/reviews", handleListMyReviews); //쿼리로 유저 아이디
reviewsRouter.get("/reviews/:storeId", handleListStoreReviews);
export default reviewsRouter;