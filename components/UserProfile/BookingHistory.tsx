import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { useState } from "react";
import { ListStatusBooking } from "../../utils/helpers/constant";
import { Booking } from "../../utils/types";
interface Props {
  bookings: Booking[];
}
function BookingHistory({ bookings }: Props) {
  const [amount, setAmount] = useState(4);
  const filtered = bookings.length > 0 ? bookings.slice(0, amount) : [];

  return (
    <div>
      <div className="text-base font-bold">Lịch sử đặt hẹn</div>
      <div className="flex flex-col divide-y">
        {filtered.map((item, index) => {
          return (
            <div key={index} className="flex flex-col gap-2  py-4">
              <div className="flex gap-4 items-center">
                <img className="w-12 h-8" src={item.clinic_id.avatar} />
                <div className="flex flex-col gap-1">
                  <div className="text-base font-semibold">Mã đặt hẹn #{item.id}</div>
                  <div className="text-sm">Vào lúc: {item.time_type}</div>
                  <div className="text-sm">
                    Ngày: {moment(item.date).format("YYYY-MM-DD")}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">
                  Trạng thái:
                  <span
                    className={`${
                      item.status === 4 ? " text-red-500" : " text-green-500"
                    } py-1 px-2 rounded-full `}
                  >
                    {ListStatusBooking[item.status - 1].title}
                  </span>
                </div>
                {item.old_booking_id && (
                  <div className="text-sm text-green-600">Tái khám</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {amount < bookings.length && (
        <div
          className="cursor-pointer text-indigo-600"
          onClick={() => {
            setAmount((preState) => preState + 4);
          }}
        >
          Hiển thị thêm
        </div>
      )}
    </div>
  );
}
export default BookingHistory;
