import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { couponsAction } from "../../../redux/actions/ReduxAction";
import { Coupon, User } from "../../../utils/types";
import { RootState } from "../../../redux/reducers";
import convertImg from "../../../utils/helpers/convertImg";
import { Widget } from "@uploadcare/react-widget";
import { getAllNumberFromString } from "../../../utils/helpers/convertToVND";
import { NumericFormat } from "react-number-format";

const listRank = [
  { id: "silver", title: "Hạng bạc" },
  { id: "gold", title: "Hạng vàng" },
  { id: "diamond", title: "Hạng kim cương" },
  { id: "platinum", title: "Hạng platinum" },
];

const listCoupon = [
  { id: "orther", title: "Khác" },
  { id: "birthday", title: "Ngày sinh nhật" },
  { id: "newacc", title: "Tài khoản mới" },
  { id: "rank", title: "Hạng thành viên" },
  { id: "client", title: "Khách hàng" },
];
const listPercentPrice = [
  { id: "price", title: "Coupon giảm theo giá" },
  { id: "percent", title: "Coupon giảm theo phần trăm" },
];

const fieldsOfForm: any = {
  name: "Tên Coupon!",
  description: "Mô Tả Coupon!",
  image: "Hình Ảnh Coupon!",
  // start_date: "Ngày bắt đầu",
  // end_date: "Ngày kết thúc",
  price: "Giá giảm",
  percent: "Phần trăm giảm",
};

export default function CreateCoupon() {
  const [couponImage, setCouponImage] = useState<string | null>(null);
  const [load, setLoad] = useState<boolean>(false);
  const [loadSerchUser, setLoadSerchUser] = useState<boolean>(false);
  const coupons: Coupon[] = useSelector((state: RootState) => state.coupons);
  const [pricePercent, setPricePercent] = useState<string>("price");
  const [phone, setPhone] = useState<string>("");
  const [client, setClient] = useState<User | null>();
  const [typeCoupon, setTypeCoupon] = useState<string>("orther");
  const [rankClient, setRankClient] = useState<string>("silver");

  const dispatch = useDispatch();

  function validateForm(form: any) {
    let fields = [
      "name",
      "description",
      "image",
      "start_date",
      "end_date",
      `${pricePercent === "percent" ? "percent" : "price"}`,
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
  const searchPhoneUser = async (value: string) => {
    setPhone(value);
    if (value.length >= 10) {
      setLoadSerchUser(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .ilike("phone", `%${value}%`);
        if (data) {
          setClient(data[0]);
        }
      } catch (error) {
      } finally {
        setLoadSerchUser(false);
      }
    } else {
      setClient(null);
    }
  };

  const addNewCoupon = async (event: any) => {
    try {
      event.preventDefault();
      if (!couponImage) {
        toast.error(`Chưa thêm hình ảnh coupon`);
        return;
      }
      setLoad(true);
      //Chung
      const _name = event.target.name.value;
      const _description = event.target.description.value;
      let _price = null;
      let _percent = null;
      if (pricePercent && pricePercent === "percent") {
        _percent = getAllNumberFromString(event.target.percentInput.value);
      } else {
        _price = getAllNumberFromString(event.target.priceInput.value);
      }

      //Nếu chọn orther
      if (typeCoupon == "orther") {
        const _start_date = event.target.start_date.value;
        const _end_date = event.target.end_date.value;
        if (!_start_date || !_end_date) {
          toast.error(`Chưa chọn hạn sử dụng của coupon`);
          return;
        }
        let _couponsInfo = {
          name: _name,
          price: _price,
          percent: _percent,
          start_date: _start_date,
          end_date: _end_date,
          description: _description,
          image: couponImage || "",
          tag: "orther",
        };
        const { data, error } = await supabase
          .from("coupons")
          .insert([_couponsInfo])
          .select("*")
          .single();
        toast.success(`Đã thêm coupon thành công`);
        coupons.push(data);
        dispatch(couponsAction("coupons", coupons));
      }
      //Nếu chọn birthday || tài khoản mới
      if (typeCoupon == "birthday" || typeCoupon == "newacc") {
        let _couponsInfo = {
          name: _name,
          price: _price,
          percent: _percent,
          description: _description,
          image: couponImage || "",
          tag: typeCoupon,
        };
        const { data, error } = await supabase
          .from("coupons")
          .insert([_couponsInfo])
          .select("*")
          .single();
        toast.success(`Đã thêm coupon thành công`);
        coupons.push(data);
        dispatch(couponsAction("coupons", coupons));
      }
      //Nếu chọn hạng thành viên
      if (typeCoupon == "rank") {
        let _couponsInfo = {
          name: _name,
          price: _price,
          percent: _percent,
          description: _description,
          image: couponImage || "",
          tag: rankClient,
        };
        const { data, error } = await supabase
          .from("coupons")
          .insert([_couponsInfo])
          .select("*")
          .single();
        toast.success(`Đã thêm coupon thành công`);
        coupons.push(data);
        dispatch(couponsAction("coupons", coupons));
      }
      //Nếu chọn Khách hàng => tạo coupon trong bảng coupons tiếp tạo coupons trong bảng coupons_user
      if (typeCoupon == "client") {
        const _start_date = event.target.start_date.value;
        const _end_date = event.target.end_date.value;
        if (!_start_date || !_end_date) {
          toast.error(`Chưa chọn hạn sử dụng của coupon`);
          return;
        }
        let _couponsInfo = {
          name: _name,
          price: _price,
          percent: _percent,
          start_date: null,
          end_date: null,
          description: _description,
          image: couponImage || "",
          tag: "client",
        };
        const { data, error } = await supabase
          .from("coupons")
          .insert([_couponsInfo])
          .select("*")
          .single();
        if (!error) {
          toast.success(`Đã thêm coupon thành công`);
        }
        coupons.push(data);
        dispatch(couponsAction("coupons", coupons));
        if (client && data) {
          const { data: coupon_user, error: err_coupon_user } = await supabase
            .from("coupons_user")
            .insert({
              user_id: client.id,
              coupons_id: data.id,
              start_date: _start_date,
              end_date: _end_date,
            })
            .select("*")
            .single();
          if (err_coupon_user) {
            toast.error(err_coupon_user.message);
          }
        }
        //Nếu chưa có khách hàng thì tạo khách hàng mới trong users -> tạo coupons cho khách hàng
        if (!client && data) {
          const { data: user, error: err_user } = await supabase
            .from("users")
            .insert({
              phone: phone,
            })
            .select("*")
            .single();
          if (err_user) {
            toast.error(err_user.message);
          }
          if (user) {
            const { data: coupon_user, error: err_coupon_user } = await supabase
              .from("coupons_user")
              .insert({
                user_id: user.id,
                coupons_id: data.id,
              })
              .select("*")
              .single();
            if (err_coupon_user) {
              toast.error(err_coupon_user.message);
            }
          }
        }
      }
      setCouponImage(null);
      setPricePercent("price");
      event.target.reset();
    } catch (error) {
    } finally {
      setLoad(false);
    }
  };

  const getAllCoupon = async () => {
    let { data: counpons, error } = await supabase
      .from("coupons")
      .select(`*,service_id(*)`);
    if (error) {
      toast.error("Lỗi. Vui lòng tải lại trang");
      return;
    } else if (counpons) {
      dispatch(couponsAction("coupons", counpons));
    }
  };
  useEffect(() => {
    if (!coupons) {
      getAllCoupon();
    }
  }, [coupons]);
  return (
    <>
      <Head>
        <title>Thêm Coupon</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex flex-col gap-5"></div>
      <div className="flex justify-center">
        <div className="sm:flex sm:justify-between sm:items-center w-2/3 ">
          <div className="text-2xl font-bold text-slate-800">Thêm chi nhánh ✨</div>
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
      </div>
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-6 w-2/3">
          <div className="grid grid-cols-4 gap-10 mt-16">
            <label className="block text-sm font-medium block mr-0 text-end required">
              Chọn loại coupon
            </label>
            <fieldset className="col-span-3">
              <legend className="sr-only">Notification method</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                {listCoupon.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <input
                      id={item.id}
                      name="notification-method"
                      type="radio"
                      defaultChecked={item.id === "orther"}
                      value={typeCoupon}
                      onChange={() => setTypeCoupon(item.id)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={item.id}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {item.title}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
          <form
            id="myForm"
            className="space-y-8 divide-gray-200 mb-20  m-auto"
            onSubmit={addNewCoupon}
          >
            <div className="space-y-8 divide-gray-200">
              {typeCoupon == "rank" && (
                <div className="grid grid-cols-4 gap-10 mt-6">
                  <label className="block text-sm font-medium   text-end">
                    Chọn bậc hạng
                  </label>
                  <fieldset className="col-span-3">
                    <legend className="sr-only">Notification method</legend>
                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      {listRank.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <input
                            id={item.id}
                            name="selectRank"
                            type="radio"
                            defaultChecked={item.id === rankClient}
                            onChange={() => setRankClient(item.id)}
                            value={rankClient}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={item.id}
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            {item.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
              {typeCoupon == "client" && (
                <>
                  <div className="grid grid-cols-4 gap-10 mt-6">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium required text-end"
                    >
                      Số điện thoại khách hàng
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        required
                        value={phone}
                        onChange={(e) => searchPhoneUser(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  {client ? (
                    <div className="grid grid-cols-4 gap-10">
                      <label className="block text-sm font-medium text-end">
                        Khách hàng
                      </label>
                      <div className="flex gap-4 items-center">
                        <img
                          className="w-14 h-14 rounded-full"
                          src={
                            client?.avatar
                              ? client.avatar
                              : "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                          }
                        />
                        <div>
                          <span className="text-sm block text-gray-800">
                            {client.name}
                          </span>
                          <span className="text-sm block text-gray-600">
                            {client.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : phone && !loadSerchUser ? (
                    <div className="grid grid-cols-4 gap-10">
                      <label className="block text-sm font-medium  text-end">
                        Khách hàng
                      </label>
                      <div className="flex gap-4 col-span-2 items-center">
                        <img
                          className="w-14 h-14 rounded-full"
                          src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                        />
                        <div>
                          <div className="flex flex-col">
                            <span className="text-sm block text-gray-600">
                              Không có thông tin khách hàng
                            </span>
                            <span className="text-sm block text-gray-800">
                              Tạo coupon sẽ tạo một khách hàng mới
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    loadSerchUser && (
                      <div className="grid grid-cols-4 gap-10">
                        <span></span>
                        <div className="text-gray-600">Đang tải...</div>
                      </div>
                    )
                  )}
                </>
              )}

              <div className="grid grid-cols-4 gap-10 mt-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium required text-end "
                >
                  Tên coupon
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="form-input w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-10 mt-6">
                <label className="block text-sm font-medium block mr-0 text-end ">
                  Chọn giá trị
                </label>
                <fieldset className="col-span-3">
                  <legend className="sr-only">Notification method</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                    {listPercentPrice.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <input
                          id={item.id}
                          name="notification-method"
                          type="radio"
                          defaultChecked={item.id === "price"}
                          value={pricePercent}
                          onChange={(e) => {
                            setPricePercent(item.id);
                          }}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={item.id}
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          {item.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>

              {pricePercent && pricePercent === "percent" ? (
                <div className="grid grid-cols-4 gap-10 mt-6">
                  <label
                    htmlFor="percentInput"
                    className="block text-sm font-medium required text-end"
                  >
                    Phần trăm
                  </label>
                  <div className="col-span-2">
                    <NumericFormat
                      name="percentInput"
                      allowLeadingZeros
                      className="block w-full rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      suffix={"%"}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-10 mt-6">
                  <label
                    htmlFor="priceInput"
                    className="block text-sm font-medium text-end required"
                  >
                    Giá
                  </label>
                  <div className="col-span-2 relative rounded-md shadow-sm">
                    <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center"></div>
                    <NumericFormat
                      name="priceInput"
                      allowLeadingZeros
                      className="block w-full rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      thousandSeparator=","
                      suffix="đ"
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

            {(typeCoupon == "orther" || typeCoupon == "client") && (
              <div className="grid grid-cols-4 gap-10">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium required text-end"
                >
                  Ngày bắt đầu áp dụng
                </label>
                <div date-rangepicker className="flex  items-center">
                  <div className="relative ">
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
                          clipRule="evenodd"
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
                  <span className="mx-4 text-gray-500">Đến</span>
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
                          clipRule="evenodd"
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
            )}

            <div className="grid grid-cols-4 gap-10 mt-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-end required"
              >
                Mô Tả
              </label>
              <div className="col-span-2">
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
            <div className="grid grid-cols-4 gap-10 mt-6">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium required text-end"
              >
                Hình Ảnh
              </label>
              <div className="col-span-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
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
            <div className="grid grid-cols-4 gap-10">
              <span></span>
              <button
                className="col-span-2 block ml-auto mr-0 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                type="submit"
              >
                {load ? "ĐANG THÊM..." : "THÊM COUPON"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
