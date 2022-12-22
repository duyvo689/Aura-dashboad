import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { Clinic, Role } from "../../../utils/types";
import { clinicsAction, rolesAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import { RootState } from "../../../redux/reducers";

import { Switch } from "@headlessui/react";
import ModalToggleActive from "../../../components/ModalToggleActive";
import ModalUpdateRole from "../../../components/ModalUpdateRole";
import FilterRolesBtn from "../../../components/Roles/actions/FilterRolesBtn";
import CountRecord from "../../../components/CountRecord";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { EditIcon } from "../../../components/Icons/Form";
const ROLES_MAPPING = [
  { name: "Bác sĩ", value: "doctor" },
  { name: "Lễ Tân", value: "staff" },
  { name: "Quản lý", value: "manager" },
];
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
function RolesPage() {
  const [pagination, setPagination] = useState(1);
  const [load, setLoad] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<Role | null>(null);
  const [selectedVerifyItem, setSelectedVerifyItem] = useState<Role | null>(null);
  const [openModalToggle, setOpenModalToggle] = useState<boolean>(false);
  const [selectedToggle, setSelectedToggle] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  const roles: Role[] = useSelector((state: RootState) => state.roles);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const dispatch = useDispatch();
  const [filterRoles, setFilterRoles] = useState<Role[] | null>(null);
  const getAllRoles = async () => {
    let { data, error } = await supabase
      .from("roles")
      .select(`*,clinic_id(*)`)
      .order("created_at", { ascending: false });
    if (error) {
      toast(error.message);
      return;
    }
    if (error) {
      return;
    }
    if (data) {
      dispatch(rolesAction("roles", data));
    }
  };

  const handlerSearch = (e: any) => {
    console.log(e.target.value);
    if (e.target.value === "") {
      setFilterRoles(roles);
    } else {
      setFilterRoles(() => {
        const pattern = new RegExp(e.target.value);
        const tmp = roles.filter((item: Role) => {
          return pattern.test(item.phone);
        });
        return tmp;
      });
    }
  };
  const getAllClinic = async () => {
    let { data: clinics, error } = await supabase
      .from(" clinics")
      .select(`*`)
      .eq("active", true);
    if (error) {
      toast(error.message);
      return;
    }
    if (clinics && clinics.length > 0) {
      dispatch(clinicsAction("clinics", clinics));
    }
  };
  const onFilterByClinic = (idList: string[]) => {
    if (idList.length === 0) {
      setFilterRoles(roles);
    } else {
      const filterByClinic = roles.filter((el) => {
        if (!el.clinic_id) {
          return false;
        } else {
          return idList.includes(el.clinic_id.id);
        }
      });
      console.log(filterByClinic);
      setFilterRoles(filterByClinic);
    }
  };
  useEffect(() => {
    if (!roles) {
      getAllRoles();
    }
  }, [roles]);
  useEffect(() => {
    if (!clinics) {
      getAllClinic();
    }
  }, [clinics]);
  useEffect(() => {
    setFilterRoles(roles);
  }, [roles]);

  return (
    <>
      <Head>
        <title>Nhân Sự</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {filterRoles && clinics ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">Nhân sự ✨</div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <FilterRolesBtn clinics={clinics} onFilterRoles={onFilterByClinic} />
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  id="search"
                  onChange={handlerSearch}
                  placeholder="Tìm kiếm số theo tên hoặc số điện thoại"
                  className="form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300 w-80"
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
                <span className="hidden xs:block ml-2">Thêm nhân sự</span>
              </button>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="w-full overflow-x-auto relative shadow-md sm:rounded-lg">
              <CountRecord amount={filterRoles.length} title={"Danh sách nhân sự"} />
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
                      Số điện thoại
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Tên nhân sự
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Chức vụ
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4  "
                    >
                      Cơ sở
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
                      Xác thực
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
                  {filterRoles && filterRoles.length > 0 ? (
                    filterRoles
                      .slice((pagination - 1) * 10, pagination * 10)
                      .map((item, index) => (
                        <tr
                          key={item.id}
                          className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700"
                        >
                          <td className="whitespace-nowrap py-3 px-2 ">
                            {(pagination - 1) * 10 + index + 1}
                          </td>
                          <td className="whitespace-nowrap py-3 px-2 ">{item.phone}</td>
                          <td className="whitespace-nowrap py-3 px-2 ">
                            {item.name || "Đang cập nhật"}
                          </td>
                          <td className="whitespace-nowrap py-3 px-2 ">
                            {
                              ROLES_MAPPING.filter((el) => el.value === item.position)[0]
                                .name
                            }
                          </td>
                          <td className="whitespace-nowrap py-3 px-2 ">
                            {item.clinic_id?.name}
                          </td>
                          <td className="whitespace-nowrap text-center">
                            <Switch
                              checked={item.active}
                              onClick={() => {
                                setSelectedToggle({
                                  id: `${item.phone}:${item.id}:${item.position}`, // this id is phone:id:position
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
                          <td
                            onClick={
                              item.verify
                                ? () => {
                                    toast.success("Đã xác thực");
                                  }
                                : () => {
                                    setSelectedVerifyItem(item);
                                    setOpenModalToggle(true);
                                  }
                            }
                            className="whitespace-nowrap py-3 px-2 text-sm font-medium cursor-pointer "
                          >
                            <div
                              className={`${
                                item.verify
                                  ? "text-green-600 bg-green-200"
                                  : "text-red-600 bg-red-200"
                              } rounded-full text-center inline-block px-2 py-1`}
                            >
                              {item.verify ? "Đã xác thực" : "Chưa xác thực"}
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-3 px-2 flex items-center justify-center ">
                            <div
                              onClick={() => {
                                setSelectedUpdateItem(item);
                                setOpenModalUpdate(true);
                              }}
                              className="cursor-pointer"
                            >
                              <EditIcon />
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
          {filterRoles && filterRoles.length > 0 ? (
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-500 ">
                {`Hiển thị ${pagination * 10} trên ${roles.length} kết quả`}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setPagination((preState) => (preState <= 1 ? 1 : preState - 1));
                  }}
                  className={`btn bg-white border-slate-200 hover:border-slate-300 ${
                    pagination > 1
                      ? "text-indigo-500"
                      : "text-slate-300 cursor-not-allowed"
                  }`}
                >
                  {`<- Trước`}
                </button>
                <button
                  onClick={() => {
                    setPagination((preState) =>
                      preState * 10 >= filterRoles.length ? preState : preState + 1
                    );
                  }}
                  className={`btn bg-white border-slate-200 hover:border-slate-300 ${
                    pagination * 10 < filterRoles.length
                      ? "text-indigo-500"
                      : "text-slate-300 cursor-not-allowed"
                  }`}
                >
                  {`Sau ->`}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {openModalToggle && selectedToggle && (
        <ModalToggleActive
          id={selectedToggle.id}
          status={selectedToggle.status}
          title="nhân sự"
          type="roles"
          setOpenModalToggle={setOpenModalToggle}
        />
      )}
      {openModalToggle && selectedVerifyItem && (
        <ModalToggleActive
          id={selectedVerifyItem.id}
          status={selectedVerifyItem.verify}
          title="xác thực người dùng"
          type="verify"
          setOpenModalToggle={setOpenModalToggle}
        />
      )}
      {openModalUpdate && selectedUpdateItem && (
        <ModalUpdateRole
          role={selectedUpdateItem}
          title="nhân sự"
          setOpenModalUpdate={setOpenModalUpdate}
        />
      )}
    </>
  );
}
export default RolesPage;
