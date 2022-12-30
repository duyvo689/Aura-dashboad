import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CountRecord from "../../../components/CountRecord";
import ItemDoctor from "../../../components/Doctors/ItemDoctor";
import Pagination from "../../../components/Pagination";
import { doctorAction, staffAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { Doctor, Staff } from "../../../utils/types";

const DoctorPage = () => {
  const [pagination, setPagination] = useState(1);
  const [filterDoctor, setFilterDoctor] = useState<Doctor[] | null>(null);
  const doctors: Doctor[] = useSelector((state: RootState) => state.doctors);
  const handlerSearch = (e: any) => {
    if (e.target.value === "") {
      setFilterDoctor(doctors);
    } else {
      setFilterDoctor(() => {
        const pattern = new RegExp(e.target.value.toLowerCase(), "g");
        const tmp = doctors.filter((item) => {
          return (
            pattern.test(item.phone.toLowerCase()) ||
            (item.name && pattern.test(item.name.toLowerCase()))
          );
        });
        return tmp;
      });
    }
  };
  const dispatch = useDispatch();
  const getAllDoctors = async () => {
    const { data: doctors, error } = await supabase
      .from("doctors")
      .select("*,clinic_id(*)");
    if (error) {
      toast.error("Lỗi. Thử lại");
    } else if (doctors) {
      dispatch(doctorAction("doctors", doctors));
    }
  };
  useEffect(() => {
    if (doctors) {
      setFilterDoctor(doctors);
    }
  }, [doctors]);
  useEffect(() => {
    if (!doctors) {
      getAllDoctors();
    }
  }, []);
  return (
    <>
      <Head>
        <title>Người Dùng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {filterDoctor ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">Người dùng ✨</div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  id="search"
                  onChange={handlerSearch}
                  placeholder="Tìm kiếm số theo tên hoặc số điện thoại"
                  className="form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300 w-80"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <MagnifyingGlassIcon stroke={"#64748b"} className="w-6 h-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="w-full overflow-x-auto relative shadow-md sm:rounded-lg">
              <CountRecord amount={doctors.length} title={"Danh sách người dùng"} />
              <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-slate-100 text-slate-500 uppercase font-semibold text-xs border border-slate-200 text-left ">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                    >
                      Tên nhân viên
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
                      Ảnh đại diện
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
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-left">
                  {filterDoctor.length > 0 ? (
                    filterDoctor
                      .slice((pagination - 1) * 10, pagination * 10)
                      .map((item, index: number) => {
                        return <ItemDoctor key={index} doctor={item} />;
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
            filteredData={filterDoctor}
            dataLength={filterDoctor.length}
            currentPage={pagination}
            setNewPage={setPagination}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
export default DoctorPage;
