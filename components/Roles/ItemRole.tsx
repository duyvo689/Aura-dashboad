import { Table } from "flowbite-react";
import Link from "next/link";
import { Role } from "../../utils/types";

interface Props {
  index: number;
  item: Role;
}

function ItemRole({ index, item }: Props) {
  return (
    <Table.Row className="bg-white text-center ">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
        {index + 1}
      </Table.Cell>
      <Table.Cell>{item.phone}</Table.Cell>
      <Table.Cell>{item.position}</Table.Cell>
      {/* <Table.Cell>
        <div className="flex gap-1 justify-end">
          <button
            className="text-primary"
            // onClick={() => {
            //   setChain(item);
            //   setOpenModal(true);
            //   setIndexGenre(index);
            // }}
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
          </button>
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => {
              //   setOpenDelete(true);
              //   setChain(item);
              //   setIndexGenre(index);
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
          </button>
        </div>
      </Table.Cell> */}
    </Table.Row>
  );
}
export default ItemRole;
