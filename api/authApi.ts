import { AxiosResponse } from "axios";
import requestAPI from "./requestApi";

const AUTH_API = "/api/v1/auth";
class AuthAPI {
  static async loginWithPhone(phone: string, password: string) {
    try {
      const response = await requestAPI({
        url: `${AUTH_API}/login`,
        method: "POST",
        data: {
          phone: phone,
          password: password,
        },
      });
      console.log(response);
      return response;
    } catch (error: any) {
      return error.response;
    }
  }
  static async updatePassword(phone: string, oldPassword: string, newPassword: string) {
    try {
      const response = await requestAPI({
        url: `${AUTH_API}/update-password`,
        method: "POST",
        data: {
          phone: phone,
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
      });
      return response;
    } catch (error: any) {
      return error.response;
    }
  }
  static async getStaffInfo() {
    try {
      const response = await requestAPI({
        url: `${AUTH_API}/staffInfo`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      return response;
    } catch (error: any) {
      return error.response;
    }
  }
}
export default AuthAPI;
