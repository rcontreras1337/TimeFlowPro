/**
 * Common types used across the application
 */

/** API Response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

/** API Error structure */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Pagination params */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/** Pagination response metadata */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sort params */
export interface SortParams {
  orderBy?: string;
  orderDir?: SortDirection;
}

/** Date range filter */
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

/** Common entity fields */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** Soft deletable entity */
export interface SoftDeletable {
  deletedAt: string | null;
  isDeleted: boolean;
}

