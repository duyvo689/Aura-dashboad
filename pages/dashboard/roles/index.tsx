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

const ROLES_MAPPING = [
  { name: "Bác sĩ", value: "doctor" },
  { name: "Lễ Tân", value: "staff" },
];
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
function RolesPage() {
  const [phone, setPhone] = useState<string>();
  const [name, setName] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<Role | null>(null);
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
    let { data, error } = await supabase.from("roles").select(`*,clinic_id(*)`);
    if (error) {
      toast(error.message);
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
    console.log(position);
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
  // const convertZaloPhoneToPhone = (phone: string) => {
  //   if (phone.length == 10) return phone;
  //   const remoteSpace = phone.replace(/\s/g, "");
  //   const newPhone = 0 + remoteSpace.slice(5);
  //   return newPhone;
  // };
  // useEffect(() => {
  //   const a = convertZaloPhoneToPhone("(+84) 366387684");
  //   console.log(a);
  // }, []);
  return (
    <>
      <Head>
        <title>Nhân Sự</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex gap-6 mt-4 mx-6">
        <div className="w-[30%]">
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
        </div>
        <div className="w-[70%]">
          <div className="mb-6">
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Tìm kiếm số điện thoại"
                onChange={handlerSearch}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  onChange={(e) => onChangePersonnel(e.target.value)}
                  id="currency"
                  name="currency"
                  className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {ROLES_MAPPING && ROLES_MAPPING.length > 0 && (
                    <>
                      <option value="">Tất cả</option>
                      {ROLES_MAPPING.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <select
                  onChange={(e) => onChangeClinic(e.target.value)}
                  id="currency"
                  name="currency"
                  className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {clinics && clinics.length > 0 && (
                    <>
                      <option value="">Tất cả</option>
                      {clinics.map((item) => (
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
          <div className="w-full h-[80vh] overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    STT
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Số điện thoại
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Tên nhân sự
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Chức vụ
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Cơ sở
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Trạng tháí
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterRoles && filterRoles.length > 0 ? (
                  filterRoles.map((item, index) => (
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700"
                    >
                      <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {item.phone}
                      </td>
                      <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {item.name || "Đang cập nhật"}
                      </td>
                      <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {ROLES_MAPPING.filter((el) => el.value === item.position)[0].name}
                      </td>
                      <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {item.clinic_id.name}
                      </td>
                      <td className="whitespace-nowrap text-center py-3.5 pl-4 pr-3  text-sm text-gray-500">
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
                      <td className="relative whitespace-nowrap py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                        <div className="flex gap-3 ">
                          <div
                            onClick={() => {
                              console.log(item);
                              setSelectedUpdateItem(item);
                              setOpenModalUpdate(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          >
                            Chỉnh sửa
                          </div>
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
        {openModalToggle && selectedToggle && (
          <ModalToggleActive
            id={selectedToggle.id}
            status={selectedToggle.status}
            title="nhân sự"
            type="roles"
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
      </div>
    </>
  );
}
export default RolesPage;
