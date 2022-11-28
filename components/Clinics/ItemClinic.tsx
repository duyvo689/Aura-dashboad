import { Table } from "flowbite-react";
import Link from "next/link";
import { useState } from "react";
import { Clinic } from "../../utils/types";
import ModalDelete from "../ModalDelete";
interface Props {
  index: number;
  item: Clinic;
}

function ItemRole({ index, item }: Props) {
  const [toggle, setToggle] = useState(true);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  return (
    <>
      {openModalDelete && (
        <ModalDelete
          id={item.id!}
          type="clinics"
          title={"clinic"}
          setOpenModalDelete={setOpenModalDelete}
        />
      )}
      <Table.Row className="bg-white text-center ">
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
          {index + 1}
        </Table.Cell>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>{item.address}</Table.Cell>
        <Table.Cell>{item.description}</Table.Cell>
        <Table.Cell>
          <div className="flex justify-center">
            <img className="w-10 h-10" src={item.avatar} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className="flex gap-1 justify-end">
            <Link
              href={`/dashboard/clinics/edit/${item.id}`}
              className="text-primary cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
            {/* <button
              className="text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => {
                setOpenModalDelete(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button> */}
          </div>
        </Table.Cell>
      </Table.Row>
    </>
  );
}
export default ItemRole;
