import axios from "axios";
import FormData from "form-data";

const UPLOAD_CARE_PUBKEY = process.env.NEXT_PUBLIC_UPLOADCARE as string;
class UploadCareAPI {
  static async uploadImg(file: File) {
    const form = new FormData();
    form.append("UPLOADCARE_PUB_KEY", UPLOAD_CARE_PUBKEY);
    form.append("UPLOADCARE_STORE", "1");
    form.append("file", file);
    try {
      const response = await axios({
        method: "post",
        url: "https://upload.uploadcare.com/base/",
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (err) {
      return;
    }
  }
}
export default UploadCareAPI;
