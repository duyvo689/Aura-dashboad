import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { CustomerStatus, CustomerStatusReturn } from "../../../utils/types";
import { customerStatusAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import { RootState } from "../../../redux/reducers";
import { Button, Label, Table, TextInput } from "flowbite-react";
import ItemCusStatus from "../../../components/CustomerStatus/ItemCusStatus";
import { statusType } from "../../../constants/crm";
import Select from "react-select";
import CountRecord from "../../../components/CountRecord";
function CustomerStatusPage() {
  const [load, setLoad] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const selectInputRef = useRef<any>();
  const dispatch = useDispatch();

  //clear after submit value
  const onClear = () => {
    selectInputRef.current.clearValue();
  };
  const customerStatus: CustomerStatusReturn = useSelector(
    (state: RootState) => state.customerStatus
  );
  const getAllCustomerStatus = async () => {
    let { data, error } = await supabase
      .from("customer_status")
      .select("*")
      .order("active", { ascending: false });
    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      dispatch(customerStatusAction("customerStatus", data));
    }
  };
  useEffect(() => {
    if (!customerStatus) {
      getAllCustomerStatus();
    }
  }, []);

  const addNewCustomerStatus = async (event: any) => {
    setLoad(true);
    event.preventDefault();
    const name = event.target.name.value;
    const type = event.target.type.value;

    if (!name || type.length === 0) {
      toast.error("Nhập thiếu dữ liệu. Kiểm tra lại");
    } else {
      const { data, error } = await supabase
        .from("customer_status")
        .insert([{ name: name, type: type }])
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else if (data) {
        dispatch(customerStatusAction("customerStatus", [data, ...customerStatus.data]));
        toast.success(`Đã thêm ${name}`);
        onClear();
        event.target.reset();
      }
    }
    setLoad(false);
  };

  return (
    <>
      <Head>
        <title>Quản lý tình trạng khách hàng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex flex-col gap-5">
        <div className="sm:flex sm:justify-between sm:items-center">
          <div className="text-2xl font-bold text-slate-800">
            Tình trạng khách hàng ✨
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-[30%]">
            <div className="w-full bg-white px-5 p-4 flex flex-col gap-6 sm:rounded-lg shadow-md">
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                THÊM TÌNH TRẠNG KHÁCH HÀNG
              </div>
              <form className="flex flex-col gap-4" onSubmit={addNewCustomerStatus}>
                <div className="flex flex-col">
                  <label
                    htmlFor="helper-text"
                    className=" block mb-1 text-sm font-normal text-slate-400 required"
                  >
                    Loại
                  </label>
                  <Select
                    id="type"
                    ref={selectInputRef}
                    name="type"
                    placeholder={"Vui lòng chọn"}
                    options={statusType}
                    onChange={() => {
                      setContent("");
                    }}
                  ></Select>
                </div>
                {content !== null ? (
                  <div className="flex flex-col">
                    <label
                      htmlFor="helper-text"
                      className=" block mb-1 text-sm font-normal text-slate-400 required"
                    >
                      Nội dụng
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      onChange={(e) => {
                        setContent(e.target.value);
                      }}
                      value={content}
                      className="form-input w-full "
                    />
                  </div>
                ) : null}
                <div className="flex justify-end">
                  <button
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white w-32"
                    type={load ? "button" : "submit"}
                  >
                    {load ? "Đang tạo mới..." : "Tạo mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {customerStatus ? (
            <div className="w-[70%]  overflow-x-auto shadow-md relative sm:rounded-lg">
              <div className="w-full overflow-x-auto relative bg-white  sm:rounded-lg">
                <CountRecord
                  amount={customerStatus.data.length}
                  title={"Danh sách quản lý tình trạng khách hàng"}
                />
                <table className="w-full text-sm  text-gray-500 dark:text-gray-400">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-semibold text-xs border border-slate-200">
                    <tr>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        STT
                      </th>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        Nội dung
                      </th>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        Loại
                      </th>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        Trạng thái
                      </th>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        HÀNH ĐỘNG
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-center">
                    {customerStatus &&
                      customerStatus.data.length > 0 &&
                      customerStatus.data.map((item, index) => {
                        return (
                          <ItemCusStatus
                            key={index}
                            customerStatus={item}
                            index={index}
                          />
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </>
  );
}
export default CustomerStatusPage;
