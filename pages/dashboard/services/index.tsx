import Tippy from "@tippyjs/react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import react, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { servicesAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { uploadImageProduct } from "../../../utils/funtions";
import { Service } from "../../../utils/types";

interface Toggle {
  index: number;
  isEdit: boolean;
  value: {
    name: string;
    description: string;
    image: string;
  };
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const services: Service[] = useSelector((state: RootState) => state.services);
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState<Toggle>({
    index: -1,
    isEdit: false,
    value: { name: "", description: "", image: "" },
  });
  console.log(toggle.value);
  const [image, setImage] = useState<any>();
  const upImg = useRef<any>(null);

  const handleClick = () => {
    upImg.current.click();
  };

  const getAllService = async () => {
    let { data, error } = await supabase.from("services").select("*");
    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      dispatch(servicesAction("services", data));
    }
  };
  useEffect(() => {
    getAllService();
  }, []);

  const updateService = async (id: string) => {
    try {
      const _name = toggle.value.name;
      const _description = toggle.value.description;
      let _image = toggle.value.image;

      console.log(toggle.value, id);
      if (image) {
        _image = (await uploadImageProduct(image, "services")) as string;
      }
      console.log(_image);
      const { data, error } = await supabase
        .from("services")
        .update({ name: _name, description: _description, image: _image })
        .eq("id", id)
        .select()
        .single();
      if (error != null) {
        toast.error(error.message);
      } else {
        let index = services.findIndex((item) => item.id == id);
        services[index] = data;
        toast.success(`Đã sửa ${_name}`);
        setToggle({
          index: -1,
          isEdit: false,
          value: { name: "", description: "", image: "" },
        });
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Dịch Vụ </title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">THÔNG TIN DỊCH VỤ</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý tất cả các dịch vụ ở Aura ID.
          </p>
        </div>
        <Link href="/dashboard/services/create-service">
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              THÊM DỊCH VỤ
            </button>
          </div>
        </Link>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      HÌNH
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      TÊN
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      MÔ TẢ
                    </th>
                    <th
                      scope="col"
                      className="sticky whitespace-nowrap top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      NGÀY TẠO
                    </th>
                    <th
                      scope="col"
                      className="sticky whitespace-nowrap top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {services &&
                    services.length > 0 &&
                    services.map((service, serviceIdx) => (
                      <tr key={service.id}>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                          )}
                        >
                          {serviceIdx}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <>
                              <Tippy content="Nháy chuột để chỉnh sửa ảnh">
                                <img
                                  onClick={handleClick}
                                  className="w-10 h-10 cursor-pointer"
                                  src={image ? URL.createObjectURL(image) : service.image}
                                />
                              </Tippy>
                              <input
                                ref={upImg}
                                type="file"
                                hidden
                                multiple
                                onChange={(e) =>
                                  e.target.files && setImage(e.target.files[0])
                                }
                              />
                            </>
                          ) : (
                            <img className="w-10 h-10" src={service.image} />
                          )}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <input
                              autoFocus
                              type="text"
                              id="newName"
                              name="newName"
                              aria-describedby="helper-text-explanation"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={toggle.value.name}
                              onChange={(e) =>
                                setToggle({
                                  index: serviceIdx,
                                  isEdit: true,
                                  value: { ...toggle.value, name: e.target.value },
                                })
                              }
                            />
                          ) : (
                            service.name
                          )}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <textarea
                              rows={4}
                              name="newDescription"
                              id="newDescription"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={toggle.value.description}
                              onChange={(e) =>
                                setToggle({
                                  index: serviceIdx,
                                  isEdit: true,
                                  value: { ...toggle.value, description: e.target.value },
                                })
                              }
                            />
                          ) : (
                            service.description
                          )}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {moment(service.created_at).format("DD/MM/YYYY")}
                        </td>
                        <td
                          className={classNames(
                            serviceIdx !== services.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
                          )}
                        >
                          {serviceIdx == toggle.index && toggle.isEdit ? (
                            <span
                              onClick={() => updateService(service.id)}
                              className="text-red-600  cursor-pointer hover:text-indigo-900"
                            >
                              Sửa
                            </span>
                          ) : (
                            <>
                              <span className="text-red-700 cursor-pointer hover:text-indigo-900">
                                Xoá
                              </span>
                              <span
                                onClick={() =>
                                  setToggle({
                                    index: serviceIdx,
                                    isEdit: true,
                                    value: {
                                      ...toggle.value,
                                      name: service.name,
                                      description: service.description,
                                      image: service.image,
                                    },
                                  })
                                }
                                className="text-indigo-600 ml-4 cursor-pointer hover:text-indigo-900"
                              >
                                Sửa
                              </span>
                            </>
                          )}
                          {serviceIdx == toggle.index && toggle.isEdit && (
                            <span
                              onClick={() => {
                                setToggle({
                                  index: -1,
                                  isEdit: false,
                                  value: { name: "", description: "", image: "" },
                                });
                                setImage(null);
                              }}
                              className="text-gray-600  cursor-pointer ml-4 hover:text-indigo-900"
                            >
                              Huỷ
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
