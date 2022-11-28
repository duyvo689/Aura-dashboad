import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { Category, Clinic, Role } from "../../../utils/types";
import { clinicsAction, rolesAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import { RootState } from "../../../redux/reducers";
import { validatePhoneNumber } from "../../../utils/funtions";

interface Toggle {
  index: number;
  isEdit: boolean;
  value: {
    phone: string;
    role: string;
    clinic: string;
  };
}
const ROLES_MAPPING = [
  { name: "Bác sĩ", value: "doctor" },
  { name: "Lễ Tân", value: "staff" },
];

function RolesPage() {
  const [phone, setPhone] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);
  const [toggle, setToggle] = useState<Toggle>({
    index: -1,
    isEdit: false,
    value: {
      phone: "",
      role: "",
      clinic: "",
    },
  });

  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const roles: Role[] = useSelector((state: RootState) => state.roles);
  const dispatch = useDispatch();
  const [rolesState, setRolesState] = useState<Role[]>();

  useEffect(() => {
    setRolesState(roles);
  }, [roles]);

  useEffect(() => {
    getAllClinic();
    getAllRoles();
  }, []);

  const addNewRoles = async (event: any) => {
    try {
      setLoad(true);
      event.preventDefault();
      const _phone = event.target.elements.phone.value;
      const _role = event.target.elements.role.value;
      const _clinic = event.target.elements.clinic.value;
      const flagPhone = validatePhoneNumber(_phone);
      if (!flagPhone) {
        toast.error(`Số điện thoại không đúng`);
        return;
      }
      const _infoRole = {
        position: _role,
        clinic_id: _clinic,
        phone: _phone,
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
          setPhone("");
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

  // ==update edit start==//
  const editRole = async (phone: string) => {
    try {
      const _phone = toggle.value.phone;
      const _clinic = toggle.value.clinic;
      const _role = toggle.value.role;

      const { data, error } = await supabase
        .from("roles")
        .update({ phone: _phone, clinic_id: _clinic })
        .eq("phone", phone)
        .select(`*,clinic_id(*)`);
      console.log(data);
      if (error != null) {
        toast.error(error.message);
      }
      if (data) {
        let index = roles.findIndex((item) => item.phone == phone);
        roles[index] = data[0];
        toast.success(`Đã sửa ${phone}`);
        setToggle({
          index: -1,
          isEdit: false,
          value: {
            phone: "",
            role: "",
            clinic: "",
          },
        });
        await updateEditPersonnel(_role, phone, _phone, _clinic);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const updateEditPersonnel = async (
    table: string,
    oldPhone: string,
    newPhone: string,
    clinic_id: string
  ) => {
    const { data, error } = await supabase
      .from(`${table}s`)
      .update({ phone: newPhone, clinic_id: clinic_id })
      .eq("phone", oldPhone);
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
  // ==get data end==//

  const handlerSearch = (e: any) => {
    const pattern = new RegExp(e.target.value.toLowerCase(), "g");
    const tmp = roles.filter((role: Role) => {
      return pattern.test(role.phone.toLowerCase());
    });
    setRolesState(tmp);
    if (!e.target.value) {
      setRolesState(roles);
    }
  };

  const onChangeClinic = async (id: string) => {
    let { data, error } =
      id == "0"
        ? await supabase.from("roles").select(`*,clinic_id(*)`)
        : await supabase.from("roles").select(`*,clinic_id(*)`).eq("clinic_id", id);

    dispatch(rolesAction("roles", data));
  };

  const onChangePersonnel = async (position: string) => {
    let { data, error } =
      position == "0"
        ? await supabase.from("roles").select(`*,clinic_id(*)`)
        : await supabase.from("roles").select(`*,clinic_id(*)`).eq("position", position);

    dispatch(rolesAction("roles", data));
  };
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
                name="price"
                id="price"
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
                      <option value={0}>Tất cả</option>
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
                      <option value={0}>Tất cả</option>
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
                    className="sticky top-0 whitespace-nowrap z-10 border-b border-gray-300 bg-gray-50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                  >
                    STT
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 whitespace-nowrap z-10 border-b border-gray-300 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                  >
                    SỐ ĐIỆN THOẠI
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 whitespace-nowrap z-10 hidden border-b border-gray-300 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    CHỨC VỤ
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 whitespace-nowrap z-10 hidden border-b border-gray-300 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    CƠ SỞ
                  </th>
                  <th
                    scope="col"
                    className="sticky whitespace-nowrap top-0 z-10 border-b border-gray-300 bg-gray-50 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {rolesState && rolesState.length > 0 ? (
                  rolesState.map((item, index) => (
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700"
                    >
                      <td className="py-4 px-6">{index}</td>
                      {index == toggle.index && toggle.isEdit ? (
                        <>
                          <input
                            className="bg-gray-50 mt-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="text"
                            value={toggle.value.phone}
                            onChange={(e) =>
                              setToggle({
                                index: index,
                                isEdit: true,
                                value: { ...toggle.value, phone: e.target.value },
                              })
                            }
                          />
                        </>
                      ) : (
                        <th
                          scope="row"
                          className="py-4 px-6 cursor-pointer font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.phone}
                        </th>
                      )}
                      <td
                        className="py-4  px-6"
                        onChange={(e) =>
                          setToggle({
                            index: index,
                            isEdit: true,
                            value: {
                              ...toggle.value,
                              role: item.position,
                            },
                          })
                        }
                      >
                        {item.position === "staff"
                          ? "Lễ Tân"
                          : item.position === "doctor"
                          ? "Bác sĩ"
                          : ""}
                      </td>
                      <td className="py-4  px-6">
                        {index == toggle.index && toggle.isEdit ? (
                          <select
                            onChange={(e) =>
                              setToggle({
                                index: index,
                                isEdit: true,
                                value: {
                                  ...toggle.value,
                                  clinic: e.target.value,
                                },
                              })
                            }
                            value={toggle.value.clinic}
                            name="clinic"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-w-[200px]"
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
                        ) : (
                          item.clinic_id?.name
                        )}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap text-white">
                        {index == toggle.index && toggle.isEdit ? (
                          <span
                            onClick={() => editRole(item.phone)}
                            className="text-red-600  cursor-pointer hover:text-indigo-900"
                          >
                            Lưu Lại
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                alert(
                                  `Không được xoá ${item.phone}, tính năng đang phát triển!`
                                )
                              }
                              type="button"
                              data-modal-toggle="popup-modal"
                              className="text-red-700 cursor-pointer hover:text-indigo-900"
                            >
                              Xoá
                            </button>
                            <span
                              onClick={() =>
                                setToggle({
                                  index: index,
                                  isEdit: true,
                                  value: {
                                    phone: item.phone,
                                    role: item.position,
                                    clinic: item.clinic_id.id,
                                  },
                                })
                              }
                              className="text-indigo-600 ml-4 cursor-pointer hover:text-indigo-900"
                            >
                              Sửa
                            </span>
                          </>
                        )}
                        {index == toggle.index && toggle.isEdit && (
                          <span
                            onClick={() => {
                              setToggle({
                                index: -1,
                                isEdit: false,
                                value: { phone: "", clinic: "", role: "" },
                              });
                            }}
                            className="text-gray-600  cursor-pointer ml-4 hover:text-indigo-900"
                          >
                            Huỷ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className="block mt-6 ml-8">Không có dữ liệu</div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
export default RolesPage;
