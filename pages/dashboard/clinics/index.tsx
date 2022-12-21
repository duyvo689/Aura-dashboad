import { Switch } from "@headlessui/react";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CountRecord from "../../../components/CountRecord";
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
      {clinics ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">Chi nhánh ✨</div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                <svg
                  className="w-4 h-4 fill-current opacity-50 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <Link href="/dashboard/clinics/create-clinic">
                  <span className="hidden xs:block ml-2">Thêm chi nhánh</span>
                </Link>
              </button>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="w-full overflow-x-auto relative shadow-md sm:rounded-lg">
              <CountRecord amount={clinics.length} title={"Danh sách banner"} />
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
                      Tên phòng khám
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
                      Địa chỉ
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Vị trí
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Mô tả
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Trạng thái
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
                  {clinics && clinics.length > 0 ? (
                    clinics.map((item, index) => (
                      <tr
                        key={item.id}
                        className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700"
                      >
                        <td className="whitespace-nowrap py-3 px-2 ">{index + 1}</td>
                        <td className="whitespace-nowrap py-3 px-2 ">{item.name}</td>
                        <td className="whitespace-nowrap py-3 px-2 ">
                          <div className="w-24 h-16 mx-auto">
                            <img
                              className="w-full h-full rounded"
                              src={item?.avatar || "../images/default-avatar.png"}
                              alt={item?.name}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2 ">
                          <span className="min-ellipsis-three text-left">
                            {item?.address}
                          </span>
                        </td>
                        <td className="whitespace-nowrap  py-3 px-2 ">
                          {item?.district}
                        </td>
                        <td className=" py-3 px-2 ">
                          <span className="min-ellipsis-three text-left">
                            {item.description}
                          </span>
                        </td>
                        <td className="py-3 px-2 ">
                          <Switch
                            checked={item.active}
                            onClick={() => {
                              setSelectedToggle({
                                id: item.id,
                                status: !item.active,
                              });
                              setOpenModalToggle(true);
                            }}
                            className={classNames(
                              item.active ? "bg-indigo-600" : "bg-gray-200",
                              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                item.active ? "translate-x-5" : "translate-x-0",
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </td>
                        <td className="relative whitespace-nowrap py-3 px-2">
                          <div className="flex gap-3 cursor-pointer justify-center">
                            <Link href={`/dashboard/clinics/edit/${item?.id}`}>
                              <div className="text-indigo-600 hover:text-indigo-900">
                                Chỉnh sửa
                                <span className="sr-only">, {item?.id}</span>
                              </div>
                            </Link>
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

      {openModalToggle && selectedToggle && (
        <ModalToggleActive
          id={selectedToggle.id}
          status={selectedToggle.status}
          title="phòng khám"
          type="clinics"
          setOpenModalToggle={setOpenModalToggle}
        />
      )}
    </div>
  );
}
