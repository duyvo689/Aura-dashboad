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
  const [file, setFile] = useState<any>();

  let banners: Banner[] = useSelector((state: RootState) => state.banners);
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

  const addNewBanner = async (event: any) => {
    try {
      setLoad(true);
      event.preventDefault();
      const link = event.target.elements.link.value;
      const _urlImg = await uploadImageProduct(image, "banners");
      const { data, error } = await supabase
        .from("banners")
        .insert([{ link: link, image_url: _urlImg }])
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        banners.push(data);
        toast.success(`Đã thêm ${name}`);
        setLink("");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  const updateBanner = async (event: any, id: string) => {
    try {
      setLoadEdit(true);
      event.preventDefault();
      const _link = event.target.elements.newLink.value;
      let _image = toggle.value.img;
      if (file) {
        _image = (await uploadImageProduct(file, "banners")) as string;
      }
      const { data, error } = await supabase
        .from("banners")
        .update({ link: _link, image_url: _image })
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
        setFile(null);
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

  const handleDelete = async (id: string) => {
    try {
      setLoadDelete({ load: true, id: id });
      const { data, error } = await supabase.from("banners").delete().eq("id", id);
      if (error != null) {
        toast.error(error.message);
      } else {
        toast.success(`Đã xoá banner`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadDelete({ load: false, id: "" });
      const newBanners = banners.filter((banner) => banner.id !== id);
      dispatch(bannersAction("banners", newBanners));
    }
  };
  return (
    <>
      <Head>
        <title>Banner</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex gap-6 mt-4 mx-6">
        <div className="flex-1">
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

        {/* BEEN PHAI */}
        <div className="flex-1 overflow-x-auto relative shadow-md sm:rounded-lg mt-8">
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
                            <div className="h-10 w-12 cursor-pointer">
                              <img
                                onClick={handleClick}
                                className="w-full h-full rounded-md object-cover"
                                src={file ? URL.createObjectURL(file) : item.image_url}
                              />
                            </div>
                          </Tippy>
                          <input
                            ref={upImg}
                            type="file"
                            hidden
                            multiple
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                          />
                        </>
                      ) : (
                        <Tippy content="Nháy đúp chuột để chỉnh sửa">
                          <img
                            src={item.image_url}
                            className="h-10 w-12 rounded-md object-cover"
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
                                  setFile(null);
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
      </div>
    </>
  );
}
export default BannerPage;
