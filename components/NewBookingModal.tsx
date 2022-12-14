import { Button, Checkbox, Label, Modal, Textarea, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LiveChat } from "../constants/crm";
import { RootState } from "../redux/reducers";
import { Clinic, Doctor, Service } from "../utils/types";
import Select from "react-select";
function NewBookingModal() {
  const [open, setOpen] = useState(false);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const tempClinic = clinics.map((item) => {
    return {
      value: item.id,
      label: item.name,
      image: item.avatar,
      address: item.address,
    };
  });
  const tempServices = services?.map((item) => {
    return {
      value: item.id,
      label: item.name,
      image: item.image,
      price: item.price,
    };
  });

  return (
    <React.Fragment>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Đặt lịch hẹn
      </Button>
      <Modal show={open} size="3xl" popup={true}>
        <Modal.Header
          onClick={() => {
            setOpen(false);
          }}
        />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Đặt lịch hẹn mới
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Tên khách hàng" />
              </div>
              <TextInput id="name" placeholder="Nguyen Van A" required={true} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Chọn Cơ sở" />
              </div>
              {tempClinic && (
                <Select
                  placeholder="Vui lòng chọn"
                  options={tempClinic}
                  formatOptionLabel={(tempClinic) => (
                    <div className="flex gap-2 items-center">
                      <img
                        src={tempClinic.image}
                        className="w-10 h-10 rounded-full"
                        alt="country-image"
                      />
                      <span className="text-sm font-normal">{tempClinic.label}</span>
                    </div>
                  )}
                ></Select>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Bác sĩ" />
              </div>
              <TextInput id="name" placeholder="Nguyen Van A" required={true} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="service" value="Dịch vụ" />
              </div>
              <Select
                placeholder="Vui lòng chọn"
                options={tempServices}
                formatOptionLabel={(tempServices) => (
                  <div className="flex gap-2 items-center">
                    <img
                      src={tempServices.image}
                      className="w-10 h-10 rounded-full"
                      alt="country-image"
                    />
                    <span className="text-sm font-normal">{tempServices.label}</span>
                  </div>
                )}
              ></Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Ngày giờ" />
              </div>
              <TextInput
                type="datetime-local"
                id="name"
                placeholder="Nguyen Van A"
                required={true}
              />
            </div>
            <div id="textarea">
              <div className="mb-2 block">
                <Label htmlFor="comment" value="Ghi chú" />
              </div>
              <Textarea
                id="comment"
                placeholder="Ghi chú giúp bác sĩ hiểu rõ hơn khách hàng...."
                required={true}
                rows={4}
              />
            </div>
            <div className="w-full">
              <Button>Đặt hẹn</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
export default NewBookingModal;
