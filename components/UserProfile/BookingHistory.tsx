import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { useState } from "react";
import { ListStatusBooking } from "../../utils/helpers/constant";
import { Booking } from "../../utils/types";
interface Props {
  bookings: Booking[];
}
const RenderBookingDetails = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-slate-400 text-sm font-semibold ">{label}:</div>
      <div className="text-sm font-bold text-slate-600">{value}</div>
    </div>
  );
};
function BookingHistory({ bookings }: Props) {
  const [amount, setAmount] = useState(4);
  const filtered = bookings.length > 0 ? bookings.slice(0, amount) : [];
  return (
    <div className="flex flex-col gap-4">
      <div className="text-base font-bold text-slate-400">Lịch sử đặt hẹn</div>
      <div className="flex flex-col divide-y">
        {filtered.length > 0 ? (
          filtered.map((item, index) => {
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <img className="w-20 h-16 rounded-lg" src={item.clinic_id.avatar} />
                  <div className="flex flex-col">
                    <RenderBookingDetails label={"Mã đặt hẹn"} value={`#${item.id}`} />
                    <RenderBookingDetails label={"Vào lúc"} value={item.time_type} />
                    <RenderBookingDetails
                      label={"Ngày"}
                      value={moment(item.date).format("DD-MM-YYYY")}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-semibold">
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
          })
        ) : (
          <div>Chưa có dữ liệu</div>
        )}
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
