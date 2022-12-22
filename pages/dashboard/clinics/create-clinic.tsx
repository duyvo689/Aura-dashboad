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
import InputForm from "../../../components/Form/InputForm";
import TextArea from "../../../components/Form/TextArea";
import SelectForm from "../../../components/Form/SelectForm";
import InputImage from "../../../components/Form/InputImage";
import SubmitBtn from "../../../components/Form/SubmitBtn";
const InputFields = [
  {
    type: "text",
    title: "Tên cơ sở",
    id: "name",
    name: "name",
    placeholder: "Ex Aura Cơ sở 3",
    required: true,
  },
  {
    type: "text",
    title: "Đia chỉ cơ sở",
    id: "address",
    name: "address",
    placeholder: "Ex: Tphcm",
    required: true,
  },
];
const InputTextArea = {
  type: "textarea",
  title: "Mô tả cơ sở",
  id: "description",
  name: "description",
  placeholder: "Ex: Tphcm",
  required: true,
  rows: 4,
};
const InputSelect = {
  title: "Thành phố",
  name: "district",
  required: true,
  placeholder: "Vui lòng chọn",
  options: VNProvinces,
};
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
    let _clinicsInfo = {
      name: _name,
      address: _address,
      description: _description,
      avatar: clinicImage || "",
      district: _district,
    };

    let isValid = validateForm(_clinicsInfo);
    if (!isValid || !clinicImage) return;

    const { data, error } = await supabase
      .from(" clinics")
      .insert([_clinicsInfo])
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
      <div className="flex flex-col gap-5">
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
            <form className="flex flex-col gap-5" onSubmit={addNewClinic}>
              {InputFields.map((item, index: number) => {
                return (
                  <InputForm
                    key={index}
                    title={item.title}
                    name={item.name}
                    id={item.id}
                    type={item.type}
                    placeholder={item.placeholder}
                    required={item.required}
                  />
                );
              })}
              <SelectForm
                name={InputSelect.name}
                title={InputSelect.title}
                placeholder={InputSelect.placeholder}
                options={InputSelect.options}
                required={InputSelect.required}
              />
              <TextArea
                title={InputTextArea.title}
                name={InputTextArea.name}
                id={InputTextArea.id}
                defaultValue=""
                required={true}
                row={5}
              />

              <InputImage
                title={"Thêm hình ảnh cơ sở"}
                required={true}
                image={clinicImage}
                setImage={setClinicImg}
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
