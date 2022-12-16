import { Switch } from "@headlessui/react";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ModalToggleActive from "../../../components/ModalToggleActive";
import { clinicsAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { uploadImageProduct } from "../../../utils/funtions";
import { Clinic, OpenModal } from "../../../utils/types";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ClinicPage() {
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const [openModalToggle, setOpenModalToggle] = useState<boolean>(false);
  const [selectedToggle, setSelectedToggle] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  const dispatch = useDispatch();

  const getAllClinic = async () => {
    let { data: clinics, error } = await supabase
      .from(" clinics")
      .select("*")
      .eq("active", true);
    if (error) {
      toast(error.message);
      return;
    }
    if (clinics && clinics.length > 0) {
      dispatch(clinicsAction("clinics", clinics));
    }
  };
  useEffect(() => {
    if (!clinics) {
      getAllClinic();
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Cở sở</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <main>
        {clinics ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">
                  Danh sách phòng khám
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Dánh sách thông tin tất cả phòng khám. Thông tin sẽ được hiển thị trên 3
                  MiniApp.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Link href="/dashboard/clinics/create-clinic">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Thêm phòng khám
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
                          className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                        >
                          STT
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900"
                        >
                          Tên phòng khám
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900"
                        >
                          Hình ảnh
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900"
                        >
                          Địa chỉ
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900 whitespace-nowrap"
                        >
                          Vị trí
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900"
                        >
                          Mô tả
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                        >
                          Trạng thái
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clinics.map((clinic: Clinic, index: number) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                            {clinic.name}
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            <div className="w-24 h-16">
                              <img
                                className="w-full h-full rounded"
                                src={clinic.avatar}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-3 text-sm text-gray-500">
                            {clinic.address}
                          </td>
                          <td className="py-4 px-3 text-sm text-gray-500 whitespace-nowrap">
                            {clinic.district ? clinic.district : "Chưa cập nhật"}
                          </td>
                          <td className="py-4 px-3 text-sm text-gray-500">
                            <span className="mint-ellipsis-three">
                              {clinic.description}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Switch
                              checked={clinic.active}
                              onClick={() => {
                                setSelectedToggle({
                                  id: clinic.id,
                                  status: !clinic.active,
                                });
                                setOpenModalToggle(true);
                              }}
                              className={classNames(
                                clinic.active ? "bg-indigo-600" : "bg-gray-200",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  clinic.active ? "translate-x-5" : "translate-x-0",
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                            {/* <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                clinic.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {clinic.active ? "Đang hoạt động" : "Không hoạt động"}
                            </span> */}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                            <div className="flex gap-3 ">
                              <Link href={`/dashboard/clinics/edit/${clinic.id}`}>
                                <div className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                  Chỉnh sửa
                                </div>
                              </Link>
                              {/* <div
                                className="text-red-500 cursor-pointer"
                                onClick={() => {
                                  setSelectedDeleteId(clinic.id);
                                  setOpenModalDelete(true);
                                }}
                              >
                                Xoá
                              </div> */}
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
        {openModalToggle && selectedToggle && (
          <ModalToggleActive
            id={selectedToggle.id}
            status={selectedToggle.status}
            title="phòng khám"
            type="clinics"
            setOpenModalToggle={setOpenModalToggle}
          />
        )}
      </main>
    </div>
  );
}
