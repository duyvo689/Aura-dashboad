import Head from "next/head";
import Link from "next/link";
import react, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ModalDelete from "../../../components/ModalDelete";
import { categoryAction, servicesAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { convertVnd } from "../../../utils/helpers/convertToVND";
import { Category, Service } from "../../../utils/types";

export default function ServicePage() {
  const services: Service[] = useSelector((state: RootState) => state.services);
  const categories: Category[] = useSelector((state: RootState) => state.category);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [filterService, setFilterService] = useState<Service[] | null>(null);
  const dispatch = useDispatch();
  const getAllService = async () => {
    let { data, error } = await supabase
      .from("services")
      .select(`*,category_id(*)`)
      .eq("active", true);
    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      dispatch(servicesAction("services", data));
    }
  };
  const getAllCategory = async () => {
    let { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data && data.length > 0) {
      dispatch(categoryAction("category", data));
    }
  };
  const handlerSearch = (e: any) => {
    if (e.target.value === "") {
      setFilterService(services);
    } else {
      setFilterService(() => {
        const pattern = new RegExp(e.target.value.toLowerCase(), "g");
        const tmp = services.filter((service: Service) => {
          return pattern.test(service.name.toLowerCase());
        });
        return tmp;
      });
    }
  };

  const onChangeCategory = async (id: string) => {
    if (id === "0") {
      setFilterService(services);
    } else {
      setFilterService(() => {
        const tmp = services.filter((service: Service) => {
          return service.category_id.id === id;
        });
        return tmp;
      });
    }
  };
  useEffect(() => {
    if (!categories) {
      getAllCategory();
    }
    if (!services) {
      getAllService();
    }
  }, [categories, services]);
  useEffect(() => {
    if (services) {
      setFilterService(services);
    }
  }, [services]);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Dịch Vụ </title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {filterService ? (
        <main className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">THÔNG TIN DỊCH VỤ</h1>
              <p className="mt-2 text-sm text-gray-700">
                Quản lý tất cả các dịch vụ ở Aura ID.
              </p>
              <div className="mt-6">
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Tìm kiếm dich vụ"
                    onChange={handlerSearch}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select
                      onChange={(e) => onChangeCategory(e.target.value)}
                      id="currency"
                      name="currency"
                      className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {categories && categories.length > 0 && (
                        <>
                          <option value={0}>Tất cả</option>
                          {categories.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/dashboard/services/create-service">
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  THÊM DỊCH VỤ
                </button>
              </div>
            </Link>
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
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Tên
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Hình ảnh
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Giá tiền
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Danh mục
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Mô tả
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
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
                    {filterService && filterService?.length > 0 ? (
                      filterService?.map((service: Service, index: number) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                            {index}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                            {service.name}
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            <div className="w-24 h-16">
                              <img
                                className="w-full h-full rounded"
                                src={service.image}
                              />
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            {convertVnd(service.price)}
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            {service.category_id.name}
                          </td>
                          <td className="py-4 px-3 text-sm text-gray-500">
                            {service.description}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                service.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {service.active ? "Đang hoạt động" : "Không hoạt động"}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                            <div className="flex gap-3 ">
                              <Link href={`/dashboard/services/edit/${service.id}`}>
                                <div className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                  Chỉnh sửa
                                </div>
                              </Link>
                              <div
                                className="text-red-500 cursor-pointer"
                                onClick={() => {
                                  setSelectedDeleteId(service.id);
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
                      <tr className=" block mt-4 text-left">
                        Không tìm thấy dữ liệu phù hợp
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {openModalDelete && selectedDeleteId && (
            <ModalDelete
              id={selectedDeleteId}
              title="dịch vụ"
              type="services"
              setOpenModalDelete={setOpenModalDelete}
            />
          )}
        </main>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
