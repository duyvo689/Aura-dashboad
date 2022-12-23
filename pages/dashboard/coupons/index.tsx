import { Switch } from "@headlessui/react";
import moment from "moment";
import Head from "next/head";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CountRecord from "../../../components/CountRecord";
import ItemCoupon from "../../../components/Coupon/ItemCoupon";
import ModalToggleActive from "../../../components/ModalToggleActive";
import { couponsAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { CompareTwoDates } from "../../../utils/funtions";
import { convertVnd } from "../../../utils/helpers/convertToVND";
import { Coupon } from "../../../utils/types";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const listTagCoupon: any = [
  { id: "newacc", value: "Tài khoản mới" },
  { id: "birthday", value: "Ngày sinh nhật" },
  { id: "silver", value: "Hạng bạc" },
  { id: "diamond", value: "Hạng kim cương" },
  { id: "gold", value: "Hạng vàng" },
  { id: "platinum", value: "Platinum" },
  { id: "client", value: "Khách hàng" },
  { id: "orther", value: "Loại khác" },
];
function CouponsPage() {
  const coupons: Coupon[] = useSelector((state: RootState) => state.coupons);
  const dispatch = useDispatch();
  const getAllCoupon = async () => {
    let { data: counpons, error } = await supabase
      .from("coupons")
      .select(`*,service_id(*)`);
    if (error) {
      toast.error("Lỗi. Vui lòng tải lại trang");
      return;
    } else if (counpons) {
      dispatch(couponsAction("coupons", counpons));
    }
  };
  useEffect(() => {
    if (!coupons) {
      getAllCoupon();
    }
  }, [coupons]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Coupon</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {coupons ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">Danh sách coupons ✨</div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                <svg
                  className="w-4 h-4 fill-current opacity-50 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <Link href="/dashboard/coupons/create-coupon">
                  <span className="hidden xs:block ml-2">Thêm coupon</span>
                </Link>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="w-full overflow-x-auto relative shadow-md sm:rounded-lg">
              <CountRecord amount={coupons.length} title={"Danh sách người dùng"} />
              <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-slate-100 text-slate-500 uppercase font-semibold text-xs border border-slate-200 text-left ">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      Tên
                    </th>

                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      Giá trị
                    </th>

                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      Mô tả
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      Bắt đầu
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      Kết thúc
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      Hạn dùng
                    </th>

                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4"
                    >
                      Phân loại
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons.map((item, index: number) => (
                    <ItemCoupon key={index} index={index} coupon={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
export default CouponsPage;
