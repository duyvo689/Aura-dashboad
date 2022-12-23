import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { categoryAction, servicesAction } from "../../../../redux/actions/ReduxAction";
import { supabase } from "../../../../services/supaBaseClient";
import { Category, Service } from "../../../../utils/types";
import Head from "next/head";
import Link from "next/link";
import UploadCareAPI from "../../../../services/uploadCareAPI";
import { RootState } from "../../../../redux/reducers";
import convertImg from "../../../../utils/helpers/convertImg";
import router, { useRouter } from "next/router";
import { Widget } from "@uploadcare/react-widget";
import { XCircleIcon } from "@heroicons/react/24/outline";
import InputForm from "../../../../components/Form/InputForm";
import InputPrice from "../../../../components/Form/InputPrice";
import SelectForm from "../../../../components/Form/SelectForm";
import TextArea from "../../../../components/Form/TextArea";
import InputImage from "../../../../components/Form/InputImage";
import SubmitBtn from "../../../../components/Form/SubmitBtn";

export default function UpdateService() {
  const { id } = useRouter().query;
  const [newServiceImg, setNewServiceImg] = useState<string | null>(null);
  const categories: Category[] = useSelector((state: any) => state.category);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const [service, setService] = useState<Service | null>(null);
  const dispatch = useDispatch();
  const [load, setLoad] = useState<boolean>(false);

  const fetchServiceById = async () => {
    let { data: service, error } = await supabase
      .from("services")
      .select(`*,category_id(*)`)
      .eq("id", id)
      .single();
    if (error) {
      toast("Lỗi. Thử lại.");
      return;
    } else if (service) {
      setService(service);
      setNewServiceImg(service.image);
    }
  };
  const updateService = async (event: any) => {
    event.preventDefault();
    setLoad(true);
    if (!services || !service) return;
    let updateImage = service.image;
    if (newServiceImg) {
      updateImage = newServiceImg;
    }
    const _name = event.target.elements.name.value;
    const _price = event.target.elements.price.value;
    const _category = event.target.elements.category.value;
    const _description = event.target.elements.description.value;
    let _serviceInfo = {
      name: _name,
      price: _price,
      category_id: _category,
      description: _description,
      image: updateImage,
    };
    const { data, error } = await supabase
      .from("services")
      .update([_serviceInfo])
      .eq("id", id)
      .select(`*,category_id(*)`)
      .single();
    if (error != null) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Cập nhật thành công");
      let index = services.findIndex((item) => item.id == id);
      services[index] = data;
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
  useEffect(() => {
    if (id) {
      fetchServiceById(), [id];
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Cập nhật dịch vụ</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <main>
        {service && categories ? (
          <div className="flex flex-col gap-5">
            <div className="flex justify-center">
              <div className="sm:flex sm:justify-between sm:items-center w-2/3 ">
                <div className="text-2xl font-bold text-slate-800">
                  Cập nhật dịch vụ ✨
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
            </div>
            {categories ? (
              <div className="flex justify-center">
                <div className="bg-white rounded-lg p-6 w-2/3">
                  <form className="flex flex-col gap-5" onSubmit={updateService}>
                    <InputForm
                      title="Tên dịch vụ"
                      name="name"
                      id="name"
                      type="text"
                      defaultValue={service.name}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <InputPrice
                        title="Nhập Giá Dịch Vụ"
                        name="price"
                        defaultValue={service.price}
                        type="price"
                      />
                      <SelectForm
                        name="category"
                        title="Chọn Danh Mục"
                        defaultValue={{
                          label: service.category_id.name,
                          value: service.category_id.id,
                        }}
                        options={categories.map((item) => {
                          return {
                            label: item.name,
                            value: item.id,
                          };
                        })}
                      />
                    </div>
                    <TextArea
                      title="Mô Tả Dịch Vụ"
                      name="description"
                      id="description"
                      defaultValue={service.description}
                      row={5}
                    />

                    <InputImage
                      title={"Thêm hình ảnh dịch vụ"}
                      required={true}
                      image={newServiceImg}
                      setImage={setNewServiceImg}
                    />
                    <div className="flex justify-end">
                      <SubmitBtn
                        type={load ? "button" : "submit"}
                        content={load ? "Đang cập nhật..." : "Cập nhật"}
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
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </>
  );
}
