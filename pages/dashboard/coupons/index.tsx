import { Switch } from "@headlessui/react";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ModalToggleActive from "../../../components/ModalToggleActive";
import { couponsAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { convertVnd } from "../../../utils/helpers/convertToVND";
import { Coupon } from "../../../utils/types";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
function CouponsPage() {
  const coupons: Coupon[] = useSelector((state: RootState) => state.coupons);
  const [openModalToggle, setOpenModalToggle] = useState<boolean>(false);
  const [selectedToggle, setSelectedToggle] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  const dispatch = useDispatch();
  const getAllCoupon = async () => {
    let { data: counpons, error } = await supabase
      .from("coupons")
      .select(`*,service_id(*)`);
    if (error) {
      toast.error("Lỗi. Vui lòng tải lại trang");
      return;
    } else if (counpons) {
      //   console.log(counpons);
      dispatch(couponsAction("coupons", counpons));
    }
  };
  useEffect(() => {
    if (!coupons) {
      getAllCoupon();
    }
  });
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {coupons ? (
        <>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                Danh sách Coupon ({coupons.length})
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Danh sách thông tin tất cả các mã giảm giá đang được áp dụng tại MiniApp
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link href="/dashboard/coupons/create-coupon">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  Thêm Coupon
                </button>
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                      >
                        STT
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Tên
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Giá trị
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Hình ảnh
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Mô tả
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Ngày bắt đầu
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Ngày kết thúc
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {coupons.map((item, index: number) => (
                      <tr key={index}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                          {index}
                        </td>
                        <td className="whitespace-normal py-4 px-3 text-sm text-gray-500">
                          {item.name}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500">
                          {item?.price && `-${convertVnd(item.price)}`}
                          {item?.percent && `-${item.percent}%`}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500">
                          <div className="w-24 h-16">
                            <img className="w-full h-full rounded" src={item.image} />
                          </div>
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500 mint-ellipsis-three">
                          {item.description}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500">
                          {moment(item.start_date).format("DD/MM/YYYY")}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500">
                          {moment(item.end_date).format("DD/MM/YYYY")}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500">
                          <Switch
                            checked={item.active}
                            onClick={() => {
                              setSelectedToggle({
                                id: item.id,
                                status: !item.active,
                              });
                              setOpenModalToggle(true);
                            }}
                            className={classNames(
                              item.active ? "bg-indigo-600" : "bg-gray-200",
                              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                item.active ? "translate-x-5" : "translate-x-0",
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                          <div className="flex gap-3 ">
                            <Link href={`/dashboard/coupons/edit/${item.id}`}>
                              <div className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                Chỉnh sửa
                              </div>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
      {openModalToggle && selectedToggle && (
        <ModalToggleActive
          id={selectedToggle.id}
          status={selectedToggle.status}
          title="coupons"
          type="coupons"
          setOpenModalToggle={setOpenModalToggle}
        />
      )}
    </div>
  );
}
export default CouponsPage;
