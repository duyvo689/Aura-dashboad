import { Fragment, useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import moment from "moment";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import { Booking } from "../../../utils/types";
import { supabase } from "../../../services/supaBaseClient";
import ItemBooking from "../../../components/Bookings/ItemBooking";
import NoItemFound from "../../../components/NotItemFound";
import { ListStatusBooking, listTimeOfDay } from "../../../constants";
import _ from "lodash";
import { convertVnd } from "../../../utils/helpers/convertToVND";
import { convertDateToVN } from "../../../utils/helpers/convertDate";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
const getMonthAndYear = (isGetDate?: boolean) => {
  if (isGetDate) {
    return `${moment().format("MMMM D")}, ${moment().year()}`;
  } else {
    return `${moment().format("MMMM")} ${moment().year()}`;
  }
};
type groupByTime = {
  [key: string]: Booking[];
};

interface BookingManage {
  data: Booking[];
  groupByTime: groupByTime;
}
type ObjectKey = keyof groupByTime;
export default function Example() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState({
    year: moment().year(),
    month: moment().month() + 1,
    day: new Date().getDate(),
  });
  const [bookings, setBookings] = useState<BookingManage | null>(null);
  const getAllBookingByDate = async (dateString: string) => {
    setIsLoading(true);
    const { data: allBookings, error } = await supabase
      .from("bookings")
      .select(`*,clinic_id(*),patient_id(*)`)
      .match({ date: dateString })
      .order("time_type", { ascending: true });
    //console.log(allBookings);
    if (error) {
      console.log(error);
      return;
    } else if (allBookings) {
      setBookings({
        data: allBookings as any as Booking[],
        groupByTime: _.groupBy(allBookings, "time_type") as any as {
          [key: string]: Booking[];
        },
      });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    //get booking in one day
    let timer = setTimeout(() => {
      getAllBookingByDate(`${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [selectedDay]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-5">
        <div className="sm:flex flex-col gap-4">
          <div className="text-2xl font-bold text-slate-800">Danh sách đặt hẹn ✨</div>
          <div className="text-base font-bold text-slate-500">
            {`${convertDateToVN(
              moment(
                `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`
              ).format("dddd")
            )} ${selectedDay.day}/${selectedDay.month}/${selectedDay.year}`}
          </div>
        </div>
        <div className="grid grid-cols-8 bg-white rounded-lg">
          {!isLoading ? (
            <div className="col-span-5 2xl:col-span-6">
              {bookings && bookings.data.length > 0 ? (
                <div className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-200">
                  {Object.keys(bookings.groupByTime).map((item, index: number) => {
                    return (
                      <div key={index} className="flex">
                        <div className="text-right text-sm font-bold leading-5 text-gray-400 p-4 border-r border-gray-200  flex items-center justify-center">
                          {item.slice(0, -3)}
                        </div>
                        <div className="w-full p-4">
                          {bookings ? (
                            <div className="flex flex-col gap-3 ">
                              {bookings.groupByTime[item.toString()]?.map(
                                (item, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className={`group inset-1 flex flex-col text-sm  overflow-y-auto rounded-lg p-4 leading-5  ${
                                        item.status === 4
                                          ? "bg-pink-50 hover:bg-pink-100 "
                                          : " bg-blue-50 hover:bg-blue-100"
                                      }`}
                                    >
                                      <div
                                        className={`font-bold ${
                                          item.status === 4
                                            ? "text-pink-500 group-hover:text-pink-700"
                                            : "text-blue-500 group-hover:text-blue-700"
                                        }`}
                                      >
                                        {ListStatusBooking[item.status - 1].title}
                                      </div>
                                      <div className="grid grid-cols-5 gap-3">
                                        <div className="col-span-1">
                                          <div className="flex flex-col">
                                            <div className="font-bold">#{item.id}</div>
                                            <div>{item.patient_id.name}</div>
                                            <div>{item.patient_id?.phone}</div>
                                          </div>
                                        </div>
                                        <div className="col-span-2">
                                          <div className="flex flex-col gap-2">
                                            <div className="font-bold">Dịch vụ:</div>
                                            {item.service_id.map(
                                              (item, index: number) => {
                                                return (
                                                  <div
                                                    key={index}
                                                    className="flex items-center justify  gap-2"
                                                  >
                                                    <img
                                                      src={item.image}
                                                      className="w-16 h-12 rounded-md object-cover"
                                                      alt={item.name}
                                                    />
                                                    <div className="flex flex-col text-sm gap-1">
                                                      <p className="w-40 truncate">
                                                        {item.name}
                                                      </p>
                                                      <div>{convertVnd(item.price)}</div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-span-2">
                                          <div className="flex flex-col gap-2">
                                            <div className="font-bold">
                                              Bác sĩ phụ trách:
                                            </div>
                                            {item.doctor_id.map((item, index: number) => {
                                              return (
                                                <div
                                                  key={index}
                                                  className="flex items-center gap-2"
                                                >
                                                  <img
                                                    src={
                                                      item.avatar ||
                                                      "../images/default-avatar.png"
                                                    }
                                                    className="w-14 h-10 rounded-md object-cover"
                                                    alt={item.name}
                                                  />
                                                  <div className="flex flex-col text-sm gap-1">
                                                    <div>{item.name}</div>
                                                    <div>{item.phone}</div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 text-center">Chưa có đặt hẹn hôm nay</div>
              )}
            </div>
          ) : (
            <div className="col-span-5 2xl:col-span-6">
              <div className="p-4">Đang tải dữ liệu...</div>
            </div>
          )}
          <div className="col-span-3 2xl:col-span-2">
            <div className=" max-w-md items-center border-l border-gray-100 px-8 py-4 bg-white">
              <Calendar
                calendarClassName="custom-calendar"
                colorPrimary="#9c88ff"
                value={selectedDay}
                onChange={(e: any) => {
                  setSelectedDay(e as any);
                }}
              />
              <div className="flex flex-col gap-3 mt-4">
                <div className="text-base font-bold">
                  Danh sách đặt hẹn ngày:
                  {` ${selectedDay.day}/${selectedDay.month}/${selectedDay.year}`}
                </div>
                {bookings && bookings.data.length > 0 ? (
                  bookings.data.map((item, index: number) => {
                    return <ItemBooking booking={item} key={index} />;
                  })
                ) : (
                  <NoItemFound />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
