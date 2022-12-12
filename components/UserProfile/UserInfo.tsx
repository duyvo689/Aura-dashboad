import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import BronzeMedal from "../../public/ranking/Bronze-Medal";
import BronzeMedalIcon from "../../public/ranking/Bronze-Medal";
import GoldMedal from "../../public/ranking/Gold-Medal";
import SilverMedal from "../../public/ranking/Silver-Medal";
import { Patient } from "../../utils/types";

interface Props {
  userInfo: Patient;
}
function UserInfo({ userInfo }: Props) {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col gap-2">
        <img src={userInfo.avatar} className="w-20 h-20 rounded-lg" alt="User Profile" />
        <div className="text-xl font-bold">{userInfo.name}</div>
        <div className="flex gap-1 items-center">
          <UserPlusIcon className="w-5 h-5" />
          <div className="text-sm text-[#6b7280]">Khách hàng mới</div>
        </div>
        <div className="flex gap-1 items-center">
          <MapPinIcon className="w-5 h-5" />
          <div className="text-sm text-[#6b7280]">{"Chưa cập nhật"}</div>
        </div>
      </div>
      <div className="text-sm ">
        <div className="text-[#6b7280]">Email Address</div>
        <div className="font-medium">{userInfo.email || "Chưa cập nhật"}</div>
      </div>
      <div className="text-sm ">
        <div className="text-[#6b7280]">Địa chỉ</div>
        <div className="font-medium">{userInfo.address || "Chưa cập nhật"}</div>
      </div>
      <div className="text-sm ">
        <div className="text-[#6b7280]">Số điện thoại</div>
        <div className="font-medium">{userInfo.phone}</div>
      </div>
      <div className="mt-2">
        <div className="text-lg font-bold">Hạng thành viên</div>
        <div className="flex gap-4 items-center">
          <BronzeMedal />
          {/* <SilverMedal />
          <GoldMedal /> */}
        </div>
      </div>
    </div>
  );
}
export default UserInfo;
