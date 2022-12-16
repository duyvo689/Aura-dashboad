import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../services/supaBaseClient";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { clinicsAction } from "../../../redux/actions/ReduxAction";
import { Clinic } from "../../../utils/types";
import { RootState } from "../../../redux/reducers";
import convertImg from "../../../utils/helpers/convertImg";
import { Widget } from "@uploadcare/react-widget";
import Select from "react-select";
import VNProvinces from "../../../constants/VNProvince";
export default function CreateClinic() {
  const [clinicImage, setClinicImg] = useState<string | null>(null);
  const [load, setLoad] = useState<boolean>(false);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const dispatch = useDispatch();
  const fieldsOfForm: any = {
    name: "Tên Cơ Sở!",
    description: "Mô Tả Cơ Sở!",
    address: "Địa Chỉ!",
    avatar: "Hình Ảnh Cơ Sở!",
    district: "Tỉnh thành của cơ sở",
  };

  // Check validate
  function validateForm(form: any) {
    let fields = ["name", "address", "description", "avatar", "district"];
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

  const addNewClinic = async (event: any) => {
    event.preventDefault();
    setLoad(true);
    const _name = event.target.elements.name.value;
    const _address = event.target.elements.address.value;
    const _description = event.target.elements.description.value;
    const _district = event.target.district.value;
    let _serviceInfo = {
      name: _name,
      address: _address,
      description: _description,
      avatar: clinicImage || "",
      district: _district,
    };
    let isValid = validateForm(_serviceInfo);
    if (!isValid || !clinicImage) return;

    const { data, error } = await supabase
      .from(" clinics")
      .insert([_serviceInfo])
      .select("*")
      .single();
    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success(`Đã thêm cở sở thành công`);
      clinics.push(data);
      dispatch(clinicsAction("clinics", clinics));
      setClinicImg(null);
      event.target.reset();
    }
    setLoad(false);
  };
  const getAllClinic = async () => {
    let { data: clinics, error } = await supabase
      .from(" clinics")
      .select("*")
      .eq("active", true);
    if (error) {
      toast(error.message);
      return;
    }
    if (clinics && clinics.length > 0) {
      dispatch(clinicsAction("clinics", clinics));
    }
  };
  useEffect(() => {
    if (!clinics) {
      getAllClinic();
    }
  }, []);
  return (
    <>
      <Head>
        <title>Thêm Cơ Sở</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="sm:flex sm:items-center max-w-[860px] m-auto mt-6">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">THÊM CƠ SỞ MỚI</h1>
          <p className="mt-2 text-sm text-gray-700">
            Nhập đầy đủ các thông tin để thêm mới một cơ sở Aura ID.
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
        onSubmit={addNewClinic}
      >
        <div className="space-y-8 divide-gray-200">
          <div>
            <div className="pt-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 required"
                >
                  Tên Cơ Sở
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
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 required"
                >
                  Địa Chỉ Cơ Sở
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-3 mt-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 required"
                >
                  Địa Chỉ Cơ Sở
                </label>
                <div className="mt-1">
                  <Select
                    name="district"
                    placeholder={"Vui lòng chọn"}
                    options={VNProvinces}
                    // onChange={(e) => {
                    //   setSelectedDistrict(e?.value ? e.value : null);
                    // }}
                  ></Select>
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
                Mô Tả Cơ Sở
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

            <div className="sm:col-span-6">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700 required"
              >
                Thêm Hình Ảnh Cơ Sở
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                {clinicImage ? (
                  <div className="h-24 relative">
                    <img
                      src={clinicImage}
                      className="h-full w-full rounded-lg  object-cover"
                    />
                    <div
                      className="absolute h-7 w-7 -top-4 -right-4"
                      onClick={() => setClinicImg(null)}
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
                    {/* <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload hình ảnh</span>
                        <input
                          id="cover-photo"
                          name="cover-photo"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={(e) =>
                            e.target.files && setClinicImg(e.target.files[0])
                          }
                        />
                      </label>
                      <p className="pl-1">(kéo hoặc thả)</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG</p> */}
                    <Widget
                      publicKey={process.env.NEXT_PUBLIC_UPLOADCARE as string}
                      clearable
                      multiple={false}
                      onChange={(file) => {
                        if (file) {
                          setClinicImg(convertImg(file.uuid!));
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
          {load ? "ĐANG THÊM..." : "THÊM CƠ SỞ"}
        </button>
      </form>
    </>
  );
}
