import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { couponsAction } from "../../../redux/actions/ReduxAction";
import { Coupon } from "../../../utils/types";
import { RootState } from "../../../redux/reducers";
import UploadCareAPI from "../../../services/uploadCareAPI";
import convertImg from "../../../utils/helpers/convertImg";
import { Widget } from "@uploadcare/react-widget";

export default function CreateCoupon() {
  const [couponImage, setCouponImage] = useState<string | null>(null);
  const [load, setLoad] = useState<boolean>(false);
  const coupons: Coupon[] = useSelector((state: RootState) => state.coupons);
  const [couponType, setCouponType] = useState<string | null>(null);
  const dispatch = useDispatch();
  const fieldsOfForm: any = {
    name: "Tên Coupon!",
    description: "Mô Tả Coupon!",
    image: "Hình Ảnh Coupon!",
    start_date: "Ngày bắt đầu",
    end_date: "Ngày kết thúc",
    price: "Giá giảm",
    percent: "Phần trăm giảm",
  };

  function validateForm(form: any) {
    let fields = [
      "name",
      "description",
      "image",
      "start_date",
      "end_date",
      `${couponType === "percent" ? "percent" : "price"}`,
    ];
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

  const addNewCoupon = async (event: any) => {
    event.preventDefault();
    setLoad(true);
    const _name = event.target.name.value;
    const _description = event.target.description.value;
    let _price = null;
    let _percent = null;
    if (couponType && couponType === "percent") {
      _percent = event.target.percent.value;
    } else {
      _price = event.target.price.value;
    }
    const _start_date = event.target.start_date.value;
    const _end_date = event.target.end_date.value;
    let _couponsInfo = {
      name: _name,
      price: _price,
      percent: _percent,
      start_date: _start_date,
      end_date: _end_date,
      description: _description,
      image: couponImage || "",
    };
    let isValid = validateForm(_couponsInfo);
    if (!isValid || !couponImage) {
      setLoad(false);
      return;
    }
    const { data, error } = await supabase
      .from("counpons")
      .insert([_couponsInfo])
      .select("*")
      .single();
    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success(`Đã thêm coupon thành công`);
      coupons.push(data);
      dispatch(couponsAction("coupons", coupons));
      setCouponImage(null);
      event.target.reset();
    }
    setLoad(false);
  };
  const getAllCoupon = async () => {
    let { data: counpons, error } = await supabase
      .from("counpons")
      .select(`*,service_id(*)`);
    if (error) {
      toast.error("Lỗi. Vui lòng tải lại trang");
      return;
    } else if (counpons) {
      //   console.log(counpons);
      dispatch(couponsAction("coupons", counpons));
    }
  };
  useEffect(() => {
    if (!coupons) {
      getAllCoupon();
    }
  }, []);
  return (
    <>
      <Head>
        <title>Thêm Coupon</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="sm:flex sm:items-center max-w-[860px] m-auto mt-6">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">THÊM COUPON MỚI</h1>
          <p className="mt-2 text-sm text-gray-700">
            Nhập đầy đủ các thông tin để thêm mới một coupon
          </p>
        </div>
        <Link href="/dashboard/clinics">
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
        onSubmit={addNewCoupon}
      >
        <div className="space-y-8 divide-gray-200">
          <div>
            <div className="pt-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 required"
                >
                  Tên
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-3 mt-6">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loại Coupon
                </label>
                <select
                  id="location"
                  name="location"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  defaultValue="price"
                  onChange={(e) => {
                    setCouponType(e.target.value);
                  }}
                >
                  <option value="price">Giá</option>
                  <option value="percent">Phầm trăm</option>
                </select>
              </div>

              {couponType && couponType === "percent" ? (
                <div className="sm:col-span-3 mt-6">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 required"
                  >
                    Phần trăm
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="percent"
                      id="percent"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="sm:col-span-3 mt-6">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giá
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center"></div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      className="block w-full rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="0.00"
                      aria-describedby="price-currency"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-7">
                      <span className="text-gray-500 sm:text-sm" id="price-currency">
                        VND
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 required"
              >
                Hiệu lực
              </label>
              <div date-rangepicker className="flex items-center">
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    name="start_date"
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Ngày bắt đầu"
                  />
                </div>
                <span className="mx-4 text-gray-500">to</span>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    name="end_date"
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Ngày kết thúc"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 required"
                >
                  Mô Tả
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700 required"
              >
                Hình Ảnh
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                {couponImage ? (
                  <div className="h-24 relative">
                    <img
                      src={couponImage}
                      className="h-full w-full rounded-lg  object-cover"
                    />
                    <div
                      className="absolute h-7 w-7 -top-4 -right-4"
                      onClick={() => setCouponImage(null)}
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

                    <Widget
                      publicKey={process.env.NEXT_PUBLIC_UPLOADCARE as string}
                      clearable
                      multiple={false}
                      onChange={(file) => {
                        if (file) {
                          setCouponImage(convertImg(file.uuid!));
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          type="submit"
        >
          {load ? "ĐANG THÊM..." : "THÊM COUPON"}
        </button>
      </form>
    </>
  );
}
