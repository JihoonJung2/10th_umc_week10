import { pool } from "../../../db.config.js"; 
import { ResultSetHeader, RowDataPacket } from "mysql2";

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

// ID로 가게 정보를 조회하는 함수 (방금 추가한 가게 정보를 반환하기 위해)
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
export const addReview = async (storeId: number, userId: number, data: any): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO review (store_id, user_id, rating, comment) VALUES (?, ?, ?, ?);",
      [storeId, userId, data.rating, data.comment]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`리뷰 추가 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};

// 미션을 데이터베이스에 추가하는 함수
export const addMission = async (storeId: number, data: any): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO mission (store_id, content, point) VALUES (?, ?, ?);",
      [storeId, data.content, data.point]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`미션 추가 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};
