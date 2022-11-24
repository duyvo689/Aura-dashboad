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
  { name: "Doctor", value: "doctor" },
  { name: "Staff", value: "staff" },
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
  const category: Category[] = useSelector((state: RootState) => state.category);

  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const roles: Role[] = useSelector((state: RootState) => state.roles);
  const dispatch = useDispatch();

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
        toast.error(`Số điên thoại không đúng`);
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
        toast.error(`Nhân sự ${_phone} đã có`);
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
        .select(`*,clinic_id(*)`)
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        let index = roles.findIndex((item) => item.phone == phone);
        roles[index] = data;
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
  return (
    <>
      <Head>
        <title>Nhân Sự</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex gap-6 mt-4 mx-6">
        <div className="flex-1">
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
        <div className="flex-2 overflow-x-auto relative shadow-md sm:rounded-lg mt-8">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3  text-center px-6">
                  STT
                </th>
                <th scope="col" className="py-3  whitespace-nowrap px-6">
                  SỐ ĐIỆN THOẠI
                </th>
                <th scope="col" className="py-3  whitespace-nowrap px-6">
                  CHỨC VỤ
                </th>
                <th scope="col" className="py-3  whitespace-nowrap px-6">
                  CƠ SỞ
                </th>

                <th scope="col" className="py-3  whitespace-nowrap text-right px-6">
                  HÀNH ĐỘNG
                </th>
              </tr>
            </thead>
            <tbody>
              {roles &&
                roles.length > 0 &&
                roles.map((item, index) => (
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
                      {item.position}
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
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default RolesPage;
