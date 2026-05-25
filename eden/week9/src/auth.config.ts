import dotenv from "dotenv";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as KakaoStrategy, Profile as KakaoProfile } from "passport-kakao";
import jwt from "jsonwebtoken";
import { prisma } from "./db.config.js";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

dotenv.config();

// 1. JWT 토큰 생성 함수 (타입 지정)
export const generateAccessToken = (user: { id: bigint; email: string }) => {
  return jwt.sign(
    { id: user.id.toString(), email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user: { id: bigint }) => {
  return jwt.sign(
    { id: user.id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: "14d" }
  );
};

// 2. Google Verify 로직 
const googleVerify = async (profile: Profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new Error("Google 프로필에 이메일이 없습니다.");

  let user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: null,
        name: profile.displayName ?? "소셜유저",
        gender: null,
        birth: new Date(1970, 0, 1),
        address: "미입력",
        detailAddress: "미입력",
        phoneNumber: null,
      },
    });
  }

  return { id: user.id, email, name: user.name };
};

// 3. Google Strategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:3000/oauth2/callback/google",
    scope: ["email", "profile"],
  },
  async (_accessToken, _refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);
      const tokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
      return cb(null, tokens);
    } catch (err) {
      return cb(err as Error);
    }
  }
);

// 4. Kakao Verify 로직
const kakaoVerify = async (profile: KakaoProfile) => {
  const email: string =
    profile._json?.kakao_account?.email ?? `kakao_${profile.id}@kakao.local`;
  const name: string = profile.displayName ?? "카카오유저";

  let user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: null,
        name,
        gender: null,
        birth: new Date(1970, 0, 1),
        address: "미입력",
        detailAddress: "미입력",
        phoneNumber: null,
      },
    });
  }

  return { id: user.id, email, name: user.name };
};

// 5. Kakao Strategy
export const kakaoStrategy = new KakaoStrategy(
  {
    clientID: process.env.KAKAO_CLIENT_ID!,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/callback/kakao",
  },
  async (_accessToken, _refreshToken, profile, cb) => {
    try {
      const user = await kakaoVerify(profile);
      const tokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
      return cb(null, tokens);
    } catch (err) {
      return cb(err as Error);
    }
  }
);

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
  },
  async (payload, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { email: payload.email } });
      if (!user) return done(null, false);
      return done(null, {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        status: user.status,
      });
    } catch (err) {
      return done(err, false);
    }
  }
);