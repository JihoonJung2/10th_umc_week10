// 회원가입 요청 데이터 구조 정의
export interface UserSignUpRequest {
  email: string;
  name: string;
  password: string; 
  gender: string;
  birth: string | Date;
  address?: string;
  detailAddress?: string;
  phoneNumber: string;
 
  preferences: number[]; 
}

export interface UserDto {
  id: number;
  email: string | null;
  name: string | null;
  gender: string | null;
  birth: Date | null;
  address: string | null;
  detailAddress: string | null;
  phoneNumber: string | null;
}
export interface UserSignUpResponse {
  email: string | null;
  name: string | null;
  preferCategory: number[]; // foodCategoryId 목록
}

export const responseFromUser = (data: {
  user: UserDto;
  preferences: UserPreferenceItemDto[];
}): UserSignUpResponse => {
  return {
    email: data.user.email,
    name: data.user.name,
    preferCategory: data.preferences.map((p) => p.foodCategoryId),
  };
};
// 개별 선호 카테고리 아이템의 구조
export interface UserPreferenceItemDto {
  id: number;
  foodCategoryId: number;
  userId: number;
}

export const bodyToUser = (body: UserSignUpRequest) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    name: body.name, // 필수
    password: body.password,
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
  };
};