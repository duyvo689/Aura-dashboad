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
import CountRecord from "../../../components/CountRecord";
import { Switch } from "@headlessui/react";
import { EditIcon } from "../../../components/Icons/Form";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
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
      <div className="flex flex-col gap-5">
        <div className="sm:flex sm:justify-between sm:items-center">
          <div className="text-2xl font-bold text-slate-800">Danh mục sản phẩm ✨</div>
        </div>
        <div className="flex gap-6">
          <div className="w-[30%] ">
            <div className="w-full bg-white px-5 p-4 flex flex-col gap-6 shadow-md sm:rounded-lg">
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                THÊM DANH MỤC SẢN PHẨM
              </div>
              <form onSubmit={addNewCategory}>
                <label
                  htmlFor="name"
                  className=" block mb-1 text-sm font-normal text-slate-400 required"
                >
                  Tên danh mục
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  aria-describedby="helper-text-explanation"
                  className="form-input w-full"
                  placeholder="Ex: Nha khoa"
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="justify-end flex mt-4">
                  <button
                    type={`${load ? "button" : "submit"}`}
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    {load ? "Đang thêm..." : "Thêm danh mục"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {category ? (
            <div className="w-[70%] overflow-x-auto relative shadow-md sm:rounded-lg">
              <div className="w-full overflow-x-auto relative bg-white  sm:rounded-lg">
                <CountRecord amount={category.length} title={"Danh sách danh mục"} />
                <table className="w-full text-sm  text-gray-500 dark:text-gray-400">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-semibold text-xs border border-slate-200 ">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                      >
                        STT
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4  "
                      >
                        Tên
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                      >
                        Ngày tạo
                      </th>

                      <th
                        scope="col"
                        className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-2 whitespace-nowrap first:px-4 last:px-4 "
                      >
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-center">
                    {category && category.length > 0 ? (
                      category.map((item, index) => (
                        <tr
                          key={item.id}
                          className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700"
                        >
                          <td className="whitespace-nowrap py-3 px-2 ">{index + 1}</td>
                          <td className="whitespace-nowrap py-3 px-2 ">{item.name}</td>

                          <td className="whitespace-nowrap py-3 px-2 ">
                            {item.created_at}
                          </td>

                          <td className="whitespace-nowrap text-center">
                            <Switch
                              checked={item.active}
                              onClick={() => {
                                setSelectedDeleteId(item.id);
                                setOpenModalDelete(true);
                              }}
                              className={classNames(
                                item.active ? "bg-indigo-600" : "bg-gray-200",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  item.active ? "translate-x-5" : "translate-x-0",
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                          </td>

                          <td className="relative whitespace-nowrap py-3 px-2 ">
                            <div
                              className="cursor-pointer flex justify-center items-center"
                              onClick={() => {
                                setSelectedItemUpdate(item);
                                setOpenModalUpdate(true);
                              }}
                            >
                              <EditIcon />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white hover:bg-gray-100 border-b  dark:bg-gray-900 dark:border-gray-700">
                        <td className="whitespace-nowrap py-3 px-2 ">Không có dữ liệu</td>
                      </tr>
                    )}
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
    </>
  );
}
export default CategoryPage;
