export interface ApiMessageResponse {
  code?: string;
  message: string;
}

export interface ApiValidationError {
  code?: string;
  message: string;
  errors: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}