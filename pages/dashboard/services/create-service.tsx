import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { categoryAction, paymentAction } from "../../../redux/actions/ReduxAction";
import { supabase } from "../../../services/supaBaseClient";
import { Category } from "../../../utils/types";
import { XCircleIcon, ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { createImgId, uploadImageProduct } from "../../../utils/funtions";

export default function CreateService() {
  const [image, setImage] = useState<any>();
  const category: Category[] = useSelector((state: any) => state.category);
  const dispatch = useDispatch();
  const [load, setLoad] = useState<boolean>(false);

  const fieldsOfForm: any = {
    name: "Tên Dịch Vụ!",
    description: "Mô Tả Dịch Vụ!",
    price: "Giá Dịch Vụ!",
    category_id: "Danh Mục Dịch Vụ!",
    image: "Hình Ảnh Dịch Vụ!",
  };

  // Check validate
  function validateForm(form: any) {
    let fields = ["name", "price", "category_id", "description", "image"];
    let i,
      l = fields.length;
    let fieldname;
    for (i = 0; i < l; i++) {
      fieldname = fields[i];
      if (!form[fieldname]) {
        toast.error(`Thiếu thông tin ${fieldsOfForm[fieldname]}`);
        return false;
      }
    }
    return true;
  }

  const addNewService = async (event: any) => {
    try {
      event.preventDefault();
      setLoad(true);
      const _urlImg = await uploadImageProduct(image, "services");
      const _name = event.target.elements.name.value;
      const _price = event.target.elements.price.value;
      const _category = event.target.elements.category.value;
      const _description = event.target.elements.description.value;
      let _serviceInfo = {
        name: _name,
        price: _price,
        category_id: _category,
        description: _description,
        image: _urlImg,
      };
      let isValid = validateForm(_serviceInfo);
      if (!isValid) return;
      const { data, error } = await supabase
        .from("services")
        .insert([_serviceInfo])
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        toast.success(`Đã thêm thành công`);
        setImage(null);
        event.target.reset();
        console.log(data);
        category.push(data);
      }
      console.log(data, error);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
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
    getAllCategory();
  }, []);

  return (
    <>
      <Head>
        <title>Thêm Dịch Vụ </title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="sm:flex sm:items-center max-w-[860px] m-auto mt-6">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">THÊM DỊCH VỤ MỚI</h1>
          <p className="mt-2 text-sm text-gray-700">
            Nhập đầy đủ các thông tin để thêm mới một dịch vụ ở Aura ID.
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
        onSubmit={addNewService}
      >
        <div className="space-y-8 divide-gray-200">
          <div>
            <div className="pt-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên Dịch Vụ
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nhập Giá Dịch Vụ
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="price"
                      id="price"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Chọn Danh Mục
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      name="category"
                      autoComplete="country-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {category &&
                        category.length > 0 &&
                        category.map((item) => (
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
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                Mô Tả Dịch Vụ
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={""}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700"
              >
                Thêm Hình Ảnh Dịch Vụ
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                {image ? (
                  <div className="h-24 relative">
                    <img
                      src={URL.createObjectURL(image)}
                      className="h-full w-full rounded-lg  object-cover"
                    />
                    <div
                      className="absolute h-7 w-7 -top-4 -right-4"
                      onClick={() => setImage(null)}
                    >
                      <XCircleIcon />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center ">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
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
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={(e) => e.target.files && setImage(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-end">
          <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            type="submit"
          >
            {load ? "ĐANG THÊM..." : "THÊM SẢN PHẨM"}
          </button>
          <p className="text-red-600 text-[12px] font-[600]">
            *Lưu ý chọn Danh Mục cho dịch vụ!
          </p>
        </div>
      </form>
    </>
  );
}
