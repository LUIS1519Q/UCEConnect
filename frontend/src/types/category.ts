export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface GetCategoriesResponse {
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}