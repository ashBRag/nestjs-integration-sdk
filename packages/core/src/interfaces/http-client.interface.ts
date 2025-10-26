// packages/core/src/interfaces/http-client.interface.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IHttpRequest {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

export interface IHttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface IHttpClient {
  request<T = unknown>(config: IHttpRequest): Promise<IHttpResponse<T>>;
}
