import { Plugin } from '@nuxt/types';
import { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

import { initializeAxios } from '~/utils/api';

const accessor: Plugin = ({ error, app: { $axios } }) => {
  // 此处调用
  initializeAxios($axios);

  $axios.onRequest((config: AxiosRequestConfig) => {
    // ...
    return config;
  });

  $axios.onError((e: AxiosError<any>) => {
    // ...
    console.log('e', e);
  });

  // response拦截器，数据返回后，你可以先在这里进行一个简单的判断
  $axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      const res = response;
      if (res.status === 200) {
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    },
    (e: any) => {
      const { status, data } = e.response;
      error({ statusCode: status, message: data });
      return Promise.reject(e);
    }
  );
};

export default accessor;
