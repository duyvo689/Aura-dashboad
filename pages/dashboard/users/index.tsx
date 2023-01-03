import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../../services/supaBaseClient";
import {
  Clinic,
  CustomerStatusReturn,
  Doctor,
  Service,
  User,
} from "../../../utils/types";
import { CSVLink } from "react-csv";
import { io } from "socket.io-client";
import ItemUser from "../../../components/Users/ItemUser";
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

import SearchBarUser from "../../../components/Users/SearchUserBar";

import CountRecord from "../../../components/CountRecord";
import Pagination from "../../../components/Pagination";
import FilterUserBar from "../../../components/Users/FilterUserBar";
import { mainApi } from "../../../api/endpoint";
export default function Example() {
  const users: User[] = useSelector((state: RootState) => state.users);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const doctors: Doctor[] = useSelector((state: RootState) => state.doctors);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const customerStatus: CustomerStatusReturn = useSelector(
    (state: RootState) => state.customerStatus
  );
  const [filterUser, setFilterUser] = useState<User[] | null>(null);
  const [pagination, setPagination] = useState(1);
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
    if (users) {
      setFilterUser(users);
    }
  }, [users]);

  return (
    <>
      <Head>
        <title>Người Dùng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {filterUser && customerStatus ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">Người dùng ✨</div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <FilterUserBar
                customerStatusGroup={customerStatus.group}
                setFilterUser={setFilterUser}
                filterUser={filterUser}
              />
              <SearchBarUser />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="w-full overflow-x-auto relative shadow-md sm:rounded-lg">
              <CountRecord amount={filterUser.length} title={"Danh sách người dùng"} />
              <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-slate-100 text-slate-500 uppercase font-semibold text-xs border border-slate-200 text-left ">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Tên khách hàng
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Số điện thoại
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Chi nhánh
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Trạng thái KH
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Nhân viên LiveChat
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Nguồn khách
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Trạng thái chi tiết
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-left">
                  {filterUser.length > 0 ? (
                    clinics &&
                    filterUser
                      .slice((pagination - 1) * 10, pagination * 10)
                      .map((item, index) => {
                        return (
                          <ItemUser
                            key={index}
                            user={item}
                            customerStatusGroup={customerStatus.group}
                            clinics={clinics}
                          />
                        );
                      })
                  ) : (
                    <tr className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700 text-left">
                      <td className="whitespace-nowrap py-3 px-2 ">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            filteredData={filterUser}
            dataLength={filterUser.length}
            currentPage={pagination}
            setNewPage={setPagination}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
