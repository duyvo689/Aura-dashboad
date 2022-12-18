import { ListStatusBooking } from "../../constants";
import { dateAgo } from "../../utils/helpers/convertDate";
import { convertTime } from "../../utils/helpers/convertTime";
import { Booking } from "../../utils/types";
import { convertISOtoDate } from "../../utils/helpers/convertDate";
interface Props {
  booking: Booking;
}
function ItemBooking({ booking }: Props) {
  return (
    <div className="bg-white w-full rounded-lg py-3 px-4 mb-4 border drop-shadow">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div
            className="px-3 py-1  rounded-2xl"
            style={{ color: "#007D3A", backgroundColor: "#D7FAE0" }}
          >
            {ListStatusBooking[booking.status - 1]?.title || "None"}
          </div>
          <div
            className="px-3 py-1 rounded-2xl"
            style={{
              color: "#ED5E83",
              backgroundColor: "rgba(237, 94, 131, 0.31)",
            }}
          >
            {dateAgo(booking?.date)}
          </div>
        </div>
        <div
          className="flex items-center gap-2 p-2"
          style={{ borderBottom: "1px solid #EBEBF0" }}
        >
          <img className="w-10 h-10 rounded-lg" src={booking?.patient_id?.avatar} />
          <div className="flex flex-col whitespace-nowrap gap-1">
            <div className="text-sm font-medium">{booking?.patient_id?.name}</div>
            <div className="text-xs font-normal">{booking?.patient_id?.name}</div>
          </div>

          {booking.old_booking_id && (
            <div
              className="shrink w-full text-end text-medium font-bold"
              style={{ color: "#007D3A" }}
            >
              Tái khám
            </div>
          )}
        </div>
        <div className="flex items-center justify-between flex-wrap">
          <div className="text-sm font-medium">
            {convertTime(booking.time_type)} - {convertISOtoDate(booking?.date)}
          </div>
          {booking?.service_id.length > 0 &&
            booking?.service_id.map((service: any, index: number) => {
              return (
                index === 0 && (
                  <div key={index} className="text-sm font-bold truncate">
                    {service.name}
                  </div>
                )
              );
            })}
        </div>
      </div>
    </div>
  );
}
export default ItemBooking;
