import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { categoryAction, servicesAction } from "../../../../redux/actions/ReduxAction";
import { supabase } from "../../../../services/supaBaseClient";
import { Category, Service } from "../../../../utils/types";
import Head from "next/head";
import Link from "next/link";
import UploadCareAPI from "../../../../services/uploadCareAPI";
import { RootState } from "../../../../redux/reducers";
import convertImg from "../../../../utils/helpers/convertImg";
import router, { useRouter } from "next/router";
import { Widget } from "@uploadcare/react-widget";
import { XCircleIcon } from "@heroicons/react/24/outline";

export default function UpdateService() {
  const { id } = useRouter().query;
  const [newServiceImg, setNewServiceImg] = useState<string | null>(null);
  const categories: Category[] = useSelector((state: any) => state.category);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const [service, setService] = useState<Service | null>(null);
  const dispatch = useDispatch();
  const [load, setLoad] = useState<boolean>(false);

  const fetchServiceById = async () => {
    let { data: service, error } = await supabase
      .from("services")
      .select(`*,category_id(*)`)
      .eq("id", id)
      .single();
    if (error) {
      toast("Lỗi. Thử lại.");
      return;
    } else if (service) {
      setService(service);
    }
  };
  const updateService = async (event: any) => {
    event.preventDefault();
    setLoad(true);
    if (!services || !service) return;
    let updateImage = service.image;
    if (newServiceImg) {
      updateImage = newServiceImg;
    }
    const _name = event.target.elements.name.value;
    const _price = event.target.elements.price.value;
    const _category = event.target.elements.category.value;
    const _description = event.target.elements.description.value;
    let _serviceInfo = {
      name: _name,
      price: _price,
      category_id: _category,
      description: _description,
      image: updateImage,
    };
    const { data, error } = await supabase
      .from("services")
      .update([_serviceInfo])
      .eq("id", id)
      .select(`*,category_id(*)`)
      .single();
    if (error != null) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Cập nhật thành công");
      let index = services.findIndex((item) => item.id == id);
      services[index] = data;
      dispatch(servicesAction("services", services));
      router.push("/dashboard/services");
    }
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
    if (!categories) {
      getAllCategory();
    }
    if (!services) {
      getAllService();
    }
  }, [categories, services]);
  useEffect(() => {
    if (id) {
      fetchServiceById(), [id];
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Thêm Dịch Vụ </title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <main>
        {service && categories ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center max-w-[860px] m-auto mt-6">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">
                  CẬP NHẬT DỊCH VỤ MỚI
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Cập nhật thông tin dịch vụ. Thông tin sẽ được hiển thị trên cả 3
                  MiniApp.
                </p>
              </div>
              <Link href="/dashboard/services">
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  >
                    TRỞ LẠI TRANG TRƯỚC
                  </button>
                </div>
              </Link>
            </div>
            <form
              id="myForm"
              className="space-y-8 divide-gray-200 mb-20 max-w-[860px] m-auto"
              onSubmit={updateService}
            >
              <div className="space-y-8 divide-gray-200">
                <div>
                  <div className="pt-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 required"
                      >
                        Tên Dịch Vụ
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          defaultValue={service.name}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 required"
                        >
                          Nhập Giá Dịch Vụ
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="price"
                            id="price"
                            defaultValue={service.price}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 required"
                        >
                          Chọn Danh Mục
                        </label>
                        <div className="mt-1">
                          <select
                            id="category"
                            name="category"
                            defaultValue={service.category_id.id}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            {categories &&
                              categories.length > 0 &&
                              categories.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 required"
                    >
                      Mô Tả Dịch Vụ
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        defaultValue={service.description}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium text-gray-700 required"
                    >
                      Hình Ảnh Dịch Vụ
                    </label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      {service && (
                        <div className="flex items-end gap-3">
                          <div className="h-24">
                            {newServiceImg ? (
                              <img
                                src={newServiceImg}
                                className="h-full w-full rounded-lg  object-cover"
                              />
                            ) : (
                              <img
                                src={service.image}
                                className="h-full w-full rounded-lg  object-cover"
                              />
                            )}
                          </div>
                          {/* <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="cover-photo"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Đổi ảnh mới
                              </span>
                              <input
                                id="cover-photo"
                                name="cover-photo"
                                type="file"
                                className="sr-only"
                                onChange={(e) =>
                                  e.target.files && setNewServiceImg(e.target.files[0])
                                }
                              />
                            </label>
                          </div> */}
                          <Widget
                            publicKey={process.env.NEXT_PUBLIC_UPLOADCARE as string}
                            onFileSelect={(file) => {
                              console.log("File changed: ", file);
                            }}
                            onChange={(file) => {
                              console.log(file);
                              if (file && file.uuid) {
                                setNewServiceImg(convertImg(file.uuid));
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-end">
                <button
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  type={load ? "button" : "submit"}
                >
                  {load ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT DỊCH VỤ"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </>
  );
}
