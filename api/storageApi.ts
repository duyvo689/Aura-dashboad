import axios from "axios";
import requestAPI from "./requestApi";
const URL_STORAGE = "/api/v1/storage";
class StorageAPI {
  static getAccessKey = async () => {
    try {
      const response = await requestAPI({
        url: `${URL_STORAGE}/getStorageKey`,
        method: "GET",
      });
      if (response && response.status === 200) {
        return response.data.data.token;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  static async upload(accessKey: string, file: File) {
    const fileName = file.name.replace("wav", "mp3");
    let formData = new FormData();
    formData.append("file", file);
    console.log(accessKey);
    try {
      const response = await axios({
        method: "PUT",
        url: `https://hcm01.vstorage.vngcloud.vn/v1/AUTH_16700a411c8e4e3da18b8b42dbca2890/AudioStorage/${fileName}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Auth-Token": accessKey,
        },
      });
      if (response && response.status === 201) {
        return `https://hcm01.vstorage.vngcloud.vn/v1/AUTH_16700a411c8e4e3da18b8b42dbca2890/AudioStorage/${fileName}`;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
export default StorageAPI;
