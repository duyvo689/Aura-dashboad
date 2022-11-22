import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { Category } from "../../../utils/types";
import { categoryAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";
import moment from "moment";

interface Toggle {
  index: number;
  isEdit: boolean;
  value: string;
}
function CategoryPage() {
  const [name, setName] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);
  const [toggle, setToggle] = useState<Toggle>({ index: -1, isEdit: false, value: "" });

  const category: Category[] = useSelector((state: any) => state.category);
  const dispatch = useDispatch();

  const getAllCategory = async () => {
    let { data, error } = await supabase.from("categories").select("*");
    if (error) {
      toast(error.message);
      return;
    }
    if (data && data.length > 0) {
      dispatch(categoryAction("category", data));
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  const addNewCategory = async (event: any) => {
    try {
      setLoad(true);
      event.preventDefault();
      const name = event.target.elements.name.value;
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: name }])
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        category.push(data);
        toast.success(`Đã thêm ${name}`);
        setName("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  const updateCategory = async (event: any, id: string) => {
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
        let index = category.findIndex((item) => item.id == id);
        category[index] = data;
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
        <title>Danh Mục</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex gap-6 mt-4 mx-6">
        <div className="flex-1">
          <form onSubmit={addNewCategory}>
            <label
              htmlFor="helper-text"
              className="block mb-4 text-sm font-bold text-gray-900 dark:text-white"
            >
              THÊM DANH MỤC
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Tên danh mục"
              onChange={(e) => setName(e.target.value)}
            />
            <div className="justify-end flex mt-4">
              {!name ? (
                <p className="text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                  THÊM DANH MỤC
                </p>
              ) : (
                <button
                  type={"submit"}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {load ? "ĐANG THÊM..." : "THÊM DANH MỤC"}
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="flex-1 overflow-x-auto relative shadow-md sm:rounded-lg mt-8">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3  text-center px-6">
                  STT
                </th>
                <th scope="col" className="py-3 px-6">
                  TÊN DANH MỤC
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
              {category &&
                category.length > 0 &&
                category.map((item, index) => (
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
                        <form onSubmit={(e) => updateCategory(e, item.id)}>
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
                                  className="border cursor-pointer hover:bg-red-500 h-[30px] border-gray-400 flex items-center rounded px-4 text-white bg-red-600"
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
