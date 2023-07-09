import { http } from "@/utils/http";
import axios from "axios";

export type UserResult = {
  success: boolean;
  message: string;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

// export type RegisterResult = {
//   success: boolean;
//   message: string;
//   data: {
//     /** 用户名 */
//     username: string;
//     /** 当前登陆用户的角色 */
//     roles: Array<string>;
//     /** `token` */
//     accessToken: string;
//     /** 用于调用刷新`accessToken`的接口时所需的`token` */
//     refreshToken: string;
//     /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
//     expires: Date;
//   };
// };

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** Login */
export const getLogin = async (data?: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:9999/login/loginByUsername",
      {
        userName: data.username,
        password: data.password
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // console.log(error.response.data);
      return error.response;
    }
  }
};

export const getRegister = async (data?: {
  username: string;
  password: string;
  email: string;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:9999/register/registerByUsername",
      {
        userName: data.username,
        password: data.password,
        email: data.email
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response;
  }
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};
