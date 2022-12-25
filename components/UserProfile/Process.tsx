import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supaBaseClient";
import { ListStatusBooking } from "../../utils/helpers/constant";
import { convertVnd } from "../../utils/helpers/convertToVND";
import { Booking, Checkout, Patient, User } from "../../utils/types";
interface Props {
  booking: Booking;
  user: User;
  checkout: Checkout | null;
}
const RenderBookingDetails = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-slate-400 text-sm font-semibold ">{label}:</div>
      <div className="text-sm font-bold text-slate-600">{value}</div>
    </div>
  );
};
function Process({ booking, user, checkout }: Props) {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="text-base font-bold text-slate-400">Đặt hẹn gần nhất</div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-600">
          <img
            className="w-10 h-10 rounded-full"
            src={user.avatar ? user.avatar : "../images/default-avatar.png"}
            alt="profile image"
          />
          <div>
            <div className="block">{user.name}</div>
            <div>
              {`
            Ngày đặt: ${moment(booking.date).format("DD/MM/YYYY")} vào lúc
            ${booking.time_type}`}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <RenderBookingDetails label={"Mã đặt hẹn"} value={`#${booking.id}`} />
          <RenderBookingDetails
            label={"Trạng thái"}
            value={`#${ListStatusBooking[booking.status - 1].title}`}
          />
          <RenderBookingDetails label={"Cơ sở"} value={booking?.clinic_id?.name} />
          <RenderBookingDetails label={"Địa chỉ"} value={booking?.clinic_id?.address} />
          {checkout && (
            <div className="mt-2">
              Tổng tiền thanh toán:
              <span className="text-lg text-red-600 font-bold">
                {" "}
                {checkout.coupons_id === null
                  ? convertVnd(checkout.totalPrice)
                  : convertVnd(checkout.totalCoupon)}
              </span>
            </div>
          )}
        </div>
        {booking.service_id && booking.service_id.length > 0 && (
          <div className="flex flex-col gap-2 ">
            <div className="text-base font-bold text-slate-600">Dịch vụ:</div>
            <div className="flex flex-col gap-4">
              {booking.service_id.map((item, index) => {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <img className="w-12 h-12 rounded-full" src={item.image} />
                    <div className="flex flex-col gap-1">
                      <RenderBookingDetails label={"Tên dịch vụ"} value={item.name} />
                      <RenderBookingDetails
                        label={"Giá"}
                        value={convertVnd(item.price)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {booking.doctor_id && booking.doctor_id.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-base font-bold text-slate-600">Bác sĩ:</div>
            <div className="flex flex-col gap-4">
              {booking.doctor_id.map((item, index) => {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={item.avatar ? item.avatar : "../images/default-avatar.png"}
                    />
                    <div className="flex flex-col gap-1">
                      <RenderBookingDetails label={"Họ tên"} value={item.name} />
                      <RenderBookingDetails label={"Số điện thoại"} value={item.phone} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {booking.description && booking.description !== "" && (
          <div>
            <div className="text-base font-bold text-slate-600">Ghi chú</div>
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
                    <img className="w-16 h-12" src={item} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default React.memo(Process);
