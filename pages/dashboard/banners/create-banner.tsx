import { XCircleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { bannersAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import UploadCareAPI from "../../../services/uploadCareAPI";
import convertImg from "../../../utils/helpers/convertImg";
import { Banner } from "../../../utils/types";

function CreateBanner() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const banners: Banner[] = useSelector((state: RootState) => state.banners);
  const router = useRouter();
  const dispatch = useDispatch();
  const getAllBanner = async () => {
    let { data: banners, error } = await supabase.from("banners").select("*");
    if (error) {
      toast(error.message);
      return;
    }
    if (banners && banners.length > 0) {
      dispatch(bannersAction("banners", banners));
    }
  };
  useEffect(() => {
    if (!banners) {
      getAllBanner();
    }
  }, [banners]);
  const addNewBanner = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    if (!banners) {
      return;
    }
    if (!bannerImage) {
      toast("Vui lòng chọn hình ảnh");
    } else {
      const link = event.target.elements.link.value;
      const uploadResponse = await UploadCareAPI.uploadImg(bannerImage); //imageFile
      if (uploadResponse && uploadResponse.status === 200) {
        // const _urlImg = await uploadImageProduct(image, "banners");
        const { data, error } = await supabase
          .from("banners")
          .insert([{ link: link, image_url: convertImg(uploadResponse.data.file) }])
          .select()
          .single();
        if (error) {
          toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } else {
          banners.push(data);
          console.log(banners);
          dispatch(bannersAction("banners", banners));
          toast.success(`Thêm banner thành công`);
          router.push("/dashboard/banners");
        }
      }
    }
    setIsLoading(false);
  };
  return (
    <div className="px-4">
      <form className="space-y-8 divide-y divide-gray-200" onSubmit={addNewBanner}>
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Tạo banner</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Tạo banner cho Aura ID App. Thông tin sẽ được hiển thị trên Aura ID app.
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
                {bannerImage ? (
                  <div className="h-24 relative">
                    <img
                      src={URL.createObjectURL(bannerImage)}
                      className="h-full w-full rounded-lg  object-cover"
                    />

                    <div
                      className="absolute h-7 w-7 -top-4 -right-4 cursor-pointer"
                      onClick={() => setBannerImage(null)}
                    >
                      <XCircleIcon />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload hình ảnh</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={(e) =>
                            e.target.files && setBannerImage(e.target.files[0])
                          }
                        />
                      </label>
                      <p className="pl-1">(kéo hoặc thả)</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
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
              {isLoading ? "Đang tạo..." : "Tạo mới"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default CreateBanner;
