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
import CountRecord from "../../../components/CountRecord";

function BannerPage() {
  let banners: Banner[] = useSelector((state: RootState) => state.banners);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
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

  return (
    <>
      <Head>
        <title>Banner</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {banners ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">Banners ✨</div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                <svg
                  className="w-4 h-4 fill-current opacity-50 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="hidden xs:block ml-2">Thêm banner</span>
              </button>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="w-full overflow-x-auto relative shadow-md sm:rounded-lg">
              <CountRecord amount={banners.length} title={"Danh sách banner"} />
              <table className="w-full text-sm  text-gray-500 dark:text-gray-400">
                <thead className="bg-slate-100 text-slate-500 uppercase font-semibold text-xs border border-slate-200 ">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Hình ảnh
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Link liên kết
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Ngày tạo
                    </th>

                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-center">
                  {banners && banners.length > 0 ? (
                    banners.map((item, index) => (
                      <tr
                        key={item.id}
                        className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700"
                      >
                        <td className="whitespace-nowrap py-3 px-2 ">{index + 1}</td>
                        <td className="whitespace-nowrap py-3 px-2">
                          <div className="w-24 h-16 mx-auto">
                            <img
                              className="w-full h-full rounded"
                              src={item.image_url || "../images/default-avatar.png"}
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-3 px-2 ">{item?.link}</td>

                        <td className="whitespace-nowrap py-3 px-2 ">
                          {moment(item?.created_at).format("DD/MM/YYYY")}
                        </td>
                        <td className="relative whitespace-nowrap py-3 px-2">
                          <div className="flex gap-3 cursor-pointer justify-center">
                            <Link href={`/dashboard/banners/edit/${item?.id}`}>
                              <div className="text-indigo-600 hover:text-indigo-900">
                                Chỉnh sửa
                                <span className="sr-only">, {item?.id}</span>
                              </div>
                            </Link>
                            <div
                              className="text-red-500"
                              onClick={() => {
                                setSelectedDeleteId(item?.id);
                                setOpenModalDelete(true);
                              }}
                            >
                              Xoá
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700">
                      <td className="whitespace-nowrap py-3 px-2 ">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
export default BannerPage;
