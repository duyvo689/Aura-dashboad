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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
import { usersAction } from "../../../redux/actions/ReduxAction";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const users: User[] = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<any | null>(null);
  // const callData = async (tab: string) => {
  //   tab == "user" && (await getAllUser());
  //   tab == "doctor" && (await getAllDoctor());
  //   tab == "staff" && (await getAllStaff());
  // };

  // const getAllStaff = async () => {
  //   let { data, error } = await supabase.from("staffs").select(`*`);
  //   if (error) {
  //     toast(error.message);
  //     return;
  //   }
  //   if (data) {
  //     setUsers(data);
  //   }
  // };

  // const getAllDoctor = async () => {
  //   let { data, error } = await supabase.from("doctors").select(`*`);
  //   if (error) {
  //     toast(error.message);
  //     return;
  //   }
  //   if (data) {
  //     setUsers(data);
  //   }
  // };

  const getAllUser = async () => {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    if (users) {
      dispatch(usersAction("users", users));
    }
  };
  useEffect(() => {
    if (!users) {
      getAllUser();
    }
  }, [users]);
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
          dispatch(usersAction("users", [...users]));
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
              <Table.HeadCell className="whitespace-nowrap">Họ tên</Table.HeadCell>
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
        </main>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
