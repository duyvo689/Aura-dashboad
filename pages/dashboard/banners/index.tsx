/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { Banner, Payment } from "../../../utils/types";
import { bannersAction, paymentAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";
import moment from "moment";
import { uploadImageProduct } from "../../../utils/funtions";
import { RootState } from "../../../redux/reducers";
import { XCircleIcon } from "@heroicons/react/24/outline";
import UploadCareAPI from "../../../services/uploadCareAPI";
import convertImg from "../../../utils/helpers/convertImg";
import ModalDelete from "../../../components/ModalDelete";
import Link from "next/link";

interface Toggle {
  index: number;
  isEdit: boolean;
  value: {
    img: string;
    link: string;
  };
}

interface LoadDelete {
  load: boolean;
  id: string;
}
function BannerPage() {
  const [link, setLink] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);
  const [loadEdit, setLoadEdit] = useState<boolean>(false);
  const [loadDelete, setLoadDelete] = useState<LoadDelete>({ load: false, id: "" });
  const [toggle, setToggle] = useState<Toggle>({
    index: -1,
    isEdit: false,
    value: {
      img: "",
      link: "",
    },
  });
  const upImg = useRef<any>(null);
  const [image, setImage] = useState<any>();
  const [uploadedImage, setUploadedImage] = useState<any>(); //update image banner if have
  let banners: Banner[] = useSelector((state: RootState) => state.banners);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
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
    getAllBanner();
  }, []);

  const updateBanner = async (event: any, id: string) => {
    try {
      setLoadEdit(true);
      event.preventDefault();
      const _link = event.target.elements.newLink.value;
      let _image = toggle.value.img;
      if (!uploadedImage) return;
      const uploadResponse = await UploadCareAPI.uploadImg(uploadedImage); //imageFile
      if (uploadResponse && uploadResponse.status === 200) {
        const { data, error } = await supabase
          .from("banners")
          .update({ link: _link, image_url: convertImg(uploadResponse.data.file) })
          .eq("id", id)
          .select()
          .single();
        if (error != null) {
          toast.error(error.message);
        } else {
          let index = banners.findIndex((item) => item.id == id);
          banners[index] = data;
          toast.success(`Đã sửa ${_link}`);
          setToggle({
            index: -1,
            isEdit: false,
            value: {
              img: "",
              link: "",
            },
          });
          setUploadedImage(null);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadEdit(false);
    }
  };

  const handleClick = () => {
    upImg.current.click();
  };

  return (
    <>
      <Head>
        <title>Banner</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {/* <div className="flex gap-6 mt-4 mx-6">
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
                          onChange={(e) => e.target.files && setImage(e.target.files[0])}
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
                  {load ? "ĐANG THÊM..." : "THÊM BANNER"}
                </button>
              )}
            </div>
          </form>
        </div>
     
        <div className="w-[60%] overflow-x-auto relative shadow-md sm:rounded-lg mt-8">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 text-center px-6">
                  STT
                </th>
                <th scope="col" className="py-3 px-6">
                  HÌNH
                </th>
                <th scope="col" className="py-3 px-6">
                  LINK
                </th>
                <th scope="col" className="py-3 px-6">
                  NGÀY TẠO
                </th>
                <th scope="col" className="py-3 text-right px-6">
                  HÀNH ĐỘNG
                </th>
              </tr>
            </thead>
            <tbody>
              {banners &&
                banners.length > 0 &&
                banners.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-white cursor-pointer  hover:bg-gray-100 border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <td className="py-4 text-center px-6">{index}</td>
                    <td className="py-4 px-6">
                      {index == toggle.index && toggle.isEdit ? (
                        <>
                          <Tippy content="Nháy chuột để chỉnh sửa ảnh">
                            <div className="h-14 w-16 cursor-pointer">
                              <img
                                onClick={handleClick}
                                className="w-full h-full rounded-md"
                                src={
                                  uploadedImage
                                    ? URL.createObjectURL(uploadedImage)
                                    : item.image_url
                                }
                              />
                            </div>
                          </Tippy>
                          <input
                            ref={upImg}
                            type="file"
                            hidden
                            multiple
                            onChange={(e) =>
                              e.target.files && setUploadedImage(e.target.files[0])
                            }
                          />
                        </>
                      ) : (
                        <Tippy content="Nháy đúp chuột để chỉnh sửa">
                          <div className="w-16 h-14">
                            <img
                              src={item.image_url}
                              className="w-full h-full rounded"
                              onDoubleClick={() =>
                                setToggle({
                                  index: index,
                                  isEdit: true,
                                  value: {
                                    ...toggle.value,
                                    img: item.image_url,
                                    link: item.link,
                                  },
                                })
                              }
                            />
                          </div>
                        </Tippy>
                      )}
                    </td>
                    {index == toggle.index && toggle.isEdit ? (
                      <th
                        scope="row"
                        className="py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <form onSubmit={(e) => updateBanner(e, item.id)}>
                          <div className="flex">
                            <input
                              autoFocus
                              type="text"
                              id="newLink"
                              name="newLink"
                              value={toggle.value.link}
                              aria-describedby="helper-text-explanation"
                              className="border rounded border-gray-300  text-gray-900 text-sm focus:ring-blue-400 focus:border-blue-400 block w-full min-w-[150px]"
                              placeholder="Đường link"
                              onChange={(e) =>
                                setToggle({
                                  index: index,
                                  isEdit: true,
                                  value: { ...toggle.value, link: e.target.value },
                                })
                              }
                            />
                            <span className="flex gap-2 ml-2 items-center">
                              <button
                                type="submit"
                                className="h-[30px] cursor-pointer hover:bg-red-500 border-gray-400 flex items-center rounded px-4 text-white bg-red-600"
                              >
                                Lưu
                              </button>

                              <span
                                className="cursor-pointer hover:bg-gray-300 h-[30px] border-gray-400 flex items-center rounded px-4 bg-gray-200"
                                onClick={() => {
                                  setToggle({
                                    index: -1,
                                    isEdit: false,
                                    value: {
                                      img: "",
                                      link: "",
                                    },
                                  });
                                  setUploadedImage(null);
                                }}
                              >
                                Huỷ
                              </span>
                            </span>
                          </div>
                        </form>
                      </th>
                    ) : (
                      <Tippy content="Nháy đúp chuột để chỉnh sửa">
                        <th
                          scope="row"
                          className="py-4 px-6 font-medium text-gray-900 whitespace-wrap dark:text-white"
                          onDoubleClick={() =>
                            setToggle({
                              index: index,
                              isEdit: true,
                              value: {
                                ...toggle.value,
                                link: item.link,
                                img: item.image_url,
                              },
                            })
                          }
                        >
                          {item.link ? item.link : "..."}
                        </th>
                      </Tippy>
                    )}
                    <td className="py-4  px-6">
                      {moment(item.created_at).format("DD/MM/YYYY")}
                    </td>
                    <td className="py-4 px-6 text-right text-white">
                      <button className="bg-green-500 px-3 py-[2px] rounded text-[12px] font-bold">
                        {loadDelete.load && loadDelete.id == item.id
                          ? "Đang xoá..."
                          : "Sửa"}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 px-3 py-[2px] rounded text-[12px] font-bold"
                      >
                        {loadDelete.load && loadDelete.id == item.id
                          ? "Đang xoá..."
                          : "Xoá"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div> */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Baners({banners.length})
            </h1>
            <p className="mt-2 text-sm text-gray-700">Danh sách các banner</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link href="/dashboard/banners/create-banner">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Thêm banner
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                    >
                      Hình ảnh
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Link liên kết
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Ngày tạo
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {banners.map((banner: Banner, index: number) => (
                    <>
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                          {index}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500 m-0">
                          <img src={banner.image_url} className="w-40" />
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                          {banner.link}
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                          {moment(banner.created_at).format("DD/MM/YYYY")}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                          <div className="flex gap-3">
                            <div
                              className="text-red-500"
                              onClick={() => {
                                setOpenModalDelete(true);
                              }}
                            >
                              Xoá
                            </div>
                            <a href="#" className="text-green-600 hover:text-green-900">
                              Edit<span className="sr-only">, {banner.id}</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                      {openModalDelete && (
                        <ModalDelete
                          id={banner.id}
                          title="banner"
                          type="banners"
                          setOpenModalDelete={setOpenModalDelete}
                        />
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default BannerPage;
