import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { OpenModal, Payment } from "../../../utils/types";
import { paymentAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import moment from "moment";

import { RootState } from "../../../redux/reducers";
import ModalDelete from "../../../components/ModalDelete";
import ModalUpdatePayment from "../../../components/ModalUpdatePayment";
import UploadCareAPI from "../../../services/uploadCareAPI";
import convertImg from "../../../utils/helpers/convertImg";
import { Widget } from "@uploadcare/react-widget";
import { useRouter } from "next/router";
import CountRecord from "../../../components/CountRecord";
const UPLOADCARE_KEY = process.env.NEXT_PUBLIC_UPLOADCARE as string;

function CategoryPage() {
  const [load, setLoad] = useState<boolean>(false);
  //
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<Payment | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const payments: Payment[] = useSelector((state: RootState) => state.payments);
  const router = useRouter();
  const dispatch = useDispatch();
  const getAllPayment = async () => {
    let { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq("active", true);
    if (error) {
      toast(error.message);
      return;
    }
    if (payments && payments.length > 0) {
      dispatch(paymentAction("payments", payments));
    }
  };
  useEffect(() => {
    if (!payments) {
      getAllPayment();
    }
  }, []);

  const addNewPayment = async (event: any) => {
    setLoad(true);
    event.preventDefault();
    if (!payments) return;
    if (!image || event.target.name.value === "") {
      toast.error("Nhập thiếu. Vui lòng kiểm tra lại");
    } else {
      const name = event.target.name.value;
      const { data, error } = await supabase
        .from("payments")
        .insert([{ name: name, image: image }])
        .select()
        .single();
      if (error) {
        toast.error(`Lỗi. Thử lại`);
      } else if (data) {
        toast.success(`Thêm mới thành công`);
        payments.push(data);
        router.reload();
        dispatch(paymentAction("payments", payments));
      }
    }
    setLoad(false);
  };

  return (
    <>
      <Head>
        <title>Thanh Toán</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex flex-col gap-5">
        <div className="sm:flex sm:justify-between sm:items-center">
          <div className="text-2xl font-bold text-slate-800">
            Phương thức thanh toán ✨
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-[30%]">
            <div className="w-full bg-white px-5 p-4 flex flex-col gap-6 sm:rounded-lg shadow-md">
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                THÊM PHƯƠNG THỨC THANH TOÁN
              </div>
              <form onSubmit={addNewPayment}>
                <label
                  htmlFor="helper-text"
                  className=" block mb-1 text-sm font-normal text-slate-400 required"
                >
                  Tên phương thức thanh toán
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  aria-describedby="helper-text-explanation"
                  className="form-input w-full "
                  placeholder="Ex: Tiền mặt"
                />
                <div className="sm:col-span-6 mt-4">
                  <label
                    htmlFor="photo"
                    className=" block mb-1 text-sm font-normal text-slate-400 required"
                  >
                    Thêm hình ảnh
                  </label>
                  <div className="mt-1 flex items-end gap-3">
                    {image ? (
                      <span className="w-1/2 overflow-hidden">
                        <img src={image} className="h-full w-full object-cover" />
                      </span>
                    ) : (
                      <div className="space-y-1 text-center ">
                        <svg
                          className="mx-auto h-20 w-20 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <Widget
                      publicKey={UPLOADCARE_KEY}
                      clearable
                      multiple={false}
                      onChange={(file) => {
                        if (file) {
                          setImage(convertImg(file.uuid!));
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="justify-end flex mt-4">
                  <button
                    type={`${load ? "button" : "submit"}`}
                    className="text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    {load ? "Đang thêm..." : "Thêm mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {payments ? (
            <div className="w-[70%] overflow-x-auto relative shadow-md sm:rounded-lg">
              <div className="w-full overflow-x-auto relative bg-white  sm:rounded-lg">
                <CountRecord
                  amount={payments.length}
                  title={"Danh sách phương thức thanh toán"}
                />
                <table className="w-full text-sm  text-gray-500 dark:text-gray-400">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-semibold text-xs border border-slate-200">
                    <tr>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        STT
                      </th>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        HÌNH
                      </th>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        TÊN DANH MỤC
                      </th>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        NGÀY TẠO
                      </th>
                      <th scope="col" className="py-3 px-2 first:px-4 last:px-4 ">
                        HÀNH ĐỘNG
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments &&
                      payments.length > 0 &&
                      payments.map((item, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-center"
                        >
                          <td className="whitespace-nowrap py-3 px-2 ">{index + 1}</td>
                          <td className="whitespace-nowrap py-3 px-2 ">
                            <div className="w-24 h-16 mx-auto">
                              <img className="w-full h-full rounded" src={item.image} />
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-3 px-2 ">{item.name}</td>
                          <td className="whitespace-nowrap py-3 px-2 ">
                            {moment(item.created_at).format("DD/MM/YYYY")}
                          </td>
                          <td className="whitespace-nowrap text-center py-4 px-4 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                            <div className="flex gap-3 justify-center ">
                              <div
                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                onClick={() => {
                                  setSelectedUpdateItem(item);
                                  setOpenModalUpdate(true);
                                }}
                              >
                                Chỉnh sửa
                              </div>
                              <div
                                className="text-red-500 cursor-pointer"
                                onClick={() => {
                                  setSelectedDeleteId(item.id);
                                  setOpenModalDelete(true);
                                }}
                              >
                                Xoá
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>

      {openModalDelete && selectedDeleteId && (
        <ModalDelete
          id={selectedDeleteId}
          title="danh mục dịch vụ"
          type="payments"
          setOpenModalDelete={setOpenModalDelete}
        />
      )}
      {openModalUpdate && selectedUpdateItem && (
        <ModalUpdatePayment
          payment={selectedUpdateItem}
          title="phương thức thanh toán"
          setOpenModalUpdate={setOpenModalUpdate}
        />
      )}
    </>
  );
}
export default CategoryPage;
