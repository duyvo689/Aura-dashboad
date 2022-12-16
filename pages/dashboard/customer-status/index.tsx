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
      <main className="flex gap-6 mt-4 mx-6">
        <div className="w-[30%]">
          <form className="flex flex-col gap-4" onSubmit={addNewCustomerStatus}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="type" className="required" value="Loại" />
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="type" className="required" value="Nội dung" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  value={content}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ) : null}
            <Button size="sm" type="submit">
              {load ? "Đang tạo mới..." : "Tạo mới"}
            </Button>
          </form>
        </div>
        <div className="w-[70%] h-[84vh] overflow-x-auto relative sm:rounded-lg">
          <Table className="min-w-full divide-y divide-gray-200">
            <Table.Head>
              <Table.HeadCell className="whitespace-nowrap text-center">
                STT
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Nội dung
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Loại
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                Trạng thái
              </Table.HeadCell>
              <Table.HeadCell className="whitespace-nowrap text-center">
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="bg-white divide-y divide-gray-200">
              {customerStatus &&
                customerStatus.data.length > 0 &&
                customerStatus.data.map((item, index) => {
                  return (
                    <ItemCusStatus key={index} customerStatus={item} index={index} />
                  );
                })}
            </Table.Body>
          </Table>
        </div>
      </main>
    </>
  );
}
export default CustomerStatusPage;
