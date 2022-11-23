/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ButtonChangeImageAndVideo } from "../../../components/button";
import { InputFileImage } from "../../../components/InputFileImage";
import Head from "next/head";
import { supabase } from "../../../services/supaBaseClient";
import toast from "react-hot-toast";
import { Clinic } from "../../../utils/types";
import { RootState } from "../../../redux/reducers";
import { clinicsAction } from "../../../redux/actions/ReduxAction";

function CreateClinic() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const IMAGE_BASE_URL: string = `${BASE_URL}/storage/v1/object/public/avatar/avatar_clinic/`;
  const addMore = async () => {
    window.location.reload();
  };
  const upLoadFile = async (file: File) => {
    const { data, error } = await supabase.storage
      .from("/avatar/avatar_clinic")
      .upload(`/${file.name}`, file, {
        upsert: true,
      });
    if (error) {
      toast.error(error.message);
      return;
    } else if (data) {
      return data.path;
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (!fileAvatar) {
      toast.error("Error");
      return;
    }
    const imageSrc = await upLoadFile(fileAvatar);
    if (!imageSrc) {
      toast.error("Error");
      return;
    }
    const { data, error } = await supabase.from(" clinics").insert([
      {
        name: e.target.name.value,
        avatar: IMAGE_BASE_URL + imageSrc,
        address: e.target.address.value,
        description: e.target.discription.value,
      },
    ]);
    if (error) {
      toast.error(error.message);
      setMessage(false);
    } else {
      setMessage(true);
    }
    setIsLoading(false);
  };
  return (
    <div className="w-full bg-gray-50 relative overflow-y-auto ">
      <Head>
        <title>Create Clinic </title>
        <meta property="og:title" content="Create Banner" key="title" />
      </Head>
      <main>
        <div className="px-4 bg-white block ">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              {avatar ? (
                <div
                  className="relative block"
                  style={{
                    paddingTop: "56.25%",
                  }}
                >
                  <img
                    src={avatar}
                    alt="backGround"
                    className="flex flex-col absolute top-0 w-full h-full justify-center items-center bg-gray-50 rounded-lg"
                  />
                  <ButtonChangeImageAndVideo
                    title={"Đổi ảnh"}
                    setFileImage={setFileAvatar}
                    setImage={setAvatar}
                  />
                </div>
              ) : (
                <>
                  <InputFileImage
                    title="clinic cover"
                    setImage={setAvatar}
                    setFileImage={setFileAvatar}
                  />
                </>
              )}
            </div>
            <div className="mt-4  grid md:grid-cols-2 grid-cols-1 gap-4">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 required"
                >
                  Tên Phòng Khám
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Vd: Aura Cơ Sở 1"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 required"
                >
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Vd: Quận 3, Tp.HCM"
                  required
                />
              </div>
            </div>
            <div className="mt-4 required">Mô tả</div>
            <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
              <div className="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                <textarea
                  id="discription"
                  name="discription"
                  rows={8}
                  className="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:outline-none  dark:text-white dark:placeholder-gray-400"
                  placeholder="Thông tin mô tả"
                  required
                ></textarea>
              </div>
            </div>
            {message === null ? null : message ? (
              <div
                className="p-4 my-4 text-sm text-primary bg-green-100 rounded-lg "
                role="alert"
              >
                <span className="font-bold">Thành công!!!</span> Tạo mới thành
                công
              </div>
            ) : (
              <div
                className="p-4 my-4 text-sm text-red-500 bg-red-100 rounded-lg "
                role="alert"
              >
                <span className="font-bold">Thất bại!!!</span> Tạo mới thất bại
              </div>
            )}
            <div className="flex justify-end">
              {message !== null ? (
                <div
                  className="cursor-pointer flex items-center text-white bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                  onClick={addMore}
                >
                  Thêm mới
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
                  Đang tạo...
                </div>
              ) : (
                <button
                  type="submit"
                  className="mt-4 text-white bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                  Tạo mới
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
export default CreateClinic;