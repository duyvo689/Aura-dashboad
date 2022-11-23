import Tippy from "@tippyjs/react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clinicsAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { uploadImageProduct } from "../../../utils/funtions";
import { Clinic, OpenModal } from "../../../utils/types";
import ModalDelete from "../services/modal-delete";

interface Toggle {
  index: number;
  isEdit: boolean;
  value: {
    name: string;
    description: string;
    image: string;
    address: string;
  };
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ClinicPage() {
  const clinics: Clinic[] = useSelector((state: RootState) => state.clinics);
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState<Toggle>({
    index: -1,
    isEdit: false,
    value: { name: "", description: "", image: "", address: "" },
  });

  const [image, setImage] = useState<any>();
  const upImg = useRef<any>(null);
  const [open, setOpen] = useState<OpenModal>({ isOpen: false, id: "", name: "" });

  const updateActive = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from(" clinics")
        .update({ active: false })
        .eq("id", id)
        .select();
      if (error != null) {
        toast.error(error.message);
      } else {
        toast.success(`Đã xoá cơ sở`);
        let newClinics = clinics.filter((item) => item.id !== id);
        dispatch(clinicsAction("clinics", newClinics));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpen({ isOpen: false, id: "", name: "" });
    }
  };
  const handleClick = () => {
    upImg.current.click();
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
    getAllClinic();
  }, []);

  const updateClinic = async (id: string) => {
    try {
      const _name = toggle.value.name;
      const _description = toggle.value.description;
      const _address = toggle.value.address;
      let _image = toggle.value.image;

      if (image) {
        _image = (await uploadImageProduct(image, "clinics")) as string;
      }
      const { data, error } = await supabase
        .from(" clinics")
        .update({
          name: _name,
          description: _description,
          avatar: _image,
          address: _address,
        })
        .eq("id", id)
        .select()
        .single();

      if (error != null) {
        toast.error(error.message);
      } else {
        let index = clinics.findIndex((item) => item.id == id);
        clinics[index] = data;
        toast.success(`Đã sửa ${_name}`);
        setToggle({
          index: -1,
          isEdit: false,
          value: { name: "", description: "", image: "", address: "" },
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
        <title>Cở sở</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">THÔNG TIN CƠ SỞ</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý tất cả các cơ sở ở Aura ID.
          </p>
        </div>
        <Link href="/dashboard/clinics/create-clinic">
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              THÊM CỞ SỞ
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
                      ĐỊA CHỈ
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
                  {clinics &&
                    clinics.length > 0 &&
                    clinics.map((clinic, clinicIdx) => (
                      <tr key={clinic.id}>
                        <td
                          className={classNames(
                            clinicIdx !== clinics.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                          )}
                        >
                          {clinicIdx}
                        </td>
                        <td
                          className={classNames(
                            clinicIdx !== clinics.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
                          )}
                        >
                          {clinicIdx == toggle.index && toggle.isEdit ? (
                            <>
                              <Tippy content="Nháy chuột để chỉnh sửa ảnh">
                                <img
                                  onClick={handleClick}
                                  className="w-10 h-10 cursor-pointer"
                                  src={image ? URL.createObjectURL(image) : clinic.avatar}
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
                            <img className="w-10 h-10" src={clinic.avatar} />
                          )}
                        </td>
                        <td
                          className={classNames(
                            clinicIdx !== clinics.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {clinicIdx == toggle.index && toggle.isEdit ? (
                            <textarea
                              rows={4}
                              name="newDescription"
                              id="newDescription"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-w-[100px]"
                              value={toggle.value.name}
                              onChange={(e) =>
                                setToggle({
                                  index: clinicIdx,
                                  isEdit: true,
                                  value: { ...toggle.value, name: e.target.value },
                                })
                              }
                            />
                          ) : (
                            clinic.name
                          )}
                        </td>
                        <td
                          className={classNames(
                            clinicIdx !== clinics.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {clinicIdx == toggle.index && toggle.isEdit ? (
                            <textarea
                              rows={4}
                              name="newDescription"
                              id="newDescription"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={toggle.value.address}
                              onChange={(e) =>
                                setToggle({
                                  index: clinicIdx,
                                  isEdit: true,
                                  value: { ...toggle.value, address: e.target.value },
                                })
                              }
                            />
                          ) : (
                            clinic.address
                          )}
                        </td>
                        <td
                          className={classNames(
                            clinicIdx !== clinics.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {clinicIdx == toggle.index && toggle.isEdit ? (
                            <textarea
                              rows={4}
                              name="newDescription"
                              id="newDescription"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={toggle.value.description}
                              onChange={(e) =>
                                setToggle({
                                  index: clinicIdx,
                                  isEdit: true,
                                  value: { ...toggle.value, description: e.target.value },
                                })
                              }
                            />
                          ) : (
                            clinic.description
                          )}
                        </td>
                        <td
                          className={classNames(
                            clinicIdx !== clinics.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-wrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {moment(clinic.created_at).format("DD/MM/YYYY")}
                        </td>
                        <td
                          className={classNames(
                            clinicIdx !== clinics.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
                          )}
                        >
                          {clinicIdx == toggle.index && toggle.isEdit ? (
                            <span
                              onClick={() => updateClinic(clinic.id)}
                              className="text-red-600  cursor-pointer hover:text-indigo-900"
                            >
                              Lưu Lại
                            </span>
                          ) : (
                            <>
                              <span
                                onClick={() =>
                                  setOpen({
                                    isOpen: true,
                                    id: clinic.id,
                                    name: clinic.name,
                                  })
                                }
                                className="text-red-700 cursor-pointer hover:text-indigo-900"
                              >
                                Xoá
                              </span>
                              <span
                                onClick={() =>
                                  setToggle({
                                    index: clinicIdx,
                                    isEdit: true,
                                    value: {
                                      ...toggle.value,
                                      name: clinic.name,
                                      description: clinic.description,
                                      image: clinic.avatar,
                                      address: clinic.address,
                                    },
                                  })
                                }
                                className="text-indigo-600 ml-4 cursor-pointer hover:text-indigo-900"
                              >
                                Sửa
                              </span>
                            </>
                          )}
                          {clinicIdx == toggle.index && toggle.isEdit && (
                            <span
                              onClick={() => {
                                setToggle({
                                  index: -1,
                                  isEdit: false,
                                  value: {
                                    name: "",
                                    description: "",
                                    image: "",
                                    address: "",
                                  },
                                });
                                setImage(null);
                              }}
                              className="text-indigo-500  cursor-pointer ml-4 hover:text-indigo-900"
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
      {/* <ModalDelete open={open} setOpen={setOpen} updateActive={updateActive} /> */}
    </div>
  );
}
