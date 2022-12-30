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
import SelectForm from "../../../components/Form/SelectForm";
import InputForm from "../../../components/Form/InputForm";
import InputPrice from "../../../components/Form/InputPrice";
import TextArea from "../../../components/Form/TextArea";
import InputImage from "../../../components/Form/InputImage";
import SubmitBtn from "../../../components/Form/SubmitBtn";
import Datepicker from "../../../components/actions/Datepicker";
import { useRouter } from "next/router";
const listRank = [
  { value: "silver", label: "Hạng bạc" },
  { value: "gold", label: "Hạng vàng" },
  { value: "diamond", label: "Hạng kim cương" },
  { value: "platinum", label: "Hạng platinum" },
];

const listCoupon = [
  { value: "orther", label: "Khác" },
  { value: "birthday", label: "Ngày sinh nhật" },
  { value: "newacc", label: "Tài khoản mới" },
  { value: "rank", label: "Hạng thành viên" },
  { value: "client", label: "Khách hàng" },
];
const listPercentPrice = [
  { value: "price", label: "Coupon giảm theo giá" },
  { value: "percent", label: "Coupon giảm theo phần trăm" },
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
  const [pricePercent, setPricePercent] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [client, setClient] = useState<User | null>();
  const [typeCoupon, setTypeCoupon] = useState<string>("");
  const [rankClient, setRankClient] = useState<string>("");
  const router = useRouter();
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
        router.push("/dasboard/coupons");
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
        router.push("/dasboard/coupons");
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
        console.log(_couponsInfo);
        const { data, error } = await supabase
          .from("coupons")
          .insert([_couponsInfo])
          .select("*")
          .single();
        toast.success(`Đã thêm coupon thành công`);
        coupons.push(data);
        dispatch(couponsAction("coupons", coupons));
        router.push("/dasboard/coupons");
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
            } else {
              router.push("/dasboard/coupons");
            }
          }
        }
      }
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
      <div className="flex flex-col gap-5">
        <div className="flex justify-center">
          <div className="sm:flex sm:justify-between sm:items-center w-2/3 ">
            <div className="text-2xl font-bold text-slate-800">Thêm coupons ✨</div>
            <Link href="/dashboard/coupons">
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
            <form className="flex flex-col gap-5" onSubmit={addNewCoupon}>
              <SelectForm
                name="typeCoupon"
                title="Chọn loại coupon"
                placeholder="Vui lòng chọn"
                options={listCoupon}
                required={true}
                myOnChange={(e: any) => setTypeCoupon(e ? e.value : null)}
              />
              {typeCoupon == "rank" && (
                <SelectForm
                  name="selectRank"
                  title="Chọn loại bậc hạng"
                  placeholder="Vui lòng chọn"
                  options={listRank}
                  required={true}
                  myOnChange={(e: any) => setRankClient(e ? e.value : null)}
                />
              )}

              {typeCoupon == "client" && (
                <>
                  <InputForm
                    title="Số điện thoại khách hàng"
                    name="phone"
                    id="phone"
                    type="text"
                    placeholder={"Ex: 0903123123"}
                    required={true}
                    myOnChange={(e: any) => searchPhoneUser(e.target.value)}
                  />
                  {client ? (
                    <div>
                      <div className="block font-medium text-sm mb-1 text-slate-600">
                        Thông tin khách hàng
                      </div>
                      <div className="flex gap-4 mt-1 items-center">
                        <img
                          className="w-10 h-10 rounded-full"
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

              <InputForm
                title="Tên coupon"
                name="name"
                id="name"
                type="text"
                placeholder={"Ex: Giảm giá 20%..."}
                required={true}
              />
              <SelectForm
                name="notification-method"
                title="Chọn giá trị"
                placeholder="Vui lòng chọn"
                options={listPercentPrice}
                required={true}
                myOnChange={(e: any) => {
                  setPricePercent(e ? e.value : null);
                }}
              />

              {pricePercent === "price" && (
                <InputPrice title="Giá" name="priceInput" type="price" />
              )}
              {pricePercent === "percent" && (
                <InputPrice title="Phần trăm" name="percentInput" type="percent" />
              )}
              {(typeCoupon == "orther" || typeCoupon == "client") && (
                <div>
                  <label
                    htmlFor="date"
                    className="block font-medium text-sm mb-1 text-slate-600 required"
                  >
                    Ngày bắt đầu áp dụng
                  </label>
                  <div className="flex items-center mt-1">
                    <Datepicker name="start_date" />
                    <span className="mx-4 text-gray-500">Đến</span>
                    <Datepicker name="end_date" />
                  </div>
                </div>
              )}
              <TextArea
                title="Mô tả"
                name={"description"}
                id={"description"}
                defaultValue=""
                required={true}
                row={5}
              />
              <InputImage
                title={"Hình ảnh Coupon"}
                required={true}
                image={couponImage}
                setImage={setCouponImage}
              />
              <div className="flex justify-end">
                <SubmitBtn
                  type={load ? "button" : "submit"}
                  content={load ? "Đang thêm..." : "Thêm mới"}
                  size="md"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
