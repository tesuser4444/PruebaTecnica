/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SuccessResponse {
    message: string;
    token?: string;
  }
  
  export interface ValidationError {
    error: { message?: string; errors?: any[] };
  }
  
  export type ApiResponse = SuccessResponse | ValidationError;
  