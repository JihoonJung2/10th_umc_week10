export interface ApiResponse<T> {
  resultType: "SUCCESS";
  error: null;
  data: T;
}
export interface UserErrorResponse {
  /** @example false */
  success: boolean;
  /** @example 409 */
  statusCode: number;
  data: null;
}
export interface StoreErrorResponse {
  /** @example false */
  success: boolean;
  /** @example 409 */
  statusCode: number;
  data: null;
}

export interface ReviewErrorResponse {
  /** @example false */
  success: boolean;
  /** @example 404 */
  statusCode: number;
  data: null;
}
export interface MissionErrorResponse {
  /** @example false */
  success: boolean;
  /** @example 404 */
  statusCode: number;
  data: null;
}
export const success = <T>(data: T): ApiResponse<T> => ({
  resultType: "SUCCESS",
  error: null,
  data,
});