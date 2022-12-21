import { Switch } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import react, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CountRecord from "../../../components/CountRecord";
import ModalDelete from "../../../components/ModalDelete";
import ModalToggleActive from "../../../components/ModalToggleActive";
import Pagination from "../../../components/Pagination";
import FilterServiceBtn from "../../../components/Services/actions/FilterServiceButton";
import { categoryAction, servicesAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { convertVnd } from "../../../utils/helpers/convertToVND";
import { Category, Service } from "../../../utils/types";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
export default function ServicePage() {
  const services: Service[] = useSelector((state: RootState) => state.services);
  const categories: Category[] = useSelector((state: RootState) => state.category);
  const [openModalToggle, setOpenModalToggle] = useState<boolean>(false);
  const [selectedToggle, setSelectedToggle] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  const [pagination, setPagination] = useState(1);
  const [filterService, setFilterService] = useState<Service[] | null>(null);
  const dispatch = useDispatch();
  const getAllService = async () => {
    let { data, error } = await supabase.from("services").select(`*,category_id(*)`);

    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      dispatch(servicesAction("services", data));
    }
  };
  const getAllCategory = async () => {
    let { data, error } = await supabase.from("categories").select("*");
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data && data.length > 0) {
      dispatch(categoryAction("category", data));
    }
  };
  const handlerSearch = (e: any) => {
    console.log(e.target.value);
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

  const onFilterByCategory = async (idList: string[]) => {
    if (idList.length === 0) {
      setFilterService(services);
    } else {
      const filterByCategory = services.filter((el) => {
        if (!el.category_id) {
          return false;
        } else {
          return idList.includes(el.category_id.id);
        }
      });
      console.log(filterByCategory);
      setFilterService(filterByCategory);
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
      {filterService && categories ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">Dịch vụ ✨</div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <FilterServiceBtn categories={categories} onFilter={onFilterByCategory} />
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  id="search"
                  onChange={handlerSearch}
                  placeholder="Tìm kiếm số theo tên"
                  className="form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300 w-60"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <MagnifyingGlassIcon stroke={"#64748b"} className="w-6 h-5" />
                </div>
              </div>
              <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                <svg
                  className="w-4 h-4 fill-current opacity-50 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <Link href="/dashboard/services/create-service">
                  <span className="hidden xs:block ml-2">Thêm dịch vụ</span>
                </Link>
              </button>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="w-full overflow-x-auto relative shadow-md sm:rounded-lg">
              <CountRecord amount={services.length} title={"Danh sách dịch vụ"} />
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
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4  "
                    >
                      Tên
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
                      Giá tiền
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4  "
                    >
                      Danh mục
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
                  {filterService && filterService.length > 0 ? (
                    filterService
                      .slice((pagination - 1) * 10, pagination * 10)
                      .map((item, index) => (
                        <tr
                          key={item.id}
                          className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700"
                        >
                          <td className="whitespace-nowrap py-3 px-2 ">
                            {(pagination - 1) * 10 + index + 1}
                          </td>
                          <td className="whitespace-nowrap py-3 px-2 ">{item.name}</td>
                          <td className="whitespace-nowrap py-3 px-2 ">
                            <div className="w-24 h-16">
                              <img className="w-full h-full rounded" src={item.image} />
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-3 px-2 ">
                            {convertVnd(item.price)}
                          </td>
                          <td className="whitespace-nowrap py-3 px-2 ">
                            {item.category_id.name}
                          </td>
                          <td className="py-3 px-2 ">
                            <span className="text-left min-ellipsis-two">
                              {item.description}
                            </span>
                          </td>
                          <td className="whitespace-nowrap text-center">
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

                          <td className="relative whitespace-nowrap py-3 px-2 ">
                            <Link href={`/dashboard/services/edit/${item.id}`}>
                              <div className="text-indigo-600 hover:text-indigo-900 cursor-pointer text-center">
                                Chỉnh sửa
                              </div>
                            </Link>
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
          <Pagination
            filteredData={filterService}
            dataLength={filterService.length}
            currentPage={pagination}
            setNewPage={setPagination}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {openModalToggle && selectedToggle && (
        <ModalToggleActive
          id={selectedToggle.id}
          status={selectedToggle.status}
          title="dịch vụ"
          type="services"
          setOpenModalToggle={setOpenModalToggle}
        />
      )}
    </div>
  );
}
