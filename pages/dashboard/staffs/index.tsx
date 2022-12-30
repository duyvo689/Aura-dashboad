import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CountRecord from "../../../components/CountRecord";
import Pagination from "../../../components/Pagination";
import ItemStaff from "../../../components/Staffs/ItemStaff";
import { staffAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { Staff } from "../../../utils/types";

const StaffsPage = () => {
  const [pagination, setPagination] = useState(1);
  const [filterStaff, setFilterStaff] = useState<Staff[] | null>(null);
  const staffs: Staff[] = useSelector((state: RootState) => state.staffs);
  const dispatch = useDispatch();
  const getAllStaffs = async () => {
    const { data: staffs, error } = await supabase
      .from("staffs")
      .select("*,clinic_id(*)");
    if (error) {
      toast.error("Lỗi. Thử lại");
    } else if (staffs) {
      dispatch(staffAction("staffs", staffs));
    }
  };
  const handlerSearch = (e: any) => {
    if (e.target.value === "") {
      setFilterStaff(staffs);
    } else {
      setFilterStaff(() => {
        const pattern = new RegExp(e.target.value.toLowerCase(), "g");
        const tmp = staffs.filter((item) => {
          return (
            pattern.test(item.phone.toLowerCase()) ||
            (item.name && pattern.test(item.name.toLowerCase()))
          );
        });
        return tmp;
      });
    }
  };

  useEffect(() => {
    if (staffs) {
      setFilterStaff(staffs);
    }
  }, [staffs]);
  useEffect(() => {
    if (!staffs) {
      getAllStaffs();
    }
  }, []);
  return (
    <>
      <Head>
        <title>Nhân viên</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {filterStaff ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">Nhân viên ✨</div>
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
              <CountRecord amount={staffs.length} title={"Danh sách nhân viên"} />
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
                      Email
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
                  {filterStaff.length > 0 ? (
                    filterStaff
                      .slice((pagination - 1) * 10, pagination * 10)
                      .map((item, index: number) => {
                        return <ItemStaff key={index} item={item} />;
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
            filteredData={filterStaff}
            dataLength={filterStaff.length}
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
export default StaffsPage;
