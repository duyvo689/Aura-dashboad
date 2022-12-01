import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Link from "next/link";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/router";
import { Category, Clinic, Role } from "../utils/types";
import { clinicsAction, rolesAction } from "../redux/actions/ReduxAction";
import { supabase } from "../services/supaBaseClient";
import { RootState } from "../redux/reducers";

const ROLES_MAPPING = [
  { name: "Bác sĩ", value: "doctor" },
  { name: "Lễ Tân", value: "staff" },
];
interface Props {
  title: string;
  role: Role;
  setOpenModalUpdate: any;
}
function ModalUpdateRole({ title, role, setOpenModalUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const roles: Role[] = useSelector((state: RootState) => state.roles);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const dispatch = useDispatch();
  const updateRole = async (e: any) => {
    e.preventDefault();
    const _name = e.target.name.value;
    const _clinic_id = e.target.clinic.value;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("roles")
      .update([{ clinic_id: _clinic_id, name: _name }])
      .eq("id", role.id)
      .select(`*,clinic_id(*)`)
      .single();
    const { data: updatedUser, error: updatedUserError } = await supabase
      .from(`${role.position}s`)
      .update([{ clinic_id: _clinic_id }])
      .eq("phone", role.phone)
      .single();
    if (error || updatedUserError) {
      toast.error("Lỗi. Thử lại.");
    } else if (data || updatedUser) {
      let index = roles.findIndex((item) => item.id == role.id);
      roles[index] = data;
      dispatch(rolesAction("roles", roles));
      toast.success(`Thao tác thành công`);
    }
    setOpenModalUpdate(false);
    setIsLoading(false);
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

  return (
    <div className="flex items-center">
      <div
        id="defaultModal"
        tabIndex={1}
        aria-hidden="true"
        className="left-0 top-0 flex text-black items-center bg-black/25 justify-center fixed w-full md:inset-0 min-w-screen min-h-screen"
        style={{ zIndex: 1000 }}
      >
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Cập nhật {title}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => {
                  setOpenModalUpdate(false);
                }}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <form onSubmit={updateRole}>
              <div className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-left text-base font-semibold text-gray-700"
                  >
                    Tên nhân sự
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={role.name}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="clinic"
                    className="block text-left text-base font-semibold text-gray-700"
                  >
                    Cơ sở làm việc
                  </label>
                  <div className="mt-1">
                    <select
                      name="clinic"
                      defaultValue={role.clinic_id.id}
                      className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                  </div>
                </div>
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button
                  data-modal-toggle="defaultModal"
                  type={isLoading ? "button" : "submit"}
                  className="text-white bg-indigo-700 hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                </button>

                <button
                  data-modal-toggle="defaultModal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={() => {
                    isLoading ? () => {} : setOpenModalUpdate(false);
                  }}
                >
                  Huỷ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ModalUpdateRole;
