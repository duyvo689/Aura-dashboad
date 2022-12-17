import { Button, Table } from "flowbite-react";
import moment from "moment";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../../services/supaBaseClient";
import {
  Clinic,
  CustomerStatus,
  CustomerStatusReturn,
  Doctor,
  Service,
  User,
} from "../../../utils/types";
import { CSVLink } from "react-csv";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

import { io } from "socket.io-client";
import { mainApi } from "../../../api/endpoint";
import ItemUser from "../../../components/ItemUser";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
import {
  clinicsAction,
  customerStatusAction,
  doctorAction,
  servicesAction,
  usersAction,
} from "../../../redux/actions/ReduxAction";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
import * as React from "react";

import SearchBar from "../../../components/SearchBar";

import FilterBar from "../../../components/FilterBar";

export default function Example() {
  const users: User[] = useSelector((state: RootState) => state.users);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const doctors: Doctor[] = useSelector((state: RootState) => state.doctors);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const customerStatus: CustomerStatusReturn = useSelector(
    (state: RootState) => state.customerStatus
  );
  const [filterUser, setFilterUser] = useState<User[] | null>(null);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<any | null>(null);
  const getAllClinic = async () => {
    let { data: clinics, error } = await supabase
      .from(" clinics")
      .select("*")
      .eq("active", true);
    if (error) {
      toast(error.message);
      return;
    }
    if (clinics && clinics.length > 0) {
      dispatch(clinicsAction("clinics", clinics));
    }
  };
  const getAllCustomerStatus = async () => {
    let { data, error } = await supabase.from("customer_status").select("*");
    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      dispatch(customerStatusAction("customerStatus", data));
    }
  };
  const getAllUser = async () => {
    const { data: allUsers, error } = await supabase
      .from("users")
      .select("*,status(*),details_status(*),interact_type(*),interact_result(*)")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    if (allUsers) {
      dispatch(usersAction("users", allUsers));
    }
  };
  const getAllDoctor = async () => {
    const { data: doctors, error } = await supabase
      .from("doctors")
      .select("*,clinic_id(*)")
      .neq("name", null);
    if (error) {
      toast.error("Lỗi. Thử lại");
    } else if (doctors) {
      dispatch(doctorAction("doctors", doctors));
    }
  };
  const getAllService = async () => {
    let { data, error } = await supabase
      .from("services")
      .select(`*`)
      .match({ active: true });
    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      console.log(data);
      dispatch(servicesAction("services", data));
    }
  };
  useEffect(() => {
    if (!users) {
      getAllUser();
    }
    if (!clinics) {
      getAllClinic();
    }
    if (!customerStatus) {
      getAllCustomerStatus();
    }
    if (!doctors) {
      getAllDoctor();
    }
    if (!services) {
      getAllService();
    }
  }, []);
  useEffect(() => {
    if (users) {
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
          console.log(data);
          const index = users?.findIndex((item) => item.id === data.id);

          if (users) {
            if (index === -1) {
              dispatch(usersAction("users", [data, ...users]));
            } else {
              users[index] = data;
              dispatch(usersAction("users", [...users]));
            }
          }
        });
      }
    }
  }, [socket, users]);
  useEffect(() => {
    if (users !== null) {
      setFilterUser(users);
    }
  }, [users]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6 h-screen">
      <Head>
        <title>Người Dùng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {filterUser && customerStatus ? (
        <main className="flex flex-col gap-4 ">
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
          <SearchBar />
          <FilterBar
            customerStatusGroup={customerStatus.group}
            setFilterUser={setFilterUser}
            filterUser={users}
          />
          <Table className="mt-8  divide-y divide-gray-200">
            <Table.Head className="bg-gray-50 sticky top-0">
              <Table.HeadCell className="whitespace-nowrap text-center z-10 bg-gray-50  sticky min-w-[100px] left-0">
                STT
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center z-10 bg-gray-50  sticky left-[100px]">
                Tên khách hàng
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center z-10 ">
                Số điện thoại
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Tuổi
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Ngày tạo
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Chi nhánh
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Quận Huyện
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Trạng thái KH
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Trạng thái chi tiết
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Dạng tương tác
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Kết quả tương tác
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Nhân viên LiveChat
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Nguồn khách
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Cập nhật gần nhât
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="bg-white divide-y divide-gray-200">
              {filterUser.length > 0 ? (
                clinics &&
                filterUser.map((item, index) => {
                  return (
                    <ItemUser
                      key={index}
                      user={item}
                      index={index}
                      customerStatusGroup={customerStatus.group}
                      clinics={clinics}
                    />
                  );
                })
              ) : (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center max-h-2 ">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-white text-center">
                    Không có dữ liệu
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </main>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
