import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import BronzeMedal from "../../public/ranking/Bronze-Medal";
import BronzeMedalIcon from "../../public/ranking/Bronze-Medal";
import GoldMedal from "../../public/ranking/Gold-Medal";
import SilverMedal from "../../public/ranking/Silver-Medal";
import { convertVnd } from "../../utils/helpers/convertToVND";
import { Booking, User } from "../../utils/types";

interface Props {
  userInfo: User;
  bookings: Booking[];
}
const UserDetails = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-slate-400 text-xs font-semibold">{label}</div>
      <div className="text-sm font-bold text-slate-600">{value}</div>
    </div>
  );
};
function UserInfo({ userInfo, bookings }: Props) {
  const totalSpeding = bookings
    .filter((item) => item.status === 7)
    .reduce((accomulator, currentValue) => {
      return (
        accomulator +
        currentValue.service_id.reduce((amount, item) => amount + item.price, 0)
      );
    }, 0);
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="uppercase text-sm text-slate-400 font-semibold">
        Thông tin khách hàng
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex gap-2">
          <img
            src={userInfo.avatar ? userInfo.avatar : "../images/default-avatar.png"}
            className="w-28 h-28 rounded-full"
            alt="User Profile"
          />
          <div className="flex flex-col justify-between">
            <UserDetails label={"Name"} value={userInfo.name} />
            <div className="flex flex-col ">
              <div className="text-slate-400 text-xs font-semibold">Nguồn khách</div>
              <div className="flex gap-1">
                {userInfo.customer_resource && (
                  <button className="bg-blue-100 py-1 px-2 text-blue-400 rounded-lg text-xs font-bold">
                    Facebook
                  </button>
                )}
                {userInfo.zalo_id && (
                  <button className="bg-green-200 py-1 px-2 text-green-500 rounded-lg text-xs">
                    Zalo
                  </button>
                )}
                {!userInfo.customer_resource && !userInfo.zalo_id && (
                  <button className="bg-slate-200 py-1 px-2 text-slate-500 rounded-lg text-xs">
                    Chưa xác định
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <UserDetails
            label={"Email"}
            value={userInfo.email ? userInfo.email : "Chưa cập nhật"}
          />
          <UserDetails label={"Số điện thoại"} value={userInfo.phone} />
        </div>
        <div className="flex flex-col justify-between">
          <UserDetails label={"ID"} value={userInfo.id} />
          <UserDetails label={"Tổng chi tiêu"} value={convertVnd(totalSpeding)} />
        </div>
        {/* <div className="text-xs ">
          <div className="text-[#6b7280]">Email Address</div>
          <div className="font-medium">{userInfo.email || "Chưa cập nhật"}</div>
        </div>
        <div className="text-xs ">
          <div className="text-[#6b7280]">Địa chỉ</div>
          <div className="font-medium">{userInfo.address || "Chưa cập nhật"}</div>
        </div>
        <div className="text-xs ">
          <div className="text-[#6b7280]">Số điện thoại</div>
          <div className="font-medium">{userInfo.phone}</div>
        </div>
        <div className="mt-2">
          <div className="text-lg font-bold">Hạng thành viên</div>
          <div className="flex gap-4 items-center">
            <BronzeMedal />
          
          </div>
        </div> */}
      </div>
    </div>
  );
}
export default UserInfo;
