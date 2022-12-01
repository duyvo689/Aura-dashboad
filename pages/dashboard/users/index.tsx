import { Button } from "flowbite-react";
import moment from "moment";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../../services/supaBaseClient";
import { User } from "../../../utils/types";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [users, setUsers] = useState<User[] | null>(null);

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6">
      <Head>
        <title>Người Dùng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            NGƯỜI SỬ DỤNG ({users && users.length})
          </h1>
          <p className="mt-2 text-sm text-gray-700">Người dùng tham gia Aura ID.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"></div>
      </div>
      <div className="mt-4">
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
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Ngày gia nhập
                    </th>
                    {/* <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users &&
                    users.map((user: any, index) => (
                      <tr key={index}>
                        <td className=" whitespace-nowrap px-3 py-3.5 pl-6 text-sm text-gray-500">
                          {index + 1}
                        </td>
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
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-gray-500">
                                {user.phone || "Chưa cập nhật"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-500">
                          {moment(user.created_at).format("DD/MM/YYYY")}
                        </td>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-gray-900">{person.title}</div>
                          <div className="text-gray-500">{person.department}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.role}
                        </td> */}
                        {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </a>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-4 flex flex-col">
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                <table
                  className="min-w-full border-separate"
                  style={{ borderSpacing: 0 }}
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        STT
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        HÌNH
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        TÊN
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        SĐT
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        NGÀY THAM GIA
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {users &&
                      users.length > 0 &&
                      users.map((person, personIdx) => (
                        <tr key={person.id}>
                          <td
                            className={classNames(
                              personIdx !== people.length - 1
                                ? "border-b border-gray-200"
                                : "",
                              "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                            )}
                          >
                            {personIdx}
                          </td>
                          <td
                            className={classNames(
                              personIdx !== people.length - 1
                                ? "border-b border-gray-200"
                                : "",
                              "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                            )}
                          >
                            <div className="w-16 h- ">
                              <img
                                className="w-full h-full rounded-full object-cover"
                                alt="Chờ cập nhật"
                                src={
                                  person.avatar
                                    ? person.avatar
                                    : "https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png"
                                }
                              />
                            </div>
                          </td>
                          <td
                            className={classNames(
                              personIdx !== people.length - 1
                                ? "border-b border-gray-200"
                                : "",
                              "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
                            )}
                          >
                            {person.name ? person.name : "Chờ cập nhật"}
                          </td>
                          <td
                            className={classNames(
                              personIdx !== people.length - 1
                                ? "border-b border-gray-200"
                                : "",
                              "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                            )}
                          >
                            {person.phone ? person.phone : "Chờ cập nhật"}
                          </td>
                          <td
                            className={classNames(
                              personIdx !== people.length - 1
                                ? "border-b border-gray-200"
                                : "",
                              "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
                            )}
                          >
                            {moment(person.created_at).format("DD/MM/YYYY")}
                          </td>
                          <td
                            className={classNames(
                              personIdx !== people.length - 1
                                ? "border-b border-gray-200"
                                : "",
                              "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
                            )}
                          >
                            {person.id}
                          </td>
                          <td
                            className={classNames(
                              personIdx !== people.length - 1
                                ? "border-b border-gray-200"
                                : "",
                              "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
                            )}
                          >
                            <span
                              onClick={() => alert("Không cho phép chỉnh sửa")}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit<span className="sr-only">, {person.name}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> */}
    </div>
  );
}
