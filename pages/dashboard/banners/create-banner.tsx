import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  bannersAction,
  OAPostAction,
  servicesAction,
} from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { Banner, OAPost, Service } from "../../../utils/types";
const UPLOADCARE_KEY = process.env.NEXT_PUBLIC_UPLOADCARE as string;
import SelectForm from "../../../components/Form/SelectForm";
import InputImage from "../../../components/Form/InputImage";
import SubmitBtn from "../../../components/Form/SubmitBtn";
import InputForm from "../../../components/Form/InputForm";
import Select from "react-select";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
const bannerType = [
  {
    value: "OA",
    label: "OA",
  },
  { value: "services", label: "Dịch vụ" },
];
const InputSelect = {
  title: "Loại banner",
  name: "type",
  required: true,
  placeholder: "Vui lòng chọn",
  options: bannerType,
};

function CreateBanner() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const banners: Banner[] = useSelector((state: RootState) => state.banners);
  const oaPosts: OAPost[] = useSelector((state: RootState) => state.oaPosts);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<
    | {
        label: string;
        value: string;
        image: string;
      }[]
    | null
  >(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const getAllBanner = async () => {
    let { data: banners, error } = await supabase
      .from("banners")
      .select("*,service_id(*),link(*)");
    if (error) {
      toast(error.message);
      return;
    }
    if (banners && banners.length > 0) {
      dispatch(bannersAction("banners", banners));
    }
  };
  const getAllOAPost = async () => {
    let { data: oa_post, error } = await supabase.from("oa_post").select("*");
    if (error) {
    } else if (oa_post) {
      dispatch(OAPostAction("oaPosts", oa_post));
    }
  };
  const getAllService = async () => {
    let { data, error } = await supabase.from("services").select(`*,category_id(*)`);

    if (error) {
      toast(error.message);
      return;
    }
    if (data) {
      dispatch(servicesAction("services", data));
    }
  };
  useEffect(() => {
    if (!banners) {
      getAllBanner();
    }
  }, [banners]);
  useEffect(() => {
    if (!oaPosts) {
      getAllOAPost();
    }
  }, [oaPosts]);
  useEffect(() => {
    if (!services) {
      getAllService();
    }
  }, [services]);
  const addNewBanner = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    const link = event.target.link.value || null;
    const type = event.target.type.value || null;

    if (!banners) {
      setIsLoading(false);
      return;
    }
    if (!link || !type) {
      toast("Nhập thiếu dữ liệu");
      setIsLoading(false);
      return;
    }

    if (!bannerImage) {
      toast("Vui lòng chọn hình ảnh");
    } else {
      const newBannerOption = {
        type: type,
        link: type === "OA" ? link : null,
        service_id: type === "services" ? link : null,
        image_url: bannerImage,
      };
      const { data, error } = await supabase
        .from("banners")
        .insert([newBannerOption])
        .select("*,service_id(*),link(*)")
        .single();
      if (error) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      } else {
        banners.push(data);
        dispatch(bannersAction("banners", banners));
        toast.success(`Thêm banner thành công`);
        router.push("/dashboard/banners");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedType === null || !oaPosts || !services) return;
    if (selectedType === "OA") {
      setBannerType(
        oaPosts.map((item) => {
          return {
            label: item.title,
            value: item.id,
            image: item.thumb,
          };
        })
      );
    }
    if (selectedType === "services") {
      setBannerType(
        services.map((item) => {
          return {
            label: item.name,
            value: item.id,
            image: item.image,
          };
        })
      );
    }
  }, [selectedType]);
  return (
    <>
      <Head>
        <title>Tạo mới banners</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {oaPosts && services ? (
        <div className="flex flex-col gap-5">
          <div className="flex justify-center">
            <div className="sm:flex sm:justify-between sm:items-center w-2/3 ">
              <div className="text-2xl font-bold text-slate-800">Thêm banner ✨</div>
              <Link href="/dashboard/banners">
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
              <form className="flex flex-col gap-5" onSubmit={addNewBanner}>
                <SelectForm
                  name={InputSelect.name}
                  title={InputSelect.title}
                  placeholder={InputSelect.placeholder}
                  options={InputSelect.options}
                  required={InputSelect.required}
                  myOnChange={(e: any) => {
                    setSelectedType(e ? e.value : null);
                    setBannerType(null);
                  }}
                />

                {bannerType && (
                  <Select
                    id="link"
                    name="link"
                    placeholder="Chọn đường dẫn liên kết"
                    options={bannerType}
                    formatOptionLabel={(bannerType) => (
                      <div className="flex gap-2 items-center">
                        <img
                          src={bannerType.image}
                          className="w-10 h-10 rounded-full"
                          alt="country-image"
                        />
                        <span className="text-sm font-normal">{bannerType.label}</span>
                      </div>
                    )}
                  ></Select>
                )}

                <InputImage
                  title={"Thêm hình ảnh cơ sở"}
                  required={true}
                  image={bannerImage}
                  setImage={setBannerImage}
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
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
export default CreateBanner;
