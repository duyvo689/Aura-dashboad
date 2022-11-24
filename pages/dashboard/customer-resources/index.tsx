import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { Customer, OpenModal } from "../../../utils/types";
import { customerAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";
import moment from "moment";
import NewModalDelete from "../services/modal-delete";

interface Toggle {
  index: number;
  isEdit: boolean;
  value: string;
}
function CustomerPage() {
  const [name, setName] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);
  const [toggle, setToggle] = useState<Toggle>({ index: -1, isEdit: false, value: "" });

  const customers: Customer[] = useSelector((state: any) => state.customers);
  const dispatch = useDispatch();

  const [open, setOpen] = useState<OpenModal>({ isOpen: false, id: "", name: "" });

  const updateActive = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("customer_resources")
        .update({ active: false })
        .eq("id", id)
        .select();
      if (error != null) {
        toast.error(error.message);
      } else {
        toast.success(`Đã xoá nguồn khách hàng`);
        let newCustomers = customers.filter((item) => item.id !== id);
        dispatch(customerAction("customers", newCustomers));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpen({ isOpen: false, id: "", name: "" });
    }
  };
  const getAllCustomers = async () => {
    let { data, error } = await supabase
      .from("customer_resources")
      .select("*")
      .eq("active", true);
    if (error) {
      toast(error.message);
      return;
    }
    if (data && data.length > 0) {
      dispatch(customerAction("customers", data));
    }
  };
  useEffect(() => {
    getAllCustomers();
  }, []);

  const addNewCustomers = async (event: any) => {
    try {
      setLoad(true);
      event.preventDefault();
      const name = event.target.elements.name.value;
      const { data, error } = await supabase
        .from("customer_resources")
        .insert([{ name: name }])
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        customers.push(data);
        toast.success(`Đã thêm ${name}`);
        setName("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  const updateCustomer = async (event: any, id: string) => {
    try {
      event.preventDefault();
      const name = event.target.elements.newName.value;
      const { data, error } = await supabase
        .from("customer_resources")
        .update({ name: name })
        .eq("id", id)
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        let index = customers.findIndex((item) => item.id == id);
        customers[index] = data;
        toast.success(`Đã sửa ${name}`);
        setToggle({ index: -1, isEdit: false, value: "" });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return (
    <>
      <Head>
        <title>Khách Hàng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex gap-6 mt-4 mx-6">
        <div className="w-[40%]">
          <form onSubmit={addNewCustomers}>
            <label
              htmlFor="helper-text"
              className="block mb-4 text-sm font-bold text-gray-900 dark:text-white "
            >
              THÊM NGUỒN KHÁCH HÀNG
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nguồn khách hàng"
              onChange={(e) => setName(e.target.value)}
            />
            <div className="justify-end flex mt-4">
              {!name ? (
                <p className="text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                  THÊM NGUỒN KHÁCH HÀNG
                </p>
              ) : (
                <button
                  type={"submit"}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {load ? "ĐANG THÊM..." : "THÊM NGUỒN KHÁCH HÀNG"}
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="w-[60%] overflow-x-auto relative shadow-md sm:rounded-lg mt-8">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 text-center px-6">
                  STT
                </th>
                <th scope="col" className="py-3 px-6">
                  TÊN NGUỒN KHÁCH HÀNG
                </th>
                <th scope="col" className="py-3 px-6">
                  NGÀY TẠO
                </th>
                <th scope="col" className="py-3 text-right px-6">
                  HÀNH ĐỘNG
                </th>
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.length > 0 &&
                customers.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-white hover:bg-gray-100 border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <td className="py-4 text-center px-6">{index}</td>
                    {index == toggle.index && toggle.isEdit ? (
                      <th
                        scope="row"
                        className="py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <form onSubmit={(e) => updateCustomer(e, item.id)}>
                          <div className="flex">
                            <input
                              autoFocus
                              type="text"
                              id="newName"
                              name="newName"
                              value={toggle.value}
                              aria-describedby="helper-text-explanation"
                              className="border rounded border-gray-300 text-gray-900 text-sm focus:ring-blue-400 focus:border-blue-400 block w-full min-w-[150px]"
                              placeholder="Tên danh mục"
                              onChange={(e) =>
                                setToggle({
                                  index: index,
                                  isEdit: true,
                                  value: e.target.value,
                                })
                              }
                            />
                            <span className="flex gap-2 ml-2 items-center">
                              {item.name == toggle.value ? (
                                <span className="border h-[30px]  border-gray-400 flex items-center rounded px-4 text-white bg-gray-400">
                                  Sửa
                                </span>
                              ) : (
                                <button
                                  type="submit"
                                  className="border h-[30px] cursor-pointer  hover:bg-red-500 border-gray-400 flex items-center rounded px-4 text-white bg-red-600"
                                >
                                  Sửa
                                </button>
                              )}

                              <span
                                className="border h-[30px] cursor-pointer  hover:bg-gray-300 border-gray-400 flex items-center rounded px-4 bg-gray-200"
                                onClick={() =>
                                  setToggle({ index: -1, isEdit: false, value: "" })
                                }
                              >
                                Huỷ
                              </span>
                            </span>
                          </div>
                        </form>
                      </th>
                    ) : (
                      <Tippy content="Nháy đúp chuột để chỉnh sửa">
                        <th
                          scope="row"
                          className="py-4 px-6 cursor-pointer font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          onDoubleClick={() =>
                            setToggle({ index: index, isEdit: true, value: item.name })
                          }
                        >
                          {item.name}
                        </th>
                      </Tippy>
                    )}
                    <td className="py-4  px-6">
                      {moment(item.created_at).format("DD/MM/YYYY")}
                    </td>
                    <td className="py-4 px-6 text-right text-white">
                      <button
                        onClick={() =>
                          setOpen({ isOpen: true, id: item.id, name: item.name })
                        }
                        className="bg-red-500 px-3 py-[2px] rounded text-[12px] font-bold"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <NewModalDelete open={open} setOpen={setOpen} updateActive={updateActive} />
    </>
  );
}
export default CustomerPage;
