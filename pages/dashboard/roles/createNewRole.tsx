import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { clinicsAction, rolesAction } from "../../../redux/actions/ReduxAction";
import { supabase } from "../../../services/supaBaseClient";
import { validatePhoneNumber } from "../../../utils/funtions";
import { Clinic, Role } from "../../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
const ROLES_MAPPING = [
  { name: "Bác sĩ", value: "doctor" },
  { name: "Lễ Tân", value: "staff" },
  { name: "Quản lý", value: "manager" },
];
function CreateNewRoles() {
  const [load, setLoad] = useState(false);
  const roles: Role[] = useSelector((state: RootState) => state.roles);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const dispatch = useDispatch();
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
  return (
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
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Số điện thoại"
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
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Nhập tên nhân sự"
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
          {!load ? (
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
  );
}
