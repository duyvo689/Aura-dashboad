import { Booking } from "../../utils/types";

const RenderMetricDetails = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1 p-4 first:pl-0">
      <div className="text-slate-400 text-xs font-semibold uppercase">{label}</div>
      <div className="text-base font-bold text-slate-600">{value}</div>
    </div>
  );
};
interface Props {
  bookings: Booking[];
}
const BookingMetrics = ({ bookings }: Props) => {
  const amountOfServices = bookings
    .filter((item) => item.status === 7)
    .reduce((accumulator, curentValue) => {
      return accumulator + curentValue.service_id.length;
    }, 0);
  const amountOfBooking = bookings.length;
  const amountOfRebooking = bookings.filter((item) => item.old_booking_id).length;
  const amountOfFinisedBooking = bookings.filter((item) => item.status === 7).length;
  const values = [
    {
      label: "Số lượng booking đã tạo",
      value: amountOfBooking === 0 ? 0 : amountOfBooking,
    },
    {
      label: "Số lượng booking hoàn thành",
      value: amountOfFinisedBooking === 0 ? 0 : amountOfFinisedBooking,
    },
    {
      label: "Số lượng dịch vụ đã sử dụng",
      value: amountOfServices === 0 ? 0 : amountOfServices,
    },
    {
      label: "Số lần tái khám",
      value: amountOfRebooking === 0 ? 0 : amountOfRebooking,
    },
  ];
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="uppercase text-sm text-slate-400 font-semibold">
        Booking Metrics
      </div>
      <div className="grid grid-cols-4 border-t border-slate-200  divide-x">
        {values.map((item, index) => {
          return (
            <RenderMetricDetails
              key={index}
              label={item.label}
              value={item.value.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};
export default BookingMetrics;
