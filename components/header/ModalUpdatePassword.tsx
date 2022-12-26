import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AuthAPI } from "../../api";
import { RootState } from "../../redux/reducers";
import { AppUserInfo } from "../../utils/types";
import InputForm from "../Form/InputForm";

interface Props {
  phone: string;
  setOpenModalUpdatePassword: any;
}

function ModalUpdatePassword({ phone, setOpenModalUpdatePassword }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const updateUserPassword = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    const response = await AuthAPI.updatePassword(
      phone,
      e.target.oldPassword.value,
      e.target.newPassword.value
    );
    if (response && response.data.status === "Success") {
      console.log(response.data);
      toast.success("Cập nhật mật khẩu thành công");
      localStorage.removeItem("accessToken");
      router.push(`/phone-login`);
    } else {
      toast.error(response.data.message);
    }

    setIsLoading(false);
  };
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
                Cập nhật mật khẩu
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => {
                  setOpenModalUpdatePassword(false);
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
            <form onSubmit={updateUserPassword}>
              <div className="p-4">
                <InputForm
                  title={"Mật khẩu cũ"}
                  id={"oldPassword"}
                  name={"oldPassword"}
                  type="password"
                />
              </div>
              <div className="p-4">
                <InputForm
                  title={"Mật khẩu mới"}
                  id={"newPassword"}
                  name={"newPassword"}
                  type="password"
                />
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
                  type={isLoading ? "button" : "submit"}
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={() => {
                    isLoading ? () => {} : setOpenModalUpdatePassword(false);
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
export default ModalUpdatePassword;
