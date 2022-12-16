import { Switch } from "@headlessui/react";
import { Table } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { statusMapping } from "../../constants/crm";
import { RootState } from "../../redux/reducers";
import { CustomerStatus } from "../../utils/types";
import ModalToggleActive from "../ModalToggleActive";
import ModalUpdateCustomerStatus from "./ModalUpdateStatus";

interface Props {
  customerStatus: CustomerStatus;
  index: number;
}
type ObjectKey = keyof typeof statusMapping;

function ItemCusStatus({ index, customerStatus }: Props) {
  const [openModalToggle, setOpenModalToggle] = useState<boolean>(false);
  const [selectedToggle, setSelectedToggle] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center ">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-white">
        {index}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-white">
        {customerStatus.name}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-white">
        {statusMapping[customerStatus.type as ObjectKey]}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-white">
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
      </Table.Cell>
      <Table.Cell
        onClick={() => {
          setOpenModalUpdate(true);
        }}
        className="whitespace-nowrap font-medium text-indigo-900 dark:text-white bg-white cursor-pointer"
      >
        Chỉnh sửa
      </Table.Cell>
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
    </Table.Row>
  );
}

export default ItemCusStatus;
