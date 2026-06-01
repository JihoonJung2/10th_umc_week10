
import { prisma } from "../../../db.config.js";
import { UserDto, UserPreferenceItemDto } from "../dtos/user.dtos.js";
// User 데이터 삽입 (이메일 중복 체크 포함)
export const addUser = async (data: any): Promise<number | null> => {
  try {
    // 이메일 중복 여부를 먼저 확인합니다.
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      return null; // 이미 존재하는 이메일이면 null 반환
    }

    // 데이터를 삽입합니다.
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,
      },
    });

    return Number(newUser.id); // BigInt일 경우를 대비해 Number로 변환
  } catch (err) {
    throw new Error(`회원가입 중 오류 발생: ${err}`);
  }
};

// 사용자 정보 얻기 
export const getUser = async (userId: number): Promise<UserDto> => {

  const user = await prisma.user.findFirstOrThrow({ 
    where: { id: userId } 
  });
  return  {
    id: Number(user.id),
    email: user.email ,
    name: user.name ,
    gender: user.gender ,
    birth: user.birth,
    address: user.address,
    detailAddress: user.detailAddress,
    phoneNumber: user.phoneNumber,
  
  };
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId: number, foodCategoryId: number) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 4. 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (
  userId: number
): Promise<UserPreferenceItemDto[]> => { 
  try {
    const preferences = await prisma.userFavorCategory.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        foodCategoryId: 'asc',
      },
      select: {
        id: true,
        foodCategoryId: true,
        userId: true,
      },
    });

    return preferences.map((pref) => ({
      ...pref,
      userId: typeof pref.userId === 'bigint' ? Number(pref.userId) : pref.userId,
    })); 
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  }
};



