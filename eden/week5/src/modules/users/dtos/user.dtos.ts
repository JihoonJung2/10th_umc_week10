// 1. 먼저 허용할 카테고리들을 Enum으로 정의합니다.
export enum FoodCategory {
  KOREAN = 'KOREAN',
  CHINESE = 'CHINESE',
  JAPANESE = 'JAPANESE',
  WESTERN = 'WESTERN'
}

// 2. 회원가입 요청 데이터 설계도를 수정합니다.
export interface UserSignUpRequest {
  email: string;
  name: string;
  password: string; // password 필드 추가
  gender: string;
  birth: string | Date;
  address?: string;
  detailAddress?: string;
  phoneNumber: string;
  // 이제 숫자가 아닌 'KOREAN', 'CHINESE' 등의 배열만 허용됩니다.
  preferences: FoodCategory[]; 
}

// 2. 요청받은 데이터를 우리 시스템에 맞는 데이터로 변환해주는 함수입니다. 
export const bodyToUser = (body: UserSignUpRequest) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    name: body.name, // 필수
    password: body.password, // password 필드 추가
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
  };
};

export const responseFromUser = (data: any) => {
  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name,
    preferences: data.preferences
  };
}

