import { useState } from "react";
import { ButtonChangeImageAndVideo } from "../button";
import { InputFileImage } from "../InputFileImage";
import Head from "next/head";
import { supabase } from "../../services/supaBaseClient";
import toast from "react-hot-toast";
import { Banner } from "../../utils/types";
import { bannersAction } from "../../redux/actions/ReduxAction";
import { useDispatch, useSelector } from "react-redux";
const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const IMAGE_BASE_URL: string = `${BASE_URL}/storage/v1/object/public/banners/`;
interface Props {
  banners: Banner[];
}
function CreateBannerForm({ banners }: Props) {
  const [banner, setBanner] = useState<string | null>(null);
  const [fileBanner, setFileBanner] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean | null>(null);
  const dispatch = useDispatch();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (!fileBanner) return;
    console.log(fileBanner);
    // const { data, error } = await supabase.storage
    //   .from("banners")
    //   .upload(`/${fileBanner.name}`, fileBanner, {
    //     upsert: true,
    //   });
    // if (error) {
    //   toast.error(error.message);
    //   return;
    // }
    // if (data && data.path) {
    //   const { data: banners, error: getBannersError } = await supabase
    //     .from("banners")
    //     .select("*");
    //   if (getBannersError) {
    //     toast.error(getBannersError.message);
    //     return;
    //   }
    //   const { data: newBanner, error: newBannerError } = await supabase
    //     .from("banners")
    //     .insert([
    //       {
    //         image_url: IMAGE_BASE_URL + data.path,
    //         order: banners?.length + 1,
    //       },
    //     ]);
    //   if (newBannerError) {
    //     setMessage(false);
    //     setIsLoading(false);
    //     return;
    //   }
    //   // if upload file sucesss
    //   banners.push({
    //     image_url: IMAGE_BASE_URL + data.path,
    //     order: banners?.length + 1,
    //   });
    //   dispatch(bannersAction("banners", banners));
    //   setIsLoading(false);
    //   setMessage(true);
    // }
  };
  const addMore = async () => {
    setFileBanner(null);
    setBanner(null);
    setMessage(null);
  };
  return (
    <div className="w-full bg-gray-50 relative overflow-y-auto ">
      <Head>
        <title>Create Banner</title>
        <meta property="og:title" content="Create Banner" key="title" />
      </Head>
      <main>
        <div className="p-4 bg-white block ">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              {banner ? (
                <div
                  className="relative block"
                  style={{
                    paddingTop: "56.25%",
                  }}
                >
                  <img
                    src={banner}
                    alt="backGround"
                    className="flex flex-col absolute top-0 w-full h-full justify-center items-center bg-gray-50 rounded-lg"
                  />
                  <ButtonChangeImageAndVideo
                    title={"?????i ???nh"}
                    setFileImage={setFileBanner}
                    setImage={setBanner}
                  />
                </div>
              ) : (
                <>
                  <InputFileImage
                    title={"image"}
                    setImage={setBanner}
                    setFileImage={setFileBanner}
                  />
                </>
              )}
            </div>
            {message === null ? null : message ? (
              <div
                className="p-4 my-4 text-sm text-primary bg-green-100 rounded-lg "
                role="alert"
              >
                <span className="font-bold">Th??nh c??ng!!!</span> T???o m???i th??nh c??ng
              </div>
            ) : (
              <div
                className="p-4 my-4 text-sm text-red-500 bg-red-100 rounded-lg "
                role="alert"
              >
                <span className="font-bold">Th???t b???i!!!</span> T???o m???i th???t b???i
              </div>
            )}
            <div className="flex justify-end">
              {message !== null ? (
                <div
                  className="cursor-pointer flex items-center text-white bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                  onClick={addMore}
                >
                  Th??m m???i
                </div>
              ) : isLoading ? (
                <div className="mt-4 flex items-center text-white bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline mr-1 w-4 h-4 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  ??ang t???o...
                </div>
              ) : (
                <button
                  type="submit"
                  className="mt-4 text-white bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                  T???o m???i
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
export default CreateBannerForm;
