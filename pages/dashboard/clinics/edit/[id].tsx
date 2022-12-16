import { Widget } from "@uploadcare/react-widget";
import Head from "next/head";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clinicsAction } from "../../../../redux/actions/ReduxAction";
import { RootState } from "../../../../redux/reducers";
import { supabase } from "../../../../services/supaBaseClient";
import convertImg from "../../../../utils/helpers/convertImg";
import { Clinic } from "../../../../utils/types";
import Select from "react-select";
import VNProvinces from "../../../../constants/VNProvince";
function UpdateClinic() {
  const { id } = useRouter().query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newClinicImg, setNewClinicImg] = useState<string | null>(null);
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const dispatch = useDispatch();
  const fetchClinicById = async () => {
    let { data: clinic, error } = await supabase
      .from(" clinics")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      toast("Lỗi. Thử lại.");
      return;
    } else if (clinic) {
      setClinic(clinic);
    }
  };
  const updateClinic = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (!clinics || !clinic) return;
    const _name = e.target.name.value;
    const _description = e.target.description.value;
    const _address = e.target.address.value;
    const _district = e.target.district.value;
    let _image = clinic.avatar;

    if (newClinicImg) {
      _image = newClinicImg;
    }
    const { data, error } = await supabase
      .from(" clinics")
      .update({
        name: _name,
        description: _description,
        avatar: _image,
        address: _address,
        district: _district,
      })
      .eq("id", id)
      .select()
      .single();

    if (error != null) {
      toast.error(error.message);
    } else {
      let index = clinics.findIndex((item) => item.id == id);
      clinics[index] = data;
      dispatch(clinicsAction("clinics", clinics));
      toast.success(`Cập nhật thành công`);
      router.push("/dashboard/clinics");
    }
    setIsLoading(false);
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
  }, [clinics]);
  useEffect(() => {
    if (!clinic && id) {
      fetchClinicById();
    }
  }, [id]);
  return (
    <>
      <Head>
        <title>Cập Nhật Cơ Sở</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {clinic ? (
        <main>
          <div className="sm:flex sm:items-center max-w-[860px] m-auto mt-6">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                Cập nhật thông tin cơ sở
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Nhập đầy đủ các thông tin để cập nhật thông tin cho một cơ sở Aura ID.
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
            onSubmit={updateClinic}
          >
            <div className="space-y-8 divide-gray-200">
              <div>
                <div className="pt-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 "
                    >
                      Tên Cơ Sở
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={clinic.name}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3 mt-6">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 "
                    >
                      Địa Chỉ Cơ Sở
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        defaultValue={clinic.address}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3 mt-6">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 "
                    >
                      Vị trí
                    </label>
                    <div className="mt-1">
                      <Select
                        name="district"
                        placeholder={"Chọn cơ sở"}
                        defaultValue={
                          clinic.district
                            ? VNProvinces.find((item) => item.value === clinic.district)
                            : null
                        }
                        noOptionsMessage={({ inputValue }) =>
                          !inputValue ? inputValue : "Không có dữ liệu"
                        }
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
                    className="block text-sm font-medium text-gray-700 "
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
                      defaultValue={clinic.description}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium text-gray-700 "
                  >
                    Hình Ảnh Cơ Sở
                  </label>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    {clinic && (
                      <div className="flex items-end gap-3">
                        <div className="h-24">
                          {newClinicImg ? (
                            <img
                              src={newClinicImg}
                              className="h-full w-full rounded-lg  object-cover"
                            />
                          ) : (
                            <img
                              src={clinic.avatar}
                              className="h-full w-full rounded-lg  object-cover"
                            />
                          )}
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="cover-photo"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            {/* <span className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                              Đổi ảnh mới
                            </span>
                            <input
                              id="cover-photo"
                              name="cover-photo"
                              type="file"
                              className="sr-only"
                              onChange={(e) =>
                                e.target.files && setNewClinicImg(e.target.files[0])
                              }
                            /> */}
                            <Widget
                              publicKey={process.env.NEXT_PUBLIC_UPLOADCARE as string}
                              clearable
                              multiple={false}
                              onChange={(file) => {
                                if (file) {
                                  setNewClinicImg(convertImg(file.uuid!));
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
              type={isLoading ? "button" : "submit"}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật cơ sở"}
            </button>
          </form>
        </main>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
export default UpdateClinic;
