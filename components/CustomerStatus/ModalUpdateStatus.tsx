import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { customerStatusAction } from "../../redux/actions/ReduxAction";
import { RootState } from "../../redux/reducers";
import { supabase } from "../../services/supaBaseClient";
import { CustomerStatus } from "../../utils/types";

interface Props {
  customerStatus: CustomerStatus;
  setOpenModalUpdate: any;
}
import Select from "react-select";
import { statusType } from "../../constants/crm";

function ModalUpdateCustomerStatus({ customerStatus, setOpenModalUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const allCustomerStatus: CustomerStatus[] = useSelector(
    (state: RootState) => state.customerStatus
  );
  const dispatch = useDispatch();
  const updateCustomerStatus = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    const name = e.target.name.value;
    const type = e.target.type.value;

    if (!allCustomerStatus) return;
    const { data, error } = await supabase
      .from("customer_status")
      .update({ name: name, type: type })
      .eq("id", customerStatus.id)
      .select()
      .single();
    if (error) {
      setIsLoading(false);
      toast.error("Lỗi. Thử lại");
    } else if (data) {
      let index = allCustomerStatus.findIndex((item) => item.id == customerStatus.id);
      allCustomerStatus[index] = data;
      dispatch(customerStatusAction("customerStatus", [...allCustomerStatus]));
      toast.success("Cập nhật thành công");
      setOpenModalUpdate(false);
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
                Cập nhật thông tin
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
            <form className="p-6 space-y-6" onSubmit={updateCustomerStatus}>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="block text-left text-base font-semibold text-gray-700"
                >
                  Tên
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={customerStatus.name}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="type"
                  className="block text-left text-base font-semibold text-gray-700"
                >
                  Loại
                </label>
                <Select
                  name="type"
                  placeholder={"Vui lòng chọn"}
                  defaultValue={statusType.find(
                    (item) => item.value === customerStatus.type
                  )}
                  options={statusType}
                ></Select>
              </div>
              <div className="flex items-center gap-2 rounded">
                <button
                  data-modal-toggle="defaultModal"
                  type="submit"
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
export default ModalUpdateCustomerStatus;
