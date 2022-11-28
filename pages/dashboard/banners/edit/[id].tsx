/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { bannersAction } from "../../../../redux/actions/ReduxAction";
import { RootState } from "../../../../redux/reducers";
import { supabase } from "../../../../services/supaBaseClient";
import UploadCareAPI from "../../../../services/uploadCareAPI";
import convertImg from "../../../../utils/helpers/convertImg";
import { Banner } from "../../../../utils/types";

function UpdateBanner() {
  const { id } = useRouter().query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newBannerImg, setNewBannerImg] = useState<File | null>(null);
  const banners: Banner[] = useSelector((state: RootState) => state.banners);
  const [banner, setBanner] = useState<Banner | null>(null);
  const dispatch = useDispatch();
  const fetchBannerById = async () => {
    let { data: banner, error } = await supabase
      .from("banners")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      toast("Lỗi. Thử lại.");
      return;
    } else if (banner) {
      setBanner(banner);
    }
  };
  const getAllBanner = async () => {
    let { data: banners, error } = await supabase.from("banners").select("*");
    if (error) {
      toast("Lỗi. Thử lại.");
      return;
    }
    if (banners && banners.length > 0) {
      console.log(banners);
      dispatch(bannersAction("banners", banners));
    }
  };
  const updateBanner = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    if (!banners || !banner) {
      return;
    } else {
      let updateImage = banner.image_url; //default
      const link = event.target.elements.link.value;
      if (newBannerImg) {
        const uploadResponse = await UploadCareAPI.uploadImg(newBannerImg); //imageFile
        if (uploadResponse && uploadResponse.status === 200) {
          updateImage = convertImg(uploadResponse.data.file);
        } else {
          toast("Lỗi. Thử lại.");
          return;
        }
      }
      // const _urlImg = await uploadImageProduct(image, "banners");
      const { data, error } = await supabase
        .from("banners")
        .update({ link: link, image_url: updateImage })
        .eq("id", id)
        .select()
        .single();
      if (error) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      } else {
        let index = banners.findIndex((item) => item.id == id);
        banners[index] = data;
        dispatch(bannersAction("banners", banners));
        toast.success(`Cập nhật banner thành công`);
        router.push("/dashboard/banners");
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (!id) return;
    fetchBannerById();
  }, [id]);
  useEffect(() => {
    if (!banners) {
      getAllBanner();
    }
  }, []);
  return (
    <div className="px-4">
      {banner ? (
        <form className="space-y-8 divide-y divide-gray-200" onSubmit={updateBanner}>
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Cập nhật dữ liệu cho banner
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Thông tin sẽ được hiển thị trên Aura ID app.
                </p>
              </div>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Link liên kết (Nếu có)
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg rounded-md shadow-sm">
                    <input
                      type="text"
                      name="link"
                      id="link"
                      defaultValue={banner.link}
                      placeholder="Đường dẫn liên kết cho banner"
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 required"
              >
                Hình ảnh banner
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  {banner && (
                    <div className="flex items-end gap-3">
                      <div className="h-24">
                        {newBannerImg ? (
                          <img
                            src={URL.createObjectURL(newBannerImg)}
                            className="h-full w-full rounded-lg  object-cover"
                          />
                        ) : (
                          <img
                            src={banner.image_url}
                            className="h-full w-full rounded-lg  object-cover"
                          />
                        )}
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Đổi ảnh mới
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) =>
                              e.target.files && setNewBannerImg(e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type={isLoading ? "button" : "submit"}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
export default UpdateBanner;
