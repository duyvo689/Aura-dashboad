import { Switch } from "@headlessui/react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { CompareTwoDates } from "../../utils/funtions";
import { Coupon } from "../../utils/types";
import ModalToggleActive from "../ModalToggleActive";
import { convertVnd } from "../../utils/helpers/convertToVND";
import { EditIcon } from "../Icons/Form";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
interface Props {
  index: number;
  coupon: Coupon;
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
const convertTag = (text: string) => {
  for (const element of listTagCoupon) {
    if (element.id == text) {
      return element.value;
    }
  }
};
const ItemCoupon = ({ index, coupon }: Props) => {
  const [openModalToggle, setOpenModalToggle] = useState<boolean>(false);
  const [selectedToggle, setSelectedToggle] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  return (
    <>
      {openModalToggle && selectedToggle && (
        <ModalToggleActive
          id={selectedToggle.id}
          status={selectedToggle.status}
          title="coupons"
          type="coupons"
          setOpenModalToggle={setOpenModalToggle}
        />
      )}
      <tr className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700">
        <td className="py-3 px-2 first:px-4 last:px-4">{index + 1}</td>
        <td className="py-3 px-2 first:px-4 last:px-4 w-[300px]">
          <Link href={`/dashboard/coupons/detail/${coupon.id}`}>
            <div className="flex gap-3 cursor-pointer items-center">
              <div className="relative pt-16 pl-16 ">
                <div className="absolute top-0 left-0 w-full h-full">
                  <img className="rounded-xl w-full h-full" src={coupon.image} />
                </div>
              </div>
              <div className="min-ellipsis-three">{coupon.name}</div>
            </div>
          </Link>
        </td>

        <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4font-semibold  text-yellow-400">
          {coupon?.price && `- ${convertVnd(coupon.price)}`}
          {coupon?.percent && `- ${coupon.percent}%`}
        </td>
        <td className="py-3 px-2 first:px-4 last:px-4 ">
          <span className="min-ellipsis-three w-[300px]"> {coupon.description}</span>
        </td>
        <td className="py-3 px-2 first:px-4 last:px-4">
          {coupon.start_date ? moment(coupon.start_date).format("DD/MM/YYYY") : "..."}
        </td>
        <td className="py-3 px-2 first:px-4 last:px-4">
          {coupon.end_date ? moment(coupon.end_date).format("DD/MM/YYYY") : "..."}
        </td>
        <td className="py-3 px-2 first:px-4 last:px-4">
          {CompareTwoDates(Date.now(), coupon.end_date) ? (
            <div className="text-red-500 w-24 bg-red-200 rounded-full text-center p-1.5">
              Hết hạn
            </div>
          ) : (
            <div className="text-green-500 w-24 bg-green-200 rounded-full text-center p-1.5">
              Còn hạn
            </div>
          )}
        </td>
        <td className="py-3 px-2 first:px-4 last:px-4">
          <Switch
            checked={coupon.active}
            onClick={() => {
              setSelectedToggle({
                id: coupon.id,
                status: !coupon.active,
              });
              setOpenModalToggle(true);
            }}
            className={classNames(
              coupon.active ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                coupon.active ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </td>
        <td className="py-3 px-2 first:px-4 last:px-4">{convertTag(coupon.tag)}</td>
        <td className=" py-3 px-2 first:px-4 last:px-4">
          <div className="flex justify-center items-center ">
            <Link href={`/dashboard/coupons/edit/${coupon.id}`}>
              <div className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                <EditIcon />
              </div>
            </Link>
          </div>
        </td>
      </tr>
    </>
  );
};
export default ItemCoupon;
