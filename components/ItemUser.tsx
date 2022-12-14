/* eslint-disable @next/next/no-img-element */
import { Table, TextInput } from "flowbite-react";
import moment from "moment";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import {
  crmStatus,
  detailsStatus,
  interacteResult,
  interacType,
  LiveChat,
} from "../constants/crm";
import { Clinic, User } from "../utils/types";
import VNProvinces from "../constants/VNProvince";
import { useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { supabase } from "../services/supaBaseClient";
import { usersAction } from "../redux/actions/ReduxAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import NewBookingModal from "./NewBookingModal";
interface Props {
  index: number;
  user: User;
  clinics: Clinic[];
}

function ItemUser({ index, user, clinics }: Props) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCustomerStatus, setSelectedCustomerStatus] = useState<number | null>(
    null
  );
  const [selectedDetailsStatus, setSelectedDetailsStatus] = useState<number | null>(null);
  const [selectedInteractType, setSelectedInteractType] = useState<number | null>(null);
  const [selectedInteractResult, setSelectedInteractResult] = useState<number | null>(
    null
  );
  const [newPhone, setNewPhone] = useState<string>(user.phone);
  const [newAge, setNewAge] = useState<number | null>(user.age ? user.age : null);
  const users: User[] = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const updateUser = async (field: string, value: any) => {
    const updatedObj: any = {};
    updatedObj[field] = value;
    const { data, error } = await supabase
      .from("users")
      .update(updatedObj)
      .eq("id", user.id)
      .select()
      .single();
    if (error) {
      toast.error("Lỗi.Thử lại");
    } else if (data) {
      const index = users.findIndex((item) => item.id === data.id);

      if (users) {
        users[index] = data;
        dispatch(usersAction("users", [...users]));
      }
      toast.success("Cập nhật thành công");
    }
  };
  // console.log(
  //   LiveChat.find((item) => {
  //     return item.value === user.live_chat;
  //   })
  // );
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center ">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-white sticky z-10 left-0 min-w-[100px]">
        {index}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-white sticky z-10 left-[100px] min-w-[250px]">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} className="w-10 h-10 rounded-full" />
          ) : (
            <img src="../images/default-avatar.png" className="w-10 h-10 rounded-full" />
          )}
          <div className="flex flex-col items-start justify-start ">
            <div className="text-base text-sky-700">{user.name}</div>
            <div className="flex gap-1">
              <MapPinIcon className="w-4 h-4 rounded-full" />
              <div className="text-sm text-slate-400">
                {user?.address ? user.address : "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <input
          type="text"
          name="phone"
          id="phone"
          defaultValue={user.phone}
          onChange={(e) => {
            setNewPhone(e.target.value);
          }}
          onBlur={() => {
            if (newPhone !== user.phone) {
              updateUser("phone", newPhone);
            }
          }}
          className="block text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm max-w-[120px]"
        />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <input
          type="number"
          name="age"
          id="age"
          defaultValue={user?.age}
          onChange={(e) => {
            setNewAge(parseInt(e.target.value));
          }}
          onBlur={() => {
            if (newAge !== user?.age) {
              updateUser("age", newAge);
            }
          }}
          className="block text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm max-w-[120px]"
        />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {moment(user.created_at).format("DD/MM/YYYY")}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {user.clinic}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px] ">
        <Select
          placeholder={"Vui lòng chọn"}
          defaultValue={
            user.district
              ? VNProvinces.find((item) => item.value === user?.district)
              : null
          }
          options={VNProvinces}
          onChange={(e) => {
            setSelectedDistrict(e?.value ? e.value : null);
          }}
          onBlur={() => {
            if (selectedDistrict !== user?.district) {
              updateUser("district", selectedDistrict);
            }
          }}
        ></Select>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white min-w-[200px]  ">
        <Select
          placeholder={"Vui lòng chọn"}
          defaultValue={user.status ? crmStatus[user.status - 1] : null}
          options={crmStatus}
          onChange={(e) => {
            setSelectedCustomerStatus(e?.value ? e.value : null);
          }}
          onBlur={() => {
            if (selectedCustomerStatus !== user?.status) {
              updateUser("status", selectedCustomerStatus);
            }
          }}
        ></Select>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px]">
        <Select
          placeholder={"Vui lòng chọn"}
          defaultValue={
            user.details_status ? detailsStatus[user.details_status - 1] : null
          }
          options={detailsStatus}
          onChange={(e) => {
            setSelectedDetailsStatus(e?.value ? e.value : null);
          }}
          onBlur={() => {
            if (selectedDetailsStatus !== user?.details_status) {
              updateUser("details_status", selectedCustomerStatus);
            }
          }}
        ></Select>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px] ">
        <Select
          placeholder={"Vui lòng chọn"}
          defaultValue={user.interact_type ? interacType[user.interact_type - 1] : null}
          options={interacType}
          onChange={(e) => {
            setSelectedInteractType(e?.value ? e.value : null);
          }}
          onBlur={() => {
            if (selectedInteractType !== user?.interact_type) {
              updateUser("interact_type", selectedInteractType);
            }
          }}
        ></Select>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px]">
        <Select
          placeholder={"Vui lòng chọn"}
          defaultValue={
            user.interact_result ? interacteResult[user.interact_result - 1] : null
          }
          options={interacteResult}
          onChange={(e) => {
            setSelectedInteractResult(e?.value ? e.value : null);
          }}
          onBlur={() => {
            if (selectedInteractResult !== user?.interact_result) {
              updateUser("interact_result", selectedInteractResult);
            }
          }}
        ></Select>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px]">
        <Select
          defaultValue={
            user.live_chat ? { label: user.live_chat, value: user.live_chat } : null
          }
          options={LiveChat}
        ></Select>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {user?.customer_resource ? user?.customer_resource : user?.zalo_id && "Zalo"}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {user?.last_update}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <div className="flex gap-1">
          {/* <CalendarIcon stroke="red" /> */}
          {/* <div className="text-green-300 text-base font-bold">Đặt lịch hẹn</div> */}
          <NewBookingModal />
        </div>
      </Table.Cell>
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {user?.last_update}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {user?.last_update}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {user?.last_update}
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <a
          href="/tables"
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Edit
        </a>
      </Table.Cell> */}
    </Table.Row>
  );
}
export default ItemUser;
