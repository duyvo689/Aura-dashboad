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
      <main>
        {banners ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">
                  Banners({banners.length})
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
                          HÌNH ẢNH
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                        >
                          LINK LIÊN KẾT
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                        >
                          NGÀY TẠO
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                        >
                          HÀNH ĐỘNG
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {banners.map((banner: Banner, index: number) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                            {index + 1}
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
                            <div className="flex gap-3 cursor-pointer">
                              <Link href={`/dashboard/banners/edit/${banner.id}`}>
                                <div className="text-indigo-600 hover:text-indigo-900">
                                  Chỉnh sửa
                                  <span className="sr-only">, {banner.id}</span>
                                </div>
                              </Link>
                              <div
                                className="text-red-500"
                                onClick={() => {
                                  setSelectedDeleteId(banner.id);
                                  setOpenModalDelete(true);
                                }}
                              >
                                Xoá
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
        {openModalDelete && selectedDeleteId && (
          <ModalDelete
            id={selectedDeleteId}
            title="banner"
            type="banners"
            setOpenModalDelete={setOpenModalDelete}
          />
        )}
      </main>
    </>
  );
}
export default BannerPage;
