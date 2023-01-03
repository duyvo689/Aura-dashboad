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
import InputForm from "../../../../components/Form/InputForm";
import SelectForm from "../../../../components/Form/SelectForm";
import TextArea from "../../../../components/Form/TextArea";
import InputImage from "../../../../components/Form/InputImage";
import SubmitBtn from "../../../../components/Form/SubmitBtn";
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
      setNewClinicImg(clinic.avatar);
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
        <div className="flex flex-col gap-5">
          <div className="flex justify-center">
            <div className="sm:flex sm:justify-between sm:items-center w-2/3 ">
              <div className="text-2xl font-bold text-slate-800">
                Cập nhật chi nhánh ✨
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
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-6 w-2/3">
              <form className="flex flex-col gap-5" onSubmit={updateClinic}>
                <InputForm
                  title="Tên cơ sở"
                  name="name"
                  id="name"
                  type="text"
                  defaultValue={clinic.name}
                />
                <InputForm
                  title="Địa chỉ cơ sở"
                  name="address"
                  id="address"
                  type="text"
                  defaultValue={clinic.address}
                />

                <SelectForm
                  name="district"
                  title="Thành phố"
                  defaultValue={
                    clinic.district
                      ? [{ label: clinic.district, value: clinic.district }]
                      : null
                  }
                  options={VNProvinces}
                />
                <TextArea
                  title="Mô tả cơ sở"
                  name="description"
                  id="description"
                  defaultValue={clinic.description}
                  row={5}
                />
                <InputImage
                  title={"Đổi hình ảnh cơ sở"}
                  required={true}
                  image={newClinicImg}
                  setImage={setNewClinicImg}
                />

                <div className="flex justify-end">
                  <SubmitBtn
                    type={isLoading ? "button" : "submit"}
                    content={isLoading ? "Đang câph nhật..." : "Cập nhật"}
                    size="md"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
export default UpdateClinic;
