import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { ListStatusBooking } from "../../utils/helpers/constant";
import { convertVnd } from "../../utils/helpers/convertToVND";
import { Booking, Patient } from "../../utils/types";
interface Props {
  booking: Booking;
  user: Patient;
}
function Process({ booking, user }: Props) {
  console.log(booking);
  return (
    <div className="px-12 shadow-lg w-3/4 flex flex-col gap-6">
      <div className="flex  items-center gap-2">
        <img className="w-10 h-10 rounded-full" src={user.avatar} alt="profile image" />
        <div>
          <div className="block">{user.name}</div>
          <div>
            {`
            Ngày đặt: ${moment(booking.date).format("DD/MM/YYYY")} vào lúc
            ${booking.time_type}`}
          </div>
        </div>
      </div>
      <div>
        <div>
          Mã đặt hẹn: <span className="font-bold"> #{booking.id}</span>
        </div>
        <div>
          Trạng thái:
          <span className="font-bold">
            {" "}
            {ListStatusBooking[booking.status - 1].title}
          </span>
        </div>
        <div>
          Cơ sở: <span className="font-bold">{booking?.clinic_id?.name}</span>
        </div>
        <div>
          Địa chỉ: <span className="font-bold"> {booking?.clinic_id?.address} </span>
        </div>
      </div>
      {booking.service_id && booking.service_id.length > 0 && (
        <div className="flex flex-col gap-2">
          <div>Dịch vụ:</div>
          <div className="flex flex-col gap-4">
            {booking.service_id.map((item, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <img className="w-20 h-20 rounded-full" src={item.image} />
                  <div className="flex flex-col gap-1">
                    <div>
                      Tên dịch vụ: <span className="font-bold"> {item.name}</span>
                    </div>
                    <div>
                      Giá: <span className="font-bold"> {convertVnd(item.price)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {booking.doctor_id && booking.doctor_id.length > 0 && (
        <div className="flex flex-col gap-2">
          <div>Bác sĩ:</div>
          <div className="flex flex-col gap-4">
            {booking.doctor_id.map((item, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <img className="w-20 h-20 rounded-full" src={item.avatar} />
                  <div className="flex flex-col gap-1">
                    <div>
                      Họ tên: <span className="font-bold"> {item.name}</span>
                    </div>
                    <div>
                      Số điện thoại: <span className="font-bold"> {item.phone}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {booking.description && booking.description !== "" && (
        <div>
          <div className="font-bold">Ghi chú</div>
          <div>{booking.description}</div>
        </div>
      )}
      {booking.image_details && booking.image_details.length > 0 && (
        <div>
          <div>Hình đính kèm</div>
          <div className="grid grid-cols-2 divide-x">
            {booking.image_details.map((item, index) => {
              return (
                <div key={index}>
                  <img className="w-20 h-20" src={item} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default Process;
