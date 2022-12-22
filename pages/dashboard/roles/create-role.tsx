import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { clinicsAction, rolesAction } from "../../../redux/actions/ReduxAction";
import { supabase } from "../../../services/supaBaseClient";
import { validatePhoneNumber } from "../../../utils/funtions";
import { Clinic, Role } from "../../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
import InputForm from "../../../components/Form/InputForm";
import SelectForm from "../../../components/Form/SelectForm";
import SubmitBtn from "../../../components/Form/SubmitBtn";
const ROLES_MAPPING = [
  { label: "Bác sĩ", value: "doctor" },
  { label: "Lễ Tân", value: "staff" },
  { label: "Quản lý", value: "manager" },
];
const InputFields = [
  {
    type: "text",
    title: "Số điện thoại",
    id: "phone",
    name: "phone",
    placeholder: "Ex: 09039213122",
    required: true,
  },
  {
    type: "text",
    title: "Tên nhân sự",
    id: "name",
    name: "name",
    placeholder: "Ex: Nguyễn Văn A",
    required: true,
  },
];
const InputSelect = [
  {
    title: "Chức vụ",
    name: "role",
    required: true,
    placeholder: "Vui lòng chọn",
  },
  {
    title: "Cơ sở làm việc",
    name: "clinic",
    required: true,
    placeholder: "Vui lòng chọn",
  },
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
    <div className="flex flex-col gap-5 items">
      <div className="flex justify-center">
        <div className="sm:flex sm:justify-between sm:items-center w-2/3">
          <div className="text-2xl font-bold text-slate-800">Thêm nhân sự ✨</div>
        </div>
      </div>
      {clinics ? (
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-6 w-2/3 ">
            <form onSubmit={addNewRoles} className="flex flex-col gap-5">
              {InputFields.map((item, index) => {
                return (
                  <InputForm
                    key={index}
                    title={item.title}
                    name={item.name}
                    id={item.id}
                    type={item.type}
                    placeholder={item.placeholder}
                    required={item.required}
                  />
                );
              })}
              {InputSelect.map((item, index) => {
                return (
                  <SelectForm
                    key={index}
                    name={item.name}
                    title={item.title}
                    placeholder={item.placeholder}
                    options={
                      item.name === "role"
                        ? ROLES_MAPPING
                        : clinics.map((clinic) => {
                            return {
                              label: clinic.name,
                              value: clinic.id,
                            };
                          })
                    }
                    required={item.required}
                  />
                );
              })}
              <div className="flex justify-end">
                <SubmitBtn
                  type={load ? "button" : "submit"}
                  content={load ? "Đang thêm..." : "Thêm nhân sự"}
                  size="md"
                />
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
export default CreateNewRoles;
