/* eslint-disable @next/next/no-img-element */
import { Button, Table, TextInput } from "flowbite-react";
import moment from "moment";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { LiveChat, statusMapping } from "../../constants/crm";
import {
  Clinic,
  CustomerStatusGroup,
  CustomerStatusReturn,
  User,
} from "../../utils/types";
import VNProvinces from "../../constants/VNProvince";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { supabase } from "../../services/supaBaseClient";
import { usersAction } from "../../redux/actions/ReduxAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import NewBookingModal from "../NewBookingModal";
import Link from "next/link";
interface Props {
  user: User;
  customerStatusGroup: CustomerStatusGroup;
  clinics: Clinic[];
}

const hiddenTempValue = "temp";
function ItemUser({ user, customerStatusGroup, clinics }: Props) {
  // const [selectedDistrict, setSelectedDistrict] = useState<string | null>(user.district);
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
  const [selectedClinic, setSelectedClinic] = useState<string | null>(
    user.clinic ? user.clinic : null
  );
  const [selectedLiveChat, setSelectedLiveChat] = useState<string | null>(
    user.live_chat ? user.live_chat : null
  );
  const [newPhone, setNewPhone] = useState<string>(user.phone);
  const users: User[] = useSelector((state: RootState) => state.users);
  const [openCreateBookingModal, setOpenCreateBookingModal] = useState(false);
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

  return (
    <tr
      key={user.id}
      className="bg-white hover:bg-gray-100 border-b dark:bg-gray-900 dark:border-gray-700 text-sm "
    >
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4 ">
        <Link href={`/user-profile/${user.id}`}>
          <div className="flex items-center gap-3 cursor-pointer">
            {user.avatar ? (
              <img src={user.avatar} className="w-10 h-10 rounded-full" />
            ) : (
              <img
                src="../images/default-avatar.png"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex flex-col items-start justify-start font-medium text-slate-800 ">
              <div className="font-semibold">{user.name}</div>
              <div className="flex gap-1">
                {/* <MapPinIcon className="w-4 h-4 rounded-full" /> */}
                <div>Mã KH: </div>
                <div>{`KH-${user.id.split("-")[0].toUpperCase()}`}</div>
              </div>
            </div>
          </div>
        </Link>
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4">
        <div ref={edit === "phone" ? deleteEdit : null} className="max-w-[142px]">
          <span
            className={`${edit === "phone" ? "hidden" : "block"}  cursor-pointer ${
              user.phone ? "opacity-100" : "opacity-0"
            }`}
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
            className={`${edit === "phone" ? "inline" : "hidden"} form-input `}
          />
        </div>
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4  ">
        <div ref={edit === "clinic" ? deleteEdit : null}>
          <span
            className={`${edit === "clinic" ? "hidden" : "block"} cursor-pointer   ${
              user?.clinic ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setEdit("clinic");
            }}
          >
            {user.clinic ? user.clinic : hiddenTempValue}
          </span>
          <Select
            className={`${edit === "clinic" ? "block" : "hidden"} `}
            placeholder={"Vui lòng chọn"}
            defaultValue={user.clinic ? { label: user.clinic, value: user.clinic } : null}
            options={VNProvinces}
            onChange={(e) => {
              setSelectedClinic(e?.value ? e.value : null);
            }}
            onBlur={() => {
              if (selectedClinic !== user.clinic) {
                updateUser("clinic", selectedClinic);
              }
            }}
          ></Select>
        </div>
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4  ">
        <div ref={edit === "status" ? deleteEdit : null}>
          <span
            className={`${edit === "status" ? "hidden" : "block"} cursor-pointer   ${
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
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4  ">
        <div ref={edit === "livechat" ? deleteEdit : null}>
          <span
            className={`${edit === "livechat" ? "hidden" : "block"} cursor-pointer   ${
              user.live_chat ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setEdit("livechat");
            }}
          >
            {user.live_chat ? user.live_chat : hiddenTempValue}
          </span>
          <Select
            className={`${edit === "livechat" ? "block" : "hidden"}`}
            placeholder={"Vui lòng chọn"}
            defaultValue={
              user.live_chat ? { label: user.live_chat, value: user.live_chat } : null
            }
            options={LiveChat}
            onChange={(e) => {
              setSelectedLiveChat(e?.value ? e.value : null);
            }}
            onBlur={() => {
              if (selectedLiveChat !== user.live_chat) {
                updateUser("live_chat", selectedLiveChat);
              }
            }}
          ></Select>
        </div>
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4 ">
        {user?.customer_resource ? user?.customer_resource : user?.zalo_id && "Zalo"}
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4  ">
        <div ref={edit === "details_status" ? deleteEdit : null}>
          <span
            className={`${
              edit === "details_status" ? "hidden" : "block"
            } cursor-pointer   ${user.details_status ? "opacity-100" : "opacity-0"}`}
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
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4">
        <button
          className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
          onClick={() => {
            setOpenCreateBookingModal(true);
          }}
        >
          Đặt lịch hẹn
        </button>
        {openCreateBookingModal && (
          <NewBookingModal
            user={user}
            setOpenCreateBookingModal={setOpenCreateBookingModal}
          />
        )}
      </td>
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-white sticky z-10 left-[100px] min-w-[250px]">
        <Link href={`/user-profile/${user.id}`}>
          <div className="flex items-center gap-3 cursor-pointer">
            {user.avatar ? (
              <img src={user.avatar} className="w-10 h-10 rounded-full" />
            ) : (
              <img
                src="../images/default-avatar.png"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex flex-col items-start justify-start ">
              <div className="text-base text-sky-700">{user.name}</div>
              <div className="flex gap-1">
              
                <div className="text-sm">Mã KH: </div>
                <div className="text-sm text-slate-400 font-normal">
                  {`KH-${user.id.split("-")[0].toUpperCase()}`}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
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
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
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
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {moment(user.created_at).format("DD/MM/YYYY")}
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white min-w-[200px]">
        <div ref={edit === "clinic" ? deleteEdit : null}>
          <span
            className={`${edit === "clinic" ? "hidden" : "block"} cursor-pointer ${
              user?.clinic ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setEdit("clinic");
            }}
          >
            {user.clinic ? user.clinic : hiddenTempValue}
          </span>
          <Select
            className={`${edit === "clinic" ? "block" : "hidden"}`}
            placeholder={"Vui lòng chọn"}
            defaultValue={user.clinic ? { label: user.clinic, value: user.clinic } : null}
            options={clinics.map((item) => {
              return {
                label: item.district as string,
                value: item.district as string,
              };
            })}
            onChange={(e) => {
              setSelectedClinic(e?.value ? e.value : null);
            }}
            onBlur={() => {
              if (selectedClinic !== user.clinic) {
                updateUser("clinic", selectedClinic);
              }
            }}
          ></Select>
        </div>
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px] ">
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
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white min-w-[200px] ">
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
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px]">
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
      </Table.Cell> */}
      {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white  min-w-[200px]">
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
       
          <Button
            onClick={() => {
              setOpenCreateBookingModal(true);
            }}
          >
            Đặt lịch hẹn
          </Button>
          {openCreateBookingModal && (
            <NewBookingModal
              user={user}
              setOpenCreateBookingModal={setOpenCreateBookingModal}
            />
          )}
        </div>
      </Table.Cell> */}
    </tr>
  );
}
export default ItemUser;
