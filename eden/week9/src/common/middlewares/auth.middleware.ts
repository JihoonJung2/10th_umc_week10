import passport from "passport";
import { Request, Response, NextFunction, RequestHandler } from "express";

export function authorizeUser(): RequestHandler {
  return passport.authenticate("jwt", { session: false });
}

export function authorizeAdmin(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          resultType: "FAILED",
          error: { errorCode: "UNAUTHORIZED", message: "로그인이 필요합니다.", data: null },
          data: null,
        });
      }
      if (user.status !== "admin") {
        return res.status(403).json({
          resultType: "FAILED",
          error: { errorCode: "FORBIDDEN", message: "관리자만 접근 가능합니다.", data: null },
          data: null,
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}
