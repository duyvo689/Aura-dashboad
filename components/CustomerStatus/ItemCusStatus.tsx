import { Switch } from "@headlessui/react";
import { Table } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { statusMapping, statusTypeColor } from "../../constants/crm";
import { RootState } from "../../redux/reducers";
import { CustomerStatus } from "../../utils/types";
import ModalToggleActive from "../ModalToggleActive";
import ModalUpdateCustomerStatus from "./ModalUpdateStatus";

interface Props {
  customerStatus: CustomerStatus;
  index: number;
}
type ObjectKey = keyof typeof statusMapping;
type ColorTypeKey = keyof typeof statusTypeColor;
function ItemCusStatus({ index, customerStatus }: Props) {
  const [openModalToggle, setOpenModalToggle] = useState<boolean>(false);
  const [selectedToggle, setSelectedToggle] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  return (
    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-center">
      <td className="whitespace-nowrap py-3 px-2 ">{index + 1}</td>
      <td className="whitespace-nowrap py-3 px-2 ">{customerStatus.name}</td>
      <td className="whitespace-nowrap py-3 px-2 ">
        <div
          className={`whitespace-nowrap font-medium inline-block py-1 px-2 rounded-full ${
            statusTypeColor[customerStatus.type as ColorTypeKey]
          }`}
        >
          {statusMapping[customerStatus.type as ObjectKey]}
        </div>
      </td>
      <td className="whitespace-nowrap py-3 px-2 ">
        <Switch
          checked={customerStatus.active}
          onClick={() => {
            setSelectedToggle({
              id: customerStatus.id,
              status: !customerStatus.active,
            });
            setOpenModalToggle(true);
          }}
          className={`
            ${customerStatus.active ? "bg-indigo-600" : "bg-gray-200"}
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          `}
        >
          <span
            aria-hidden="true"
            className={`
              ${customerStatus.active ? "translate-x-5" : "translate-x-0"}
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            `}
          />
        </Switch>
      </td>
      <td className="whitespace-nowrap text-center py-4 px-4 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
        <div
          onClick={() => {
            setOpenModalUpdate(true);
          }}
          className="whitespace-nowrap font-medium text-indigo-900 dark:text-white bg-white cursor-pointer"
        >
          Chỉnh sửa
        </div>
      </td>
      <td className={`${openModalUpdate || openModalToggle ? "block" : "hidden"}`}>
        {openModalToggle && selectedToggle && (
          <ModalToggleActive
            id={selectedToggle.id}
            status={selectedToggle.status}
            title="trạng thái"
            type="customerStatus"
            setOpenModalToggle={setOpenModalToggle}
          />
        )}
        {openModalUpdate && (
          <ModalUpdateCustomerStatus
            setOpenModalUpdate={setOpenModalUpdate}
            customerStatus={customerStatus}
          />
        )}
      </td>
    </tr>
  );
}

export default ItemCusStatus;
