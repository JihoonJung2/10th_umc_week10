import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";

// 1. User 데이터 삽입
export const addUser = async (data: any): Promise<number | null> => {
  const conn = await pool.getConnection();

  try {
    // [confirm] 뒤에 타입을 명시해 줍니다. (조회 결과는 배열 형태예요)
    const [confirm] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`,
      [data.email]
    );

    // 이제 confirm[0] 뒤에 점을 찍어도 에러가 나지 않아요!
    if (confirm[0]?.isExistEmail) {
      return null;
    }

    // 삽입 결과는 ResultSetHeader 타입을 사용합니다.
    const [result] = await pool.query<ResultSetHeader>(
      // 1. password 컬럼 추가
      `INSERT INTO user (email, name, password, gender, birth, address, detail_address, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.name,
        data.password, // 2. 해시된 비밀번호를 배열에 추가
        data.gender,
        data.birth,
        data.address,
        data.detailAddress,
        data.phoneNumber,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

// 2. 사용자 정보 얻기
export const getUser = async (userId: number): Promise<any | null> => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM user WHERE id = ?;`,
      [userId]
    );

    if (user.length === 0) {
      return null;
    }

    return user[0]; // 배열의 첫 번째 요소(유저 정보)를 반환합니다.
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

// 3. 음식 선호 카테고리 매핑 (ENUM 방식 적용)
export const setPreference = async (userId: number, category: string): Promise<void> => {
  const conn = await pool.getConnection();

  try {
    // 1. 테이블명: favorite_food
    // 2. 컬럼명: category (또는 정하신 컬럼명), user_id
    await pool.query(
      `INSERT INTO favorite_food (favorite_food, user_id) VALUES (?, ?);`,
      [category, userId] // 숫자가 아닌 '한식', '일식' 같은 문자열이 들어갑니다.
    );
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
// 4. 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId: number): Promise<any[]> => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query<RowDataPacket[]>(
    "SELECT id, favorite_food, user_id " +
      "FROM favorite_food " +
      "WHERE user_id = ? ORDER BY favorite_food ASC;",
      [userId]
    );

    return preferences as any[];
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
// 가게를 데이터베이스에 추가하는 함수
export const addStore = async (regionId: number, data: any): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO store (name, food_category, region_id) VALUES (?, ?, ?);",
      [data.name, data.foodCategory, regionId]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`가게 추가 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};

// ID로 가게 정보를 조회하는 함수 
export const getStoreById = async (storeId: number): Promise<any> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT s.id, s.name, s.food_category, r.name as region_name 
       FROM store s
       JOIN region r ON s.region_id = r.id
       WHERE s.id = ?;`,
      [storeId]
    );
    return rows[0];
  } catch (err) {
    throw new Error(`가게 조회 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};

// 사용자가 특정 미션에 이미 도전 중인지 확인하는 함수
export const isMissionChallenged = async (userId: number, missionId: number): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT EXISTS(SELECT 1 FROM user_mission WHERE user_id = ? AND mission_id = ? And status = 'challenging') as isExist;",
      [userId, missionId]
    );
    return rows && rows[0] ? rows[0].isExist === 1 : false; // 1이면 true(존재), 0이면 false(존재하지 않음)
  } catch (err) {
    throw new Error(`미션 도전 여부 확인 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};

// 사용자의 미션 도전을 데이터베이스에 추가하는 함수
export const challengeMission = async (userId: number, missionId: number): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO user_mission (user_id, mission_id, status) VALUES (?, ?, 'challenging');",
      [userId, missionId]
    );
    return result.insertId;
  } catch (err) {
    // Foreign key 오류 (존재하지 않는 사용자 또는 미션)는 여기서 잡힐 수 있습니다.
    throw new Error(`미션 도전 추가 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};

