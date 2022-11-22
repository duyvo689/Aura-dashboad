import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { Payment } from "../../../utils/types";
import { paymentAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";

interface Toggle {
  index: number;
  isEdit: boolean;
  value: string;
}
function CategoryPage() {
  const [name, setName] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);
  const [toggle, setToggle] = useState<Toggle>({ index: -1, isEdit: false, value: "" });

  const upImg = useRef<any>(null);
  const [image, setImage] = useState<any>();

  const payments: Payment[] = useSelector((state: any) => state.payments);
  const dispatch = useDispatch();

  const getAllPayment = async () => {
    let { data: payments, error } = await supabase.from("payments").select("*");
    if (error) {
      toast(error.message);
      return;
    }
    if (payments && payments.length > 0) {
      dispatch(paymentAction("payments", payments));
    }
  };
  useEffect(() => {
    getAllPayment();
  }, []);

  const createImgId = () => {
    var result = "";
    var characters = "abcdefgh0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const uploadImageProduct = async (image: any) => {
    try {
      if (image) {
        const fileExt = image.name.split(".").pop();
        const filePath = `${createImgId()}.${fileExt}`;
        let { error: uploadError } = await supabase.storage
          .from("services")
          .upload(filePath, image, { upsert: true });
        if (uploadError) {
          console.log(uploadError);
        }
        const publicUrl = await supabase.storage.from("services").getPublicUrl(filePath);
        return publicUrl.data.publicUrl;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addNewPayment = async (event: any) => {
    try {
      setLoad(true);
      event.preventDefault();
      const name = event.target.elements.name.value;
      const _urlImg = await uploadImageProduct(image);
      console.log(_urlImg);
      const { data, error } = await supabase
        .from("payments")
        .insert([{ name: name, image: _urlImg }])
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        payments.push(data);
        toast.success(`Đã thêm ${name}`);
        setName("");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  const updatePayment = async (event: any, id: string) => {
    try {
      event.preventDefault();
      const name = event.target.elements.newName.value;
      const { data, error } = await supabase
        .from("categories")
        .update({ name: name })
        .eq("id", id)
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        let index = payments.findIndex((item) => item.id == id);
        payments[index] = data;
        toast.success(`Đã sửa ${name}`);
        setToggle({ index: -1, isEdit: false, value: "" });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleClick = () => {
    upImg.current.click();
  };
  return (
    <>
      <Head>
        <title>Thanh Toán</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex gap-6 mt-4">
        <div className="flex-1">
          <form onSubmit={addNewPayment}>
            <label
              htmlFor="helper-text"
              className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
            >
              THÊM PHƯƠNG THỨC THANH TOÁN
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 mt-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Tên phương thức thanh toán"
              onChange={(e) => setName(e.target.value)}
            />

            <div className="sm:col-span-6 mt-4">
              <label
                htmlFor="photo"
                className="block text-sm font-bold text-gray-700 mb-4"
              >
                THÊM HÌNH
              </label>
              <div className="mt-1 flex items-center">
                <span className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
                <button
                  onClick={handleClick}
                  type="button"
                  className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Thay Đổi
                </button>
                <input
                  ref={upImg}
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => e.target.files && setImage(e.target.files[0])}
                />
              </div>
            </div>
            <div className="justify-end flex mt-4">
              {!name || !image ? (
                <p className="text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                  THÊM THANH TOÁN
                </p>
              ) : (
                <button
                  type={"submit"}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {load ? "ĐANG THÊM..." : "THÊM THANH TOÁN"}
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="flex-1 overflow-x-auto relative shadow-md sm:rounded-lg mt-8">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 text-center px-6">
                  STT
                </th>
                <th scope="col" className="py-3 px-6">
                  HÌNH
                </th>
                <th scope="col" className="py-3 px-6">
                  TÊN DANH MỤC
                </th>
                <th scope="col" className="py-3 text-right px-6">
                  HÀNH ĐỘNG
                </th>
              </tr>
            </thead>
            <tbody>
              {payments &&
                payments.length > 0 &&
                payments.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-white cursor-pointer  hover:bg-gray-100 border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <td className="py-4 text-center px-6">{index}</td>
                    <td className="py-4 px-6">
                      <img
                        src={item.image}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </td>
                    {index == toggle.index && toggle.isEdit ? (
                      <th
                        scope="row"
                        className="py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <form onSubmit={(e) => updatePayment(e, item.id)}>
                          <div className="flex">
                            <input
                              autoFocus
                              type="text"
                              id="newName"
                              name="newName"
                              value={toggle.value}
                              aria-describedby="helper-text-explanation"
                              className="border rounded border-gray-300 text-gray-900 text-sm focus:ring-blue-400 focus:border-blue-400 block w-full"
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
                                <></>
                              ) : (
                                <button
                                  type="submit"
                                  className="border h-[30px] cursor-pointer hover:bg-red-500 border-gray-400 flex items-center rounded px-4 text-white bg-red-600"
                                >
                                  Sửa
                                </button>
                              )}

                              <span
                                className="border cursor-pointer hover:bg-gray-300 h-[30px] border-gray-400 flex items-center rounded px-4 bg-gray-200"
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
                          className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          onDoubleClick={() =>
                            setToggle({ index: index, isEdit: true, value: item.name })
                          }
                        >
                          {item.name}
                        </th>
                      </Tippy>
                    )}
                    <td className="py-4 px-6 text-right text-white">
                      <button className="bg-red-500 px-3 py-[2px] rounded text-[12px] font-bold">
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default CategoryPage;
