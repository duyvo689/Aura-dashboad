import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { Category, OpenModal } from "../../../utils/types";
import { categoryAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";
import moment from "moment";
import ModalDelete from "../../../components/ModalDelete";
import { RootState } from "../../../redux/reducers";
import ModalUpdateCategory from "../../../components/ModalUpdateCategory";

function CategoryPage() {
  const [name, setName] = useState<string>("");
  const [load, setLoad] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [selectedItemUpdate, setSelectedItemUpdate] = useState<Category | null>(null);
  const category: Category[] = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch();

  const getAllCategory = async () => {
    let { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true);
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

  return (
    <>
      <Head>
        <title>Danh Mục</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <main className="flex gap-6 mt-4 mx-6">
        <div className="w-[30%]">
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
                <button className="text-white bg-gray-400 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 cursor-not-allowed">
                  THÊM DANH MỤC
                </button>
              ) : (
                <button
                  type={"submit"}
                  className="text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {load ? "ĐANG THÊM..." : "THÊM DANH MỤC"}
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="w-[70%] h-[84vh] overflow-x-auto relative shadow-md sm:rounded-lg mt-8">
          <table className="min-w-full divide-y divide-gray-300 px-4">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                >
                  STT
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                >
                  TÊN DANH MỤC
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                >
                  NGÀY TẠO
                </th>

                <th
                  scope="col"
                  className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                ></th>
              </tr>
            </thead>
            <tbody>
              {category &&
                category.length > 0 &&
                category.map((item, index: number) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap text-center py-4 px-4 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                      {index}
                    </td>
                    <td className="whitespace-nowrap text-center py-4 px-4 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap text-center py-4 px-4 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                      {moment(item.created_at).format("DD/MM/YYYY")}
                    </td>
                    <td className="whitespace-nowrap text-center py-4 px-4 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                      <div className="flex gap-3 ">
                        <div
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          onClick={() => {
                            setSelectedItemUpdate(item);
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
        {openModalDelete && selectedDeleteId && (
          <ModalDelete
            id={selectedDeleteId}
            title="danh mục dịch vụ"
            type="categories"
            setOpenModalDelete={setOpenModalDelete}
          />
        )}
        {openModalUpdate && selectedItemUpdate && (
          <ModalUpdateCategory
            category={selectedItemUpdate}
            title="danh mục dịch vụ"
            setOpenModalUpdate={setOpenModalUpdate}
          />
        )}
      </main>
    </>
  );
}
export default CategoryPage;
