import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  bannersAction,
  categoryAction,
  clinicsAction,
  servicesAction,
} from "../redux/actions/ReduxAction";
import { Banner, Category, Clinic, Service } from "../utils/types";
import { RootState } from "../redux/reducers";
import { supabase } from "../services/supaBaseClient";
import toast from "react-hot-toast";
interface Props {
  id: string;
  title: string;
  type: string;
  setOpenModalDelete: any;
}
function ModalDelete({ id, title, type, setOpenModalDelete }: Props) {
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const banners: Banner[] = useSelector((state: RootState) => state.banners);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const category: Category[] = useSelector((state: RootState) => state.category);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const remove = async () => {
    setIsLoading(true);
    if (type === "banners") {
      const { data, error } = await supabase.from("banners").delete().eq("id", id);
      if (error) {
        toast("Có lỗi xảy ra. Vui lòng thử lại");
      } else {
        const tmpBanners = banners.filter((banner) => banner.id !== id);
        toast("Thao tác thành công");
        dispatch(bannersAction("banners", tmpBanners));
      }
    }
    if (type === "clinics") {
      const { data, error } = await supabase
        .from(" clinics")
        .update([{ active: false }])
        .eq("id", id);
      if (error) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại");
      } else {
        const tmpClinic = clinics.filter((clinic) => clinic.id !== id);
        toast.success("Thao tác thành công");
        dispatch(clinicsAction("clinics", tmpClinic));
      }
    }
    if (type === "services") {
      const { data, error } = await supabase
        .from("services")
        .update([{ active: false }])
        .eq("id", id);
      if (error) {
        toast("Có lỗi xảy ra. Vui lòng thử lại");
      } else {
        const tmpServices = services.filter((service) => service.id !== id);
        toast.success("Thao tác thành công");
        dispatch(servicesAction("services", tmpServices));
      }
    }
    if (type === "categories") {
      const { data, error } = await supabase
        .from("categories")
        .update([{ active: false }])
        .eq("id", id);
      if (error) {
        toast("Có lỗi xảy ra. Vui lòng thử lại");
      } else {
        const tmpCategory = category.filter((item) => item.id !== id);
        toast.success("Thao tác thành công");
        dispatch(categoryAction("category", tmpCategory));
      }
    }
    setOpenModalDelete(false);
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
                Xoá {title}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => {
                  setOpenModalDelete(false);
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
              <p className="text-base text-start leading-relaxed text-gray-500 dark:text-gray-400">
                Bạn có chắc là muốn xoá dữ liệu này?
              </p>
            </div>
            <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={isLoading ? () => {} : remove}
              >
                {isLoading ? "Đang xoá..." : "Xoá"}
              </button>

              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={() => {
                  isLoading ? () => {} : setOpenModalDelete(false);
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

export default ModalDelete;
