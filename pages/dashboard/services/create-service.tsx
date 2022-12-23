import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { categoryAction, servicesAction } from "../../../redux/actions/ReduxAction";
import { supabase } from "../../../services/supaBaseClient";
import { Category, Service } from "../../../utils/types";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import UploadCareAPI from "../../../services/uploadCareAPI";
import { RootState } from "../../../redux/reducers";
import convertImg from "../../../utils/helpers/convertImg";
import router from "next/router";
import { Widget } from "@uploadcare/react-widget";
import { getAllNumberFromString } from "../../../utils/helpers/convertToVND";
import InputForm from "../../../components/Form/InputForm";
import SelectForm from "../../../components/Form/SelectForm";
import TextArea from "../../../components/Form/TextArea";
import InputImage from "../../../components/Form/InputImage";
import SubmitBtn from "../../../components/Form/SubmitBtn";
import InputPrice from "../../../components/Form/InputPrice";

const InputFields = [
  {
    type: "text",
    title: "Tên dịch vụ",
    id: "name",
    name: "name",
    placeholder: "Ex: Chữa răng",
    required: true,
  },
];
const InputTextArea = {
  type: "textarea",
  title: "Mô Tả Dịch Vụ",
  id: "description",
  name: "description",
  required: true,
  rows: 5,
};
const InputSelect = {
  title: "Chọn Danh Mục",
  name: "category",
  required: true,
  placeholder: "Vui lòng chọn",
};
const InputPriceForm = {
  title: "Nhập Giá Dịch Vụ",
  name: "price",
};
export default function CreateService() {
  const [serviceImage, setServiceImage] = useState<string | null>(null);
  const categories: Category[] = useSelector((state: any) => state.category);
  const services: Service[] = useSelector((state: RootState) => state.services);
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
    event.preventDefault();
    setLoad(true);
    if (!services) return;
    if (!serviceImage) {
      toast("Vui lòng chọn hình ảnh");
      setLoad(true);
      return;
    }
    const _name = event.target.elements.name.value;
    const _price = getAllNumberFromString(event.target.elements.price.value);
    const _category = event.target.elements.category.value;
    const _description = event.target.elements.description.value;

    let _serviceInfo = {
      name: _name,
      price: _price,
      category_id: _category,
      description: _description,
      image: serviceImage,
    };

    let isValid = validateForm(_serviceInfo);
    if (!isValid) return;
    const { data, error } = await supabase
      .from("services")
      .insert([_serviceInfo])
      .select(`*,category_id(*)`)
      .single();
    if (error != null) {
      toast.error(error.message);
    } else if (data) {
      toast.success(`Đã thêm thành công`);
      services.unshift(data);
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

  return (
    <>
      <Head>
        <title>Thêm Dịch Vụ </title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="flex flex-col gap-5">
        <div className="flex justify-center">
          <div className="sm:flex sm:justify-between sm:items-center w-2/3 ">
            <div className="text-2xl font-bold text-slate-800">Thêm dịch vụ ✨</div>
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
        </div>
        {categories ? (
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-6 w-2/3">
              <form className="flex flex-col gap-5" onSubmit={addNewService}>
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
                <div className="grid grid-cols-2 gap-2">
                  <InputPrice
                    title={InputPriceForm.title}
                    name={InputPriceForm.name}
                    type="price"
                  />
                  <SelectForm
                    name={InputSelect.name}
                    title={InputSelect.title}
                    placeholder={InputSelect.placeholder}
                    options={categories.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    })}
                    required={InputSelect.required}
                  />
                </div>
                <TextArea
                  title={InputTextArea.title}
                  name={InputTextArea.name}
                  id={InputTextArea.id}
                  defaultValue=""
                  required={true}
                  row={5}
                />

                <InputImage
                  title={"Thêm hình ảnh dịch vụ"}
                  required={true}
                  image={serviceImage}
                  setImage={setServiceImage}
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
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}
