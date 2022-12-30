import { useState } from "react";
import { Staff } from "../../utils/types";
import { EditIcon } from "../Icons/Form";
import ModalUpdateStaff from "./ModalUpdateStaff";

const ItemStaff = ({ item }: { item: Staff }) => {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  return (
    <tr
      key={item.id}
      className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700"
    >
      <td className="whitespace-nowrap py-3 px-2 ">{item.name || "Chưa cập nhật"}</td>
      <td className="whitespace-nowrap py-3 px-2 ">{item.phone}</td>
      <td className="whitespace-nowrap py-3 px-2 ">
        <div className="w-24 h-16">
          <img
            className="w-full h-full rounded"
            src={item.avatar || "../images/default-avatar.png"}
          />
        </div>
      </td>
      <td className="whitespace-nowrap py-3 px-2 ">{item.email || "Chưa cập nhật"}</td>
      <td className="whitespace-nowrap py-3 px-2 ">{item.clinic_id?.name}</td>
      <td className="relative whitespace-nowrap py-3 px-2 ">
        <div
          onClick={() => {
            setOpenModalUpdate(true);
          }}
          className="cursor-pointer flex justify-center items-center"
        >
          <EditIcon />
        </div>
      </td>

      {openModalUpdate && (
        <td>
          <ModalUpdateStaff
            title={"Cập nhật thông tin users"}
            staff={item}
            setOpenModalUpdate={setOpenModalUpdate}
          />
        </td>
      )}
    </tr>
  );
};
export default ItemStaff;
