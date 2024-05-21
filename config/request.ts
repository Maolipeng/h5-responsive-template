import { Toast } from 'antd-mobile';
import type { AxiosResponse, RequestConfig, RequestOptions } from 'umi';

export const errorConfig: RequestConfig = {
  // @ts-ignore
  errorThrower: (res) => {
    return res;
  },
  // 错误接收及处理
  errorHandler: (error: any, opts: any) => {
    if (opts?.skipErrorHandler) throw error;
    const { response } = error;
    const { status } = response;
    console.log('status', status);
  },
};
// This function is used to customize the request
export const requestIc = (url: string, options: RequestOptions) => {
  return {
    url,
    options,
  };
};

// This function is used to customize the response
export const responseIc = (response: AxiosResponse) => {
  const { config } = response;
  const { code, msg } = response?.data;

  if (code !== 0) {
    Toast.show({
      content: msg,
      position: 'top',
    });
  }
  return response;
};

// These are the request interceptors
export const requestInterceptors = [requestIc];

// These are the response interceptors
export const responseInterceptors = [responseIc];

// This is the request custom configuration
export const requestCusConfig: RequestConfig = {
  // @ts-ignore
  errorConfig,
  requestInterceptors: [requestIc],

  // Response interceptors
  responseInterceptors: [responseIc as any],
};
