import { Button, Table } from "flowbite-react";
import moment from "moment";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../../services/supaBaseClient";
import { User } from "../../../utils/types";
import { CSVLink, CSVDownload } from "react-csv";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { io } from "socket.io-client";
import { mainApi } from "../../../api/endpoint";
import ItemUser from "../../../components/ItemUser";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [socket, setSocket] = useState<any | null>(null);
  const callData = async (tab: string) => {
    tab == "user" && (await getAllUser());
    tab == "doctor" && (await getAllDoctor());
    tab == "staff" && (await getAllStaff());
  };

  const getAllStaff = async () => {
    let { data, error } = await supabase.from("staffs").select(`*`);
    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      setUsers(data);
    }
  };

  const getAllDoctor = async () => {
    let { data, error } = await supabase.from("doctors").select(`*`);
    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      setUsers(data);
    }
  };

  const getAllUser = async () => {
    const { data: users, error } = await supabase.from("users").select("*");
    if (error) {
      toast.error(error.message);
      return;
    }
    if (users) {
      setUsers(users);
    }
  };
  useEffect(() => {
    getAllUser();
  }, []);
  useEffect(() => {
    if (!socket) {
      setSocket(
        io(mainApi, {
          withCredentials: true,
          transports: ["websocket", "polling"],
        })
      );
    }
    if (socket) {
      socket.on("pancake_hook", (data: any) => {
        const index = users?.findIndex((item) => item.id === data.id);
        if (users && index) {
          users[index] = data;
          console.log(data);
          setUsers(users);
        }
      });
    }
  }, [socket]);
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6">
      <Head>
        <title>Người Dùng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {users ? (
        <main>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                NGƯỜI SỬ DỤNG ({users && users.length})
              </h1>
              <p className="mt-2 text-sm text-gray-700">Người dùng tham gia Aura ID.</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <div className="flex flex-col gap-3 items-center">
                <CSVLink data={users} filename={"users.csv"}>
                  <DocumentArrowDownIcon className="w-8 h-8" />
                </CSVLink>
                <div>Export CSV</div>
              </div>
            </div>
          </div>
          {/* <div className="mt-4">
            <Button.Group>
              <Button onClick={() => callData("user")} color="gray">
                KHÁCH HÀNG
              </Button>
              <Button onClick={() => callData("doctor")} color="gray">
                BÁC SĨ
              </Button>
              <Button onClick={() => callData("staff")} color="gray">
                NHÂN VIÊN
              </Button>
            </Button.Group>
          </div> */}
          <Table className="overflow-x-auto mt-8">
            <Table.Head>
              <Table.HeadCell className="whitespace-nowrap">STT</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Họtên</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Avatar</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Tuổi</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Ngày tạo</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Chi nhánh</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Quận Huyện</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Trạng thái KH</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">
                Trạng thái chi tiết
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">
                Dạng tương tác
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">
                Kết quả tương tác
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">
                Nhân viên LiveChat
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Nguồn khách</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">
                Cập nhật gần nhât
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Chi nhánh</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">Chi nhánh</Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap">
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.length > 0 &&
                users.map((item, index) => {
                  return <ItemUser key={index} user={item} index={index} />;
                })}
            </Table.Body>
          </Table>
          {/* <div className="mt-8 flex flex-col overflow-x-auto">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block overflow-x-auto w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          STT
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Họ tên
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Avatar
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Tuổi
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Chi Nhánh
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Trạng thái KH
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Trạng thái chi tiết
                        </th>

                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Dạng tương tác
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Kết quả tương tác
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Nhân viên LiveChat
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Nguồn khách
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Ngày cập nhật gần nhất
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Ngày tạo
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        ></th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users &&
                        users.map((user: any, index) => (
                          <tr key={index}>
                            <td className=" whitespace-nowrap px-3 py-3.5 pl-6 text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <Link
                              href={`/user-profile/${user.id}`}
                              className="cursor-pointer"
                            >
                              <td className="whitespace-nowrap px-3 py-3.5 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img
                                      className="h-full w-full rounded-full object-fit"
                                      src={
                                        user.avatar
                                          ? user.avatar
                                          : "https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png"
                                      }
                                      alt="anh dai dien"
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                    <div className="text-gray-500">
                                      {user.phone || "Chưa cập nhật"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </Link>
                            <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-500">
                              {moment(user.created_at).format("DD/MM/YYYY")}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3.5 text-end cursor-pointer text-sm text-indigo-500">
                              <Link href={`/user-profile/${user.id}`}>Xem chi tiết</Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div> */}
        </main>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
