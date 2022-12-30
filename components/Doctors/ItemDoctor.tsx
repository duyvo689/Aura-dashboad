import { useState } from "react";
import { Doctor } from "../../utils/types";
import { EditIcon } from "../Icons/Form";

const ItemDoctor = ({ doctor }: { doctor: Doctor }) => {
  return (
    <tr
      key={doctor.id}
      className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700 "
    >
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4 ">
        {doctor.name || "Chưa cập nhật"}
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4 ">
        {doctor.phone}
      </td>
      <td className="whitespace-nowrap py-3 px-2  first:px-4 last:px-4">
        <div className="w-24 h-16">
          <img
            className="w-full h-full rounded"
            src={doctor.avatar || "../images/default-avatar.png"}
          />
        </div>
      </td>
      <td className="whitespace-nowrap py-3 px-2 first:px-4 last:px-4 ">
        {doctor.clinic_id?.name}
      </td>
      {/* <td className="relative whitespace-nowrap py-3 px-2 first:px-4 last:px-4 ">
        <div className="cursor-pointer flex justify-center items-center">
          <EditIcon />
        </div>
      </td> */}
    </tr>
  );
};
export default ItemDoctor;
