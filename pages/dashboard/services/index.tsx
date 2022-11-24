import Tippy from "@tippyjs/react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import react, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { categoryAction, servicesAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { uploadImageProduct } from "../../../utils/funtions";
import { Category, OpenModal, Service } from "../../../utils/types";
import NewModalDelete from "./modal-delete";

interface Toggle {
  index: number;
  isEdit: boolean;
  value: {
    name: string;
    description: string;
    image: string;
    category: string;
  };
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function Example() {
  const services: Service[] = useSelector((state: RootState) => state.services);
  const categories: Category[] = useSelector((state: RootState) => state.category);

  const [servicesState, setServicesState] = useState<Service[]>();
  useEffect(() => {
    setServicesState(services);
  }, [services]);
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState<Toggle>({
    index: -1,
    isEdit: false,
    value: { name: "", description: "", image: "", category: "" },
  });
  const [image, setImage] = useState<any>();
  const upImg = useRef<any>(null);
  const [open, setOpen] = useState({ isOpen: false, id: "", name: "" });

  const updateActive = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("services")
        .update({ active: false })
        .eq("id", id)
        .select();
      if (error != null) {
        toast.error(error.message);
      } else {
        toast.success(`Đã xoá dịch vụ`);
        let newServices = services.filter((item) => item.id !== id);
        dispatch(servicesAction("services", newServices));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpen({ isOpen: false, id: "", name: "" });
    }
  };

  const handleClick = () => {
    upImg.current.click();
  };

  const getAllService = async () => {
    let { data, error } = await supabase
      .from("services")
      .select(`*,category_id(*)`)
      .eq("active", true);
    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      dispatch(servicesAction("services", data));
    }
  };
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
    getAllService();
    getAllCategory();
  }, []);

  const updateService = async (id: string) => {
    try {
      const _name = toggle.value.name;
      const _description = toggle.value.description;
      const _category = toggle.value.category;
      let _image = toggle.value.image;
      if (image) {
        _image = (await uploadImageProduct(image, "services")) as string;
      }
      const { data, error } = await supabase
        .from("services")
        .update({
          name: _name,
          description: _description,
          image: _image,
          category_id: _category,
        })
        .eq("id", id)
        .select(`*,category_id(*)`)
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        let index = services.findIndex((item) => item.id == id);
        services[index] = data;
        toast.success(`Đã sửa ${_name}`);
        setToggle({
          index: -1,
          isEdit: false,
          value: { name: "", description: "", image: "", category: "" },
        });
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handlerSearch = (e: any) => {
    const pattern = new RegExp(e.target.value.toLowerCase(), "g");
    const tmp = services.filter((service: Service) => {
      return pattern.test(service.name.toLowerCase());
    });
    setServicesState(tmp);
    if (!e.target.value) {
      setServicesState(services);
    }
  };

  const onChangeCategory = async (id: string) => {
    let { data, error } =
      id == "0"
        ? await supabase.from("services").select(`*,category_id(*)`)
        : await supabase
            .from("services")
            .select(`*,category_id(*)`)
            .eq("category_id", id);
    if (data && data.length > 0) {
      dispatch(servicesAction("services", data));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Dịch Vụ </title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">THÔNG TIN DỊCH VỤ</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý tất cả các dịch vụ ở Aura ID.
          </p>

          <div className="mt-6">
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
              <input
                type="text"
                name="price"
                id="price"
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Tìm kiếm dich vụ"
                onChange={handlerSearch}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  onChange={(e) => onChangeCategory(e.target.value)}
                  id="currency"
                  name="currency"
                  className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {categories && categories.length > 0 && (
                    <>
                      <option value={0}>Tất cả</option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
        <Link href="/dashboard/services/create-service">
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              THÊM DỊCH VỤ
            </button>
          </div>
        </Link>
      </div>
      <div className="mt-6 flex flex-col">
        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      HÌNH
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      TÊN
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      DANH MỤC
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      MÔ TẢ
                    </th>
                    <th
                      scope="col"
                      className="sticky whitespace-nowrap top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      NGÀY TẠO
                    </th>
                    <th
                      scope="col"
                      className="sticky whitespace-nowrap top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {servicesState &&
                    servicesState.length > 0 &&
                    servicesState.map((service, serviceIdx) => (
                      <tr key={service.id}>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                          )}
                        >
                          {serviceIdx}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <>
                              <Tippy content="Nháy chuột để chỉnh sửa ảnh">
                                <div className="w-24 h-16 ">
                                  <img
                                    onClick={handleClick}
                                    className="w-full h-full  rounded cursor-pointer"
                                    src={
                                      image ? URL.createObjectURL(image) : service.image
                                    }
                                  />
                                </div>
                              </Tippy>
                              <input
                                ref={upImg}
                                type="file"
                                hidden
                                multiple
                                onChange={(e) =>
                                  e.target.files && setImage(e.target.files[0])
                                }
                              />
                            </>
                          ) : (
                            <div className="w-16 h-14">
                              <img
                                className="w-full h-full rounded"
                                src={service.image}
                              />
                            </div>
                          )}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <textarea
                              rows={4}
                              id="newName"
                              name="newName"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-w-[100px]"
                              value={toggle.value.name}
                              onChange={(e) =>
                                setToggle({
                                  index: serviceIdx,
                                  isEdit: true,
                                  value: { ...toggle.value, name: e.target.value },
                                })
                              }
                            />
                          ) : (
                            service.name
                          )}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <select
                              onChange={(e) =>
                                setToggle({
                                  index: serviceIdx,
                                  isEdit: true,
                                  value: {
                                    ...toggle.value,
                                    category: e.target.value,
                                  },
                                })
                              }
                              value={toggle.value.category}
                              name="clinic"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-w-[200px]"
                            >
                              {categories && categories.length > 0
                                ? categories.map((category: any, index: number) => {
                                    return (
                                      <option value={category.id} key={index}>
                                        {category.name}
                                      </option>
                                    );
                                  })
                                : null}
                            </select>
                          ) : (
                            service.category_id.name
                          )}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <textarea
                              rows={4}
                              name="newDescription"
                              id="newDescription"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={toggle.value.description}
                              onChange={(e) =>
                                setToggle({
                                  index: serviceIdx,
                                  isEdit: true,
                                  value: { ...toggle.value, description: e.target.value },
                                })
                              }
                            />
                          ) : (
                            service.description
                          )}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {moment(service.created_at).format("DD/MM/YYYY")}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <span
                              onClick={() => updateService(service.id)}
                              className="text-red-600  cursor-pointer hover:text-indigo-900"
                            >
                              Lưu Lại
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  setOpen({
                                    isOpen: true,
                                    id: service.id,
                                    name: service.name,
                                  })
                                }
                                type="button"
                                data-modal-toggle="popup-modal"
                                className="text-red-700 cursor-pointer hover:text-indigo-900"
                              >
                                Xoá
                              </button>
                              <span
                                onClick={() =>
                                  setToggle({
                                    index: serviceIdx,
                                    isEdit: true,
                                    value: {
                                      ...toggle.value,
                                      name: service.name,
                                      description: service.description,
                                      image: service.image,
                                      category: service.category_id.id,
                                    },
                                  })
                                }
                                className="text-indigo-600 ml-4 cursor-pointer hover:text-indigo-900"
                              >
                                Sửa
                              </span>
                            </>
                          )}
                          {serviceIdx == toggle.index && toggle.isEdit && (
                            <span
                              onClick={() => {
                                setToggle({
                                  index: -1,
                                  isEdit: false,
                                  value: {
                                    name: "",
                                    description: "",
                                    image: "",
                                    category: "",
                                  },
                                });
                                setImage(null);
                              }}
                              className="text-gray-600  cursor-pointer ml-4 hover:text-indigo-900"
                            >
                              Huỷ
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <NewModalDelete open={open} setOpen={setOpen} updateActive={updateActive} />
    </div>
  );
}
