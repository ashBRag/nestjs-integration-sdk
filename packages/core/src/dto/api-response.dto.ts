// packages/core/src/dto/api-response.dto.ts

export class ApiResponseDto<T = unknown> {
  success: boolean;
  data?: T;
  error?: ErrorDto;
  metadata?: ResponseMetadata;
}

export class ErrorDto {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
  timestamp: number;
}

export class ResponseMetadata {
  timestamp: number;
  requestId?: string;
  cached?: boolean;
  duration?: number;
}

// packages/core/src/dto/pagination.dto.ts

export class PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationDto;
}
