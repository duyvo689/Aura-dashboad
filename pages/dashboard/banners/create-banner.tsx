import { XCircleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
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
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<any>();
  const [link, setLink] = useState("");
  const banners: Banner[] = useSelector((state: RootState) => state.banners);
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
    if (!banners) return;
    getAllBanner();
  }, []);
  const addNewBanner = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    const link = event.target.elements.link.value;
    const uploadResponse = await UploadCareAPI.uploadImg(image); //imageFile
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
        toast.success(`Đã thêm ${name}`);
      }
    }
    setIsLoading(false);
  };
  return (
    <div className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
      <Head>
        <title>Tạo Banner</title>
        <meta property="og:title" content="Tạo banner" key="title" />
      </Head>
      <main>
        <div className="flex gap-6 mt-4 mx-6">
          <div className="w-[40%]">
            <form onSubmit={addNewBanner}>
              <div className="sm:col-span-6 mt-4">
                <label
                  htmlFor="photo"
                  className="block text-sm font-bold text-gray-700 mb-4"
                >
                  THÊM HÌNH
                </label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  {image ? (
                    <div className="h-24 relative">
                      <img
                        src={URL.createObjectURL(image)}
                        className="h-full w-full rounded-lg  object-cover"
                      />
                      <div
                        className="absolute h-7 w-7 -top-4 -right-4"
                        onClick={() => setImage(null)}
                      >
                        <XCircleIcon />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center ">
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
                          <span>Đăng tải hình ảnh</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={(e) =>
                              e.target.files && setImage(e.target.files[0])
                            }
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <label
                htmlFor="helper-text"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white mt-6"
              >
                NHẬP LINK
              </label>
              <input
                type="link"
                id="link"
                name="link"
                value={link}
                aria-describedby="helper-text-explanation"
                className="bg-gray-50 mt-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Link (*Không bắt buộc)"
                onChange={(e) => setLink(e.target.value)}
              />
              <div className="justify-end flex mt-4">
                {!image ? (
                  <p className="text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                    THÊM BANNER
                  </p>
                ) : (
                  <button
                    type={"submit"}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    {isLoading ? "ĐANG THÊM..." : "THÊM BANNER"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
export default CreateBanner();
