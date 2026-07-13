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
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}