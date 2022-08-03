export interface RequestConfig {
  url?: string;
  method?: string;
  baseURL?: string;
  headers?: any;
  config?: any;
  params?: any;
  data?: any;
  body?: any;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  socketPath?: string | null;
}

export interface IResponse {
  data?: any;
  status: number;
  statusText: string;
  headers: any;
  request?: any;
}
