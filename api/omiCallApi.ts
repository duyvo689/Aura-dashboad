import toast from "react-hot-toast";
import requestAPI from "./requestApi";

const URL_OMICALL = "/api/v1/omicall";
class OmiAPI {
  static async getOmiInfo(email: string) {
    try {
      const response = await requestAPI({
        url: `${URL_OMICALL}/getOmiInfo?email=${email}`,
        method: "GET",
      });
      if (response && response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  }
}
export default OmiAPI;
