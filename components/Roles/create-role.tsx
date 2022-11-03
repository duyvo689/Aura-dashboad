import { useState } from "react";
import { supabase } from "../../services/supaBaseClient";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Role } from "../../utils/types";
import { RootState } from "../../redux/reducers";
import { rolesAction } from "../../redux/actions/ReduxAction";
import { formatPhoneNumber } from "../../utils/helpers/formatPhoneNumber";

const ROLES_MAPPING = [
  { name: "Doctor", value: "doctor" },
  { name: "Staff", value: "staff" },
];
interface Props {
  roles: Role[];
  setRender: any;
}
function FormRole({ roles, setRender }: Props) {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<boolean | null>(null);
  const dispatch = useDispatch();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("roles")
      .insert([{ phone: e.target.phone.value, position: e.target.role.value }]);
    if (error) {
      toast.error(error.message);
      setMessage(false);
      return;
    }
    roles.push({
      phone: e.target.phone.value,
      position: e.target.role.value!,
    });
    setRender(Math.random());
    dispatch(rolesAction("roles", roles));
    setMessage(true);
  };
  return (
    <div className="h-full w-full bg-gray-50 overflow-y-auto p-4 ">
      <form onSubmit={handleSubmit}>
        <div className="">
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 required"
          >
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="Số điện thoại Vd: 09211xxx"
            onChange={(e) => {
              setPhone(formatPhoneNumber(e.target.value));
            }}
            required
          />
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 required"
          >
            Ví trí
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
        </div>
        {message === null ? null : message ? (
          <div
            className="p-4 my-4 text-sm text-primary bg-green-100 rounded-lg "
            role="alert"
          >
            <span className="font-bold">Thành công!!!</span> Thêm mới thành công
          </div>
        ) : (
          <div
            className="p-4 my-4 text-sm text-red-500 bg-red-100 rounded-lg "
            role="alert"
          >
            <span className="font-bold">Thất bại!!! </span>Thêm mới thất bại
          </div>
        )}
        <div className="flex justify-end">
          {message !== null ? (
            <div
              className="cursor-pointer flex items-center text-white bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
              onClick={() => {
                setMessage(null);
                setPhone("");
              }}
            >
              Thêm mới
            </div>
          ) : isLoading ? (
            <div className="mt-4 flex items-center text-white bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-1 w-4 h-4 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Đang tạo...
            </div>
          ) : (
            <button
              type="submit"
              className="mt-4 text-white bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
            >
              Tạo mới
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
export default FormRole;
