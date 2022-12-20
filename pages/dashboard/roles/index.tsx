import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { Category, Clinic, Role } from "../../../utils/types";
import { clinicsAction, rolesAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import { RootState } from "../../../redux/reducers";
import { validatePhoneNumber } from "../../../utils/funtions";
import Link from "next/link";
import { Switch } from "@headlessui/react";
import ModalToggleActive from "../../../components/ModalToggleActive";
import ModalUpdateRole from "../../../components/ModalUpdateRole";
import FilterButton from "../../../components/actions/FilterButton";
import Datepicker from "../../../components/actions/Datepicker";
import CountRecord from "../../../components/CountRecord";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const roles: Role[] = useSelector((state: RootState) => state.roles);
  const dispatch = useDispatch();
  const [filterRoles, setFilterRoles] = useState<Role[] | null>(null);
  const addNewRoles = async (event: any) => {
    try {
      setLoad(true);
      event.preventDefault();
      const _phone = event.target.elements.phone.value;
      const _role = event.target.elements.role.value;
      const _clinic = event.target.elements.clinic.value;
      const _name = event.target.elements.name.value;
      const flagPhone = validatePhoneNumber(_phone);
      if (!flagPhone) {
        toast.error(`Số điện thoại không đúng`);
        return;
      }
      const _infoRole = {
        position: _role,
        clinic_id: _clinic,
        phone: _phone,
        name: _name,
        verify: true,
      };

      const _infoPersonnel = {
        clinic_id: _clinic,
        phone: _phone,
      };
      const flagRole = await checkCreateRoles(_phone, _role);
      if (!flagRole) {
        const { data, error } = await supabase
          .from("roles")
          .insert([_infoRole])
          .select(`*,clinic_id(*)`)
          .single();
        if (error != null) {
          toast.error(error.message);
        } else {
          roles.push(data);
          toast.success(`Đã thêm ${_phone}`);
          event.target.reset();
        }
      } else {
        toast.error(`Nhân sự ${_phone} đã tồn tại`);
      }
      const flag = await checkCreatePersonnel(_role, _phone);
      if (!flag) {
        await createPersonnel(_role, _infoPersonnel);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  const createPersonnel = async (table: string, info: any) => {
    const { data, error } = await supabase.from(`${table}s`).insert([info]);
  };
  const checkCreatePersonnel = async (table: string, phone: string) => {
    let { data, error } = await supabase
      .from(`${table}s`)
      .select("phone")
      .eq("phone", phone);
    if (data && data.length > 0) return true;
    return false;
  };

  const checkCreateRoles = async (phone: string, role: string) => {
    let { data: roles, error } = await supabase
      .from("roles")
      .select("phone")
      .match({ phone: phone, position: role });
    if (roles && roles.length > 0) return true;
    return false;
  };

  // ==update edit end==//

  // ==get data start==//
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
  const onChangeClinic = async (id: string) => {
    if (id === "") {
      setFilterRoles(roles);
    } else {
      const filterByClinic = roles.filter((el) => el.clinic_id.id === id);
      setFilterRoles(filterByClinic);
    }
  };

  const onChangePersonnel = async (position: string) => {
    if (position === "") {
      setFilterRoles(roles);
    } else {
      const filterByPosition = roles.filter((el) => el.position === position);
      setFilterRoles(filterByPosition);
    }
  };
  useEffect(() => {
    if (!clinics) {
      getAllClinic();
    }
  }, [clinics]);
  useEffect(() => {
    if (!roles) {
      getAllRoles();
    }
  }, [roles]);
  useEffect(() => {
    setFilterRoles(roles);
  }, [roles]);

  return (
    <>
      <Head>
        <title>Nhân Sự</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex flex-col gap-5">
        <div className="sm:flex sm:justify-between sm:items-center">
          <div className="text-2xl font-bold text-slate-800">Nhân sự ✨</div>
          <div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  id="search"
                  onChange={handlerSearch}
                  placeholder="Tìm kiếm số theo tên hoặc số điện thoại"
                  className="form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300 w-80"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2">
                  <MagnifyingGlassIcon stroke={"#64748b"} className="w-6 h-5" />
                </div>
              </div>

              {/* Add view button */}
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
            {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        
            <FilterButton />
       <Datepicker />
          </div> */}
          </div>
        </div>
        <div className="sm:flex sm:justify-between sm:items-center">
          <div className="text-2xl font-bold text-slate-800"></div>
          <div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <FilterButton />
              <Datepicker />
            </div>
          </div>
        </div>
        {/* <div className="w-[30%]">
          <form onSubmit={addNewRoles}>
            <label
              htmlFor="helper-text"
              className="block mb-4 text-sm font-bold text-gray-900 dark:text-white"
            >
              SỐ ĐIỆN THOẠI
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Số điện thoại"
              onChange={(e) => setPhone(e.target.value)}
            />
            <label
              htmlFor="helper-text"
              className="block mb-4 mt-6 text-sm font-bold text-gray-900 dark:text-white"
            >
              TÊN NHÂN SỰ
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nhập tên nhân sự"
              onChange={(e) => setName(e.target.value)}
            />
            <label
              htmlFor="helper-text"
              className="block mb-4 mt-6 text-sm font-bold text-gray-900 dark:text-white"
            >
              VỊ TRÍ
            </label>
            <select
              name="role"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {ROLES_MAPPING
                ? ROLES_MAPPING.map((role: any, index: number) => {
                    return (
                      <option value={role.value} key={index}>
                        {role.name}
                      </option>
                    );
                  })
                : null}
            </select>
            <label
              htmlFor="helper-text"
              className="block mb-4 mt-6 text-sm font-bold text-gray-900 dark:text-white"
            >
              CƠ SỞ LÀM VIỆC
            </label>
            <select
              name="clinic"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {clinics && clinics.length > 0
                ? clinics.map((clinic: any, index: number) => {
                    return (
                      <option value={clinic.id} key={index}>
                        {clinic.name}
                      </option>
                    );
                  })
                : null}
            </select>
            <div className="justify-end flex mt-4">
              {!phone ? (
                <p className="text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                  THÊM NHÂN SỰ
                </p>
              ) : (
                <button
                  type={"submit"}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {load ? "ĐANG THÊM..." : "THÊM DANH MỤC"}
                </button>
              )}
            </div>
          </form>
        </div> */}

        <div className="bg-white border border-slate-200 rounded-sm">
          <div className="w-full overflow-x-auto relative shadow-md sm:rounded-lg">
            <CountRecord amount={20} title={"Danh sách nhân sự"} />
            <table className="w-full text-sm  text-gray-500 dark:text-gray-400">
              <thead className="bg-slate-100 text-slate-500 uppercase font-semibold text-xs border border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-2 whitespace-normal ">
                    STT
                  </th>
                  <th scope="col" className="py-3 px-2 whitespace-normal ">
                    Số điện thoại
                  </th>
                  <th scope="col" className="py-3 px-2 whitespace-normal ">
                    Tên nhân sự
                  </th>
                  <th scope="col" className="py-3 px-2 whitespace-normal ">
                    Chức vụ
                  </th>
                  <th scope="col" className="py-3 px-2 whitespace-normal ">
                    Cơ sở
                  </th>
                  <th scope="col" className="py-3 px-2 whitespace-normal ">
                    Trạng thái
                  </th>
                  <th scope="col" className="py-3 px-2 whitespace-normal">
                    Xác thực
                  </th>
                  <th scope="col" className="py-3 px-2 whitespace-normal ">
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
                          className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-medium  cursor-pointer"
                        >
                          <div
                            className={`${
                              item.verify
                                ? "text-green-600 bg-green-200"
                                : "text-red-600 bg-red-200"
                            } rounded-full text-center p-1.5`}
                          >
                            {item.verify ? "Đã xác thực" : "Chưa xác thực"}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-3 px-2 ">
                          <div
                            onClick={() => {
                              setSelectedUpdateItem(item);
                              setOpenModalUpdate(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          >
                            Chỉnh sửa
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr className="block mt-6 ml-8">Không có dữ liệu</tr>
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
                  pagination > 1 ? "text-indigo-500" : "text-slate-300 cursor-not-allowed"
                }`}
              >
                {`<- Trước`}
              </button>
              <button
                onClick={() => {
                  setPagination((preState) =>
                    preState * 10 > filterRoles.length ? preState : preState + 1
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
