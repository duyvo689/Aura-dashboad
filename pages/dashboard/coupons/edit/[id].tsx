import { Widget } from "@uploadcare/react-widget";
import Head from "next/head";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { couponsAction } from "../../../../redux/actions/ReduxAction";
import { RootState } from "../../../../redux/reducers";
import { supabase } from "../../../../services/supaBaseClient";
import convertImg from "../../../../utils/helpers/convertImg";
import { Coupon } from "../../../../utils/types";
import { NumericFormat } from "react-number-format";
import { getAllNumberFromString } from "../../../../utils/helpers/convertToVND";
import InputForm from "../../../../components/Form/InputForm";
import SelectForm from "../../../../components/Form/SelectForm";
import InputPrice from "../../../../components/Form/InputPrice";
import SubmitBtn from "../../../../components/Form/SubmitBtn";
import TextArea from "../../../../components/Form/TextArea";
import InputImage from "../../../../components/Form/InputImage";
import Datepicker from "../../../../components/actions/Datepicker";
const listPercentPrice = [
  { value: "price", label: "Coupon giảm theo giá" },
  { value: "percent", label: "Coupon giảm theo phần trăm" },
];

function EditCoupon() {
  const { id } = useRouter().query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newCouponImage, setNewCouponImage] = useState<string | null>(null);
  const coupons: Coupon[] = useSelector((state: RootState) => state.coupons);
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [pricePercent, setPricePercent] = useState<string | null>(null);
  const getCouponById = async (id: string) => {
    setIsLoading(true);
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      toast.error("Lỗi. Thử lại.");
    } else if (coupon) {
      setCoupon(coupon);
      setNewCouponImage(coupon.image);
      setPricePercent(coupon.price ? "price" : "percent");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (!id) return;
    getCouponById(id as any as string);
  }, [id]);
  const editCoupon = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    if (!coupon) return;
    const _name = event.target.name.value;
    const _description = event.target.description.value;
    let _price = null;
    let _percent = null;
    if (coupon?.percent) {
      _percent = getAllNumberFromString(event.target.percentInput.value);
    } else {
      _price = getAllNumberFromString(event.target.priceInput.value);
    }

    let _image = coupon?.image;
    if (newCouponImage) {
      _image = newCouponImage;
    }
    let _updateCouponsInfo: any = {
      name: _name,
      price: _price,
      percent: _percent,
      description: _description,
      image: _image,
    };
    if (coupon.tag === "orther") {
      _updateCouponsInfo.start_date = event.target.start_date.value;
      _updateCouponsInfo.end_date = event.target.end_date.value;
    }

    const { data, error } = await supabase
      .from("coupons")
      .update(_updateCouponsInfo)
      .eq("id", id)
      .select(`*,service_id(*)`)
      .single();
    if (error) {
      toast.error("Lỗi cập nhật coupon. Thử lại");
    } else if (data) {
      let index = coupons.findIndex((item) => item.id == id);
      coupons[index] = data;
      dispatch(couponsAction("coupons", coupons));
      toast.success(`Cập nhật thành công`);
      router.push("/dashboard/coupons");
    }
    setIsLoading(true);
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
  });
  return (
    <>
      <Head>
        <title>Chỉnh sửa Coupon</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex flex-col gap-5">
        <div className="flex justify-center">
          <div className="sm:flex sm:justify-between sm:items-center w-2/3 ">
            <div className="text-2xl font-bold text-slate-800">Chỉnh sửa Coupon ✨</div>
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
        {coupon ? (
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-6 w-2/3">
              <form className="flex flex-col gap-5" onSubmit={editCoupon}>
                <InputForm
                  title="Tên coupon"
                  name="name"
                  id="name"
                  type="text"
                  defaultValue={coupon.name}
                />
                <SelectForm
                  name="couponType"
                  title="Chọn giá trị"
                  defaultValue={
                    coupon.price
                      ? [{ value: "price", label: "Coupon giảm theo giá" }]
                      : [{ value: "percent", label: "Coupon giảm theo phần trăm" }]
                  }
                  options={listPercentPrice}
                  myOnChange={(e: any) => {
                    setPricePercent(e ? e.value : null);
                  }}
                />

                {pricePercent === "price" && (
                  <InputPrice
                    title="Giá"
                    name="priceInput"
                    type="price"
                    defaultValue={coupon.price}
                  />
                )}
                {pricePercent === "percent" && (
                  <InputPrice
                    title="Phần trăm"
                    name="percentInput"
                    type="percent"
                    defaultValue={coupon.percent}
                  />
                )}
                <TextArea
                  title="Mô tả"
                  name={"description"}
                  id={"description"}
                  defaultValue={coupon.description}
                  required={true}
                  row={5}
                />
                {coupon.tag === "orther" && (
                  <div>
                    <label
                      htmlFor="date"
                      className="block font-medium text-sm mb-1 text-slate-600 required"
                    >
                      Ngày bắt đầu áp dụng
                    </label>
                    <div className="flex items-center mt-1">
                      <Datepicker name="start_date" defaultValue={coupon.start_date} />
                      <span className="mx-4 text-gray-500">Đến</span>
                      <Datepicker name="end_date" defaultValue={coupon.end_date} />
                    </div>
                  </div>
                )}
                <InputImage
                  title={"Hình ảnh Coupon"}
                  required={true}
                  image={newCouponImage}
                  setImage={setNewCouponImage}
                />
                <div className="flex justify-end">
                  <SubmitBtn
                    type={isLoading ? "button" : "submit"}
                    content={isLoading ? "Đang thêm..." : "Thêm mới"}
                    size="md"
                  />
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {/* {coupon ? (
        <form
          id="myForm"
          className="space-y-8 divide-gray-200 mb-20 max-w-[860px] m-auto"
          onSubmit={editCoupon}
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
                      defaultValue={coupon.name}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
         

                {coupon.percent ? (
                  <div className="sm:col-span-3 mt-6">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 required"
                    >
                      Phần trăm
                    </label>
                    <div className="mt-1">
                      <NumericFormat
                        name="percent"
                        allowLeadingZeros
                        className="block w-full rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={coupon?.percent}
                        suffix={"%"}
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
                      <NumericFormat
                        name="price"
                        allowLeadingZeros
                        className="block w-full rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={coupon?.price}
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
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {coupon && coupon.start_date != null && (
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
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <input
                        name="start_date"
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Ngày bắt đầu"
                        defaultValue={coupon.start_date}
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
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <input
                        name="end_date"
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Ngày kết thúc"
                        defaultValue={coupon.end_date}
                      />
                    </div>
                  </div>
                </div>
              )}
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
                      defaultValue={coupon.description}
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
                  {coupon && (
                    <div className="flex items-end gap-3">
                      <div className="h-24">
                        {newCouponImage ? (
                          <img
                            src={newCouponImage}
                            className="h-full w-full rounded-lg  object-cover"
                          />
                        ) : (
                          <img
                            src={coupon.image}
                            className="h-full w-full rounded-lg  object-cover"
                          />
                        )}
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="cover-photo"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <Widget
                            publicKey={process.env.NEXT_PUBLIC_UPLOADCARE as string}
                            clearable
                            multiple={false}
                            onChange={(file) => {
                              if (file) {
                                setNewCouponImage(convertImg(file.uuid!));
                              }
                            }}
                          />
                        </label>
                      </div>
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
            {isLoading ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT COUPON"}
          </button>
        </form>
      ) : (
        <div>Loading...</div>
      )} */}
    </>
  );
}
export default EditCoupon;
