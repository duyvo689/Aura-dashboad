import { Widget } from "@uploadcare/react-widget";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { categoryAction, paymentAction } from "../redux/actions/ReduxAction";
import { RootState } from "../redux/reducers";
import { supabase } from "../services/supaBaseClient";
import convertImg from "../utils/helpers/convertImg";
import { Category, Payment } from "../utils/types";

interface Props {
  title: string;
  payment: Payment;
  setOpenModalUpdate: any;
}
const UPLOADCARE_KEY = process.env.NEXT_PUBLIC_UPLOADCARE as string;
function ModalUpdatePayment({ payment, title, setOpenModalUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newPaymentName, setNewPaymentName] = useState<string | null>(null);
  const payments: Payment[] = useSelector((state: RootState) => state.payments);
  const dispatch = useDispatch();
  const updateCategory = async () => {
    setIsLoading(true);

    if (newPaymentName !== null && newPaymentName === "") {
      toast.error("Dữ liệu không được để trống.");
    } else {
      let updateObj = {
        name: newPaymentName || payment.name,
        image: newImage || payment.image,
      };
      const { data, error } = await supabase
        .from("payments")
        .update(updateObj)
        .eq("id", payment.id)
        .select()
        .single();
      if (error) {
        setIsLoading(false);
        toast.error("Lỗi. Thử lại");
      } else if (data) {
        let index = payments.findIndex((item) => item.id == payment.id);
        payments[index] = data;
        toast.success("Cập nhật thành công");
        dispatch(paymentAction("payments", payments));
        setNewImage(null);
      }
    }
    setIsLoading(false);
    setOpenModalUpdate(false);
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
            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-left text-base font-semibold text-gray-700"
                >
                  Tên danh mục
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={payment.name}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Ví dụ: Chữa răng"
                    onChange={(e) => setNewPaymentName(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-6 mt-4">
                <label
                  htmlFor="photo"
                  className="block text-sm text-left font-bold text-gray-700 mb-4"
                >
                  ĐỔI HÌNH ẢNH
                </label>
                <div className="mt-1 flex items-end gap-3">
                  {payment && (
                    <img
                      src={newImage || payment.image}
                      className="h-16 w-24 rounded-lg  object-cover"
                    />
                  )}
                  <button>
                    <Widget
                      publicKey={UPLOADCARE_KEY}
                      clearable
                      multiple={false}
                      onChange={(file) => {
                        if (file) {
                          setNewImage(convertImg(file.uuid!));
                        }
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
              <button
                data-modal-toggle="defaultModal"
                type="button"
                onClick={updateCategory}
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
          </div>
        </div>
      </div>
    </div>
  );
}
export default ModalUpdatePayment;
