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
  
  export const uploadImageProduct = async (image: any, bucket:string) => {
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