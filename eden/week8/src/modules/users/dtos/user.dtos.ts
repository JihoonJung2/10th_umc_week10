// 회원가입 요청 데이터 구조 정의
export interface UserSignUpRequest {
   /** 유저 이메일 (로그인 시 사용)
    * @example "example@naver.com"
    */
  email: string;
  /** 유저 이름
   * @example "홍길동"
   */
  name: string;
    /** 유저 비밀번호 (로그인 시 사용) 
     * @example "password123" 
    */
  password: string; 
  /** 유저 성별
   * @example "남"
   */
  gender: string;
    /** 유저 생년월일 (문자열 또는 Date 객체)
     * @example "1990-01-01"
     */
  birth: string | Date;
  /** 유저 주소 (선택)
   *  @example "서울시 강남구 역삼동"
   */
  address?: string;
    /** 유저 상세 주소 (선택) 
     * @example "101동 202호"
    */
  detailAddress?: string;
    /** 유저 전화번호
     * @example "010-1234-5678"
     */
  phoneNumber: string;
   /** 선호 카테고리 ID 배열 (예: [1, 2]) 
    * @example [1, 2]
   */
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
  /** @example "example@naver.com" */
  email: string | null;
  /** @example "홍길동" */
  name: string | null;
  /** @example [1, 2] */
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