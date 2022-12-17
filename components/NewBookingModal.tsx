/* eslint-disable @next/next/no-img-element */
import { Button, Checkbox, Label, Modal, Textarea, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LiveChat } from "../constants/crm";
import { RootState } from "../redux/reducers";
import { Clinic, Doctor, Service, User } from "../utils/types";
import Select from "react-select";
import { convertVnd } from "../utils/helpers/convertToVND";
import { createBookingCode } from "../utils/helpers/createBookingCode";
import moment from "moment";
import { supabase } from "../services/supaBaseClient";
import toast from "react-hot-toast";
import CalendarBooking from "../public/lottie/calendar-booking.json";
import Lottie from "lottie-react";
interface Props {
  user: User;
  setOpenCreateBookingModal: any;
}
type ConvertDoctor = {
  value: string;
  label: string;
  image: string | null;
  phone: string;
};
// const setDefaultClinic = (clinic: string | null, allClinic: Clinic[]) => {
//   if (!clinic) return null;
//   const defaultClinic = allClinic.find((item) => item.district === clinic);
//   if (defaultClinic) {
//     return {
//       value: defaultClinic.id,
//       label: defaultClinic.name,
//       image: defaultClinic.avatar,
//       address: defaultClinic.address,
//     };
//   } else {
//     return null;
//   }
// };
function NewBookingModal({ user, setOpenCreateBookingModal }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const doctors: Doctor[] = useSelector((state: RootState) => state.doctors);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [convertDoctorSelect, setConvertDoctorSelect] = useState<ConvertDoctor[] | null>(
    null
  );
  //if mapping default clinic from user

  const convertClinicSelect = clinics.map((item) => {
    return {
      value: item.id,
      label: item.name,
      image: item.avatar,
      address: item.address,
    };
  });
  const convertServiceSelect = services.map((item) => {
    return {
      value: item.id,
      label: item.name,
      image: item.image,
      price: item.price,
    };
  });
  useEffect(() => {
    if (selectedClinic !== null && doctors) {
      setConvertDoctorSelect(
        doctors
          .filter((item) => item.clinic_id.id === selectedClinic)
          .map((item) => {
            return {
              value: item.id,
              label: item.name,
              image: item.avatar,
              phone: item.phone,
            };
          })
      );
    }
  }, [selectedClinic, doctors]);
  const createNewBooking = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const doctor = doctors.find((item) => item.id === e.target.doctor.value);
    const service = services.find((item) => (item.id = e.target.service.value));
    const newBookingOpt = {
      id: createBookingCode(),
      date: moment(e.target.date.value).format(),
      time_type: moment(e.target.date.value).format("H:mm"),
      description: e.target.description.value,
      clinic_id: e.target.clinic.value,
      doctor_id: [doctor],
      service_id: [service],
      patient_id: user.id,
      status: 2,
    };
    const { data: newBooking, error: newBookingError } = await supabase
      .from("bookings")
      .insert([newBookingOpt])
      .select(`*,clinic_id(*),patient_id(*)`)
      .single();
    if (newBookingError) {
      toast.error("Lỗi.Thử lại");
    } else if (newBooking) {
      toast.success("Tạo booking thành công");
      setOpenCreateBookingModal(false);
    }
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <Modal show={true} size="3xl" popup={true}>
        <Modal.Header
          onClick={() => {
            setOpenCreateBookingModal(false);
          }}
        />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Đặt lịch hẹn mới
            </h3>

            <form onSubmit={createNewBooking} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="customerName"
                  value="Tên khách hàng"
                  className="required"
                />
                <TextInput
                  id="customerName"
                  placeholder="Nguyen Van A"
                  defaultValue={user.name}
                  type="text"
                  required={true}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="clinic" value="Chọn Cơ sở" className="required" />
                {convertClinicSelect && (
                  <Select
                    id="clinic"
                    name="clinic"
                    placeholder="Chọn cơ sở"
                    // defaultValue={setDefaultClinic(user.district, clinics)}
                    options={convertClinicSelect}
                    onChange={(e) => {
                      setSelectedClinic(e ? e.value : null);
                      setConvertDoctorSelect(null);
                    }}
                    formatOptionLabel={(convertClinicSelect) => (
                      <div className="flex gap-2 items-center">
                        <img
                          src={convertClinicSelect.image}
                          className="w-10 h-10 rounded-full"
                          alt="country-image"
                        />
                        <span className="text-sm font-normal">
                          {convertClinicSelect.label}
                        </span>
                      </div>
                    )}
                  ></Select>
                )}
              </div>
              {convertDoctorSelect && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="doctor" value="Bác sĩ" className="required" />
                  <Select
                    id="doctor"
                    name="doctor"
                    placeholder="Chọn bác sĩ"
                    options={convertDoctorSelect}
                    formatOptionLabel={(convertDoctorSelect) => (
                      <div className="flex gap-2 items-center">
                        <img
                          src={
                            convertDoctorSelect.image
                              ? convertDoctorSelect.image
                              : "../images/default-avatar.png"
                          }
                          className="w-10 h-10 rounded-full"
                          alt="country-image"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-normal">
                            {convertDoctorSelect.label}
                          </span>
                          <span className="text-sm font-semibold">
                            {convertDoctorSelect.phone}
                          </span>
                        </div>
                      </div>
                    )}
                    noOptionsMessage={({ inputValue }) =>
                      !inputValue && "Không có dữ liệu"
                    }
                  ></Select>
                </div>
              )}
              <div className="flex flex-col  gap-2">
                <Label htmlFor="service" value="Dịch vụ" className="required" />
                <Select
                  id="service"
                  name="service"
                  placeholder="Chọn dịch vụ"
                  options={convertServiceSelect}
                  formatOptionLabel={(convertServiceSelect) => (
                    <div className="flex gap-2 items-center">
                      <img
                        src={convertServiceSelect.image}
                        className="w-10 h-10 rounded-full"
                        alt="country-image"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-normal">
                          {convertServiceSelect.label}
                        </span>
                        <span className="text-sm font-semibold">
                          {convertVnd(convertServiceSelect.price)}
                        </span>
                      </div>
                    </div>
                  )}
                ></Select>
              </div>
              <div>
                <div className="mb-2 block required">
                  <Label htmlFor="date" value="Ngày giờ" />
                </div>
                <TextInput
                  name="date"
                  type="datetime-local"
                  id="date"
                  placeholder="Nguyen Van A"
                  required={true}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description" value="Ghi chú" />
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Ghi chú giúp bác sĩ hiểu rõ hơn khách hàng...."
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button type={`${isLoading ? "button" : "submit"}`}>
                  {isLoading ? "Đang tạo đặt hẹn..." : "Tạo đặt hẹn"}
                </Button>
                <Button
                  onClick={
                    isLoading
                      ? () => {}
                      : () => {
                          setOpenCreateBookingModal(false);
                        }
                  }
                  color="failure"
                >
                  Huỷ
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
export default NewBookingModal;
