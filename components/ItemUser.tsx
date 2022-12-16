/* eslint-disable @next/next/no-img-element */
import { Table, TextInput } from "flowbite-react";
import moment from "moment";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { LiveChat, statusMapping } from "../constants/crm";
import { Clinic, CustomerStatusGroup, CustomerStatusReturn, User } from "../utils/types";
import VNProvinces from "../constants/VNProvince";
import { useEffect, useRef, useState } from "react";
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
  customerStatusGroup: CustomerStatusGroup;
}
type ObjectKey = keyof typeof statusMapping;
const hiddenTempValue = "temp";
function ItemUser({ index, user, customerStatusGroup }: Props) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(user.district);
  const [selectedCustomerStatus, setSelectedCustomerStatus] = useState<string | null>(
    user.status ? user.status.id : null
  );
  const [selectedDetailsStatus, setSelectedDetailsStatus] = useState<string | null>(
    user.details_status ? user.details_status.id : null
  );
  const [selectedInteractType, setSelectedInteractType] = useState<string | null>(
    user.interact_type ? user.interact_type.id : null
  );
  const [selectedInteractResult, setSelectedInteractResult] = useState<string | null>(
    user.interact_result ? user.interact_result.id : null
  );
  const [newPhone, setNewPhone] = useState<string>(user.phone);
  const [newAge, setNewAge] = useState<number | null>(user.age ? user.age : null);
  const users: User[] = useSelector((state: RootState) => state.users);

  const [edit, setEdit] = useState<string>("");
  const deleteEdit = useRef(null);
  useOutsideAlerter(deleteEdit);
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setEdit("");
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const dispatch = useDispatch();
  const updateUser = async (field: string, value: any) => {
    const updatedObj: any = {};
    updatedObj[field] = value;

    const { data, error } = await supabase
      .from("users")
      .update(updatedObj)
      .eq("id", user.id)
      .select("*,status(*),details_status(*),interact_type(*),interact_result(*)")
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
        <div ref={edit === "phone" ? deleteEdit : null}>
          <span
            className={`${
              edit === "phone" ? "hidden" : "block"
            } min-w-[120px] cursor-pointer ${user.phone ? "opacity-100" : "opacity-0"}}`}
            onClick={() => {
              setEdit("phone");
            }}
          >
            {user.phone}
          </span>
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
            className={`${
              edit === "phone" ? "block" : "hidden"
            } text-center rounded-md border-gray-300 
            shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm max-w-[120px]`}
          />
        </div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <div ref={edit === "age" ? deleteEdit : null}>
          <span
            className={`${
              edit === "age" ? "hidden" : "block"
            } min-w-[120px] cursor-pointer ${user?.age ? "opacity-100" : "opacity-0"}`}
            onClick={() => {
              setEdit("age");
            }}
          >
            {user?.age || hiddenTempValue}
          </span>
          <input
            type="number"
            name="age"
            id="age"
            defaultValue={user.age ? user.age : undefined}
            onChange={(e) => {
              setNewAge(parseInt(e.target.value));
            }}
            onBlur={() => {
              if (newAge !== user?.age) {
                updateUser("age", newAge);
              }
            }}
            className={`${
              edit === "age" ? "block" : "hidden"
            } text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm max-w-[120px]`}
          />
        </div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {moment(user.created_at).format("DD/MM/YYYY")}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {user.clinic}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px] ">
        <div ref={edit === "district" ? deleteEdit : null}>
          <span
            className={`${edit === "district" ? "hidden" : "block"} cursor-pointer ${
              user?.district ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setEdit("district");
            }}
          >
            {user?.district ? user?.district : hiddenTempValue}
          </span>
          <Select
            className={`${edit === "district" ? "block" : "hidden"}`}
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
        </div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white min-w-[200px] ">
        <div ref={edit === "status" ? deleteEdit : null}>
          <span
            className={`${edit === "status" ? "hidden" : "block"} cursor-pointer ${
              user.status ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setEdit("status");
            }}
          >
            {user.status ? user.status.name : hiddenTempValue}
          </span>
          <Select
            className={`${edit === "status" ? "block" : "hidden"}`}
            placeholder={"Vui lòng chọn"}
            defaultValue={
              user.status ? { label: user.status.name, value: user.status.id } : null
            }
            options={customerStatusGroup.status.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            onChange={(e) => {
              setSelectedCustomerStatus(e?.value ? e.value : null);
            }}
            onBlur={() => {
              const oldStatus = user.status ? user.status.id : null;
              if (selectedCustomerStatus !== oldStatus) {
                updateUser("status", selectedCustomerStatus);
              }
            }}
          ></Select>
        </div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px]">
        <div ref={edit === "details_status" ? deleteEdit : null}>
          <span
            className={`${
              edit === "details_status" ? "hidden" : "block"
            } cursor-pointer ${user.details_status ? "opacity-100" : "opacity-0"}`}
            onClick={() => {
              setEdit("details_status");
            }}
          >
            {user.details_status ? user.details_status.name : hiddenTempValue}
          </span>
          <Select
            className={`${edit === "details_status" ? "block" : "hidden"}`}
            placeholder={"Vui lòng chọn"}
            defaultValue={
              user.details_status
                ? { label: user.details_status.name, value: user.details_status.id }
                : null
            }
            options={customerStatusGroup.details_status.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            onChange={(e) => {
              setSelectedDetailsStatus(e?.value ? e.value : null);
            }}
            onBlur={() => {
              const oldDetailsStatus = user.details_status
                ? user.details_status.id
                : null;
              if (selectedDetailsStatus !== oldDetailsStatus) {
                updateUser("details_status", selectedDetailsStatus);
              }
            }}
          ></Select>
        </div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px] ">
        <div ref={edit === "interact_type" ? deleteEdit : null}>
          <span
            className={`${edit === "interact_type" ? "hidden" : "block"} cursor-pointer ${
              user.interact_type ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setEdit("interact_type");
            }}
          >
            {user.interact_type ? user.interact_type.name : hiddenTempValue}
          </span>
          <Select
            className={`${edit === "interact_type" ? "block" : "hidden"}`}
            placeholder={"Vui lòng chọn"}
            defaultValue={
              user.interact_type
                ? { label: user.interact_type.name, value: user.interact_type.id }
                : null
            }
            options={customerStatusGroup.interact_type.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            onChange={(e) => {
              setSelectedInteractType(e?.value ? e.value : null);
            }}
            onBlur={() => {
              const oldInteractType = user.interact_type ? user.interact_type.id : null;
              if (selectedInteractType !== oldInteractType) {
                updateUser("interact_type", selectedInteractType);
              }
            }}
          ></Select>
        </div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px]">
        <div ref={edit === "interact_result" ? deleteEdit : null}>
          <span
            className={`${
              edit === "interact_result" ? "hidden" : "block"
            } cursor-pointer ${user.interact_result ? "opacity-100" : "opacity-0"}`}
            onClick={() => {
              setEdit("interact_result");
            }}
          >
            {user.interact_result ? user.interact_result.name : hiddenTempValue}
          </span>
          <Select
            className={`${edit === "interact_result" ? "block" : "hidden"}`}
            placeholder={"Vui lòng chọn"}
            defaultValue={
              user.interact_result
                ? { label: user.interact_result.id, value: user.interact_result.name }
                : null
            }
            options={customerStatusGroup.interact_result.map((item) => {
              return {
                value: item.id,
                label: item.name,
              };
            })}
            onChange={(e) => {
              setSelectedInteractResult(e?.value ? e.value : null);
            }}
            onBlur={() => {
              const oldInteractResult = user.interact_result
                ? user.interact_result.id
                : null;
              if (selectedInteractResult !== oldInteractResult) {
                updateUser("interact_result", selectedInteractResult);
              }
            }}
          ></Select>
        </div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px]">
        <Select
          placeholder={"Vui lòng chọn"}
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
    </Table.Row>
  );
}
export default ItemUser;
