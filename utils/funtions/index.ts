import moment from "moment";
import { supabase } from "../../services/supaBaseClient";

export const createImgId = () => {
  var result = "";
  var characters = "abcdefgh0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const uploadImageProduct = async (image: any, bucket: string) => {
  try {
    if (image) {
      const fileExt = image.name.split(".").pop();
      const filePath = `${createImgId()}.${fileExt}`;
      let { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, image, { upsert: true });
      if (uploadError) {
        console.log(uploadError);
      }
      const publicUrl = await supabase.storage.from(bucket).getPublicUrl(filePath);
      return publicUrl.data.publicUrl;
    }
  } catch (error) {
    console.log(error);
  }
};

// HÀM CHECK XEM PHẢI SỐ ĐIỆN THOẠI?
export const validatePhoneNumber = (phone: string) => {
  let isValidPhoneNumber = true;
  // if (!(phone.match('[0-9]{10}'))) {
  //   isValidPhoneNumber = false
  // }
  // if (phone.length > 10) {
  //   isValidPhoneNumber = false

  // }
  // var fPhone = phone.charAt(0);
  // if (fPhone != '0') {
  //   isValidPhoneNumber = false
  // }

  return isValidPhoneNumber;
};

export const CompareTwoDates = (date1: any, date2: any) => {
  let difference = moment(date1).isAfter(date2, 'day')
  console.log(difference)
  return difference
}