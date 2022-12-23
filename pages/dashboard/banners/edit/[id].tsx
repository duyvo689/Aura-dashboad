import { Widget } from "@uploadcare/react-widget";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import InputForm from "../../../../components/Form/InputForm";
import InputImage from "../../../../components/Form/InputImage";
import SelectFormImg from "../../../../components/Form/SelectFormImg";
import SubmitBtn from "../../../../components/Form/SubmitBtn";
import {
  bannersAction,
  OAPostAction,
  servicesAction,
} from "../../../../redux/actions/ReduxAction";
import { RootState } from "../../../../redux/reducers";
import { supabase } from "../../../../services/supaBaseClient";
import UploadCareAPI from "../../../../services/uploadCareAPI";
import convertImg from "../../../../utils/helpers/convertImg";
import { Banner, OAPost, Service } from "../../../../utils/types";
const UPLOADCARE_KEY = process.env.NEXT_PUBLIC_UPLOADCARE as string;
function UpdateBanner() {
  const { id } = useRouter().query;
  const oaPosts: OAPost[] = useSelector((state: RootState) => state.oaPosts);
  const services: Service[] = useSelector((state: RootState) => state.services);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newBannerImg, setNewBannerImg] = useState<string | null>(null);
  const banners: Banner[] = useSelector((state: RootState) => state.banners);
  const [banner, setBanner] = useState<Banner | null>(null);
  const dispatch = useDispatch();
  const fetchBannerById = async () => {
    let { data: banner, error } = await supabase
      .from("banners")
      .select("*,service_id(*),link(*)")
      .eq("id", id)
      .single();
    if (error) {
      toast("Lỗi. Thử lại.");
      return;
    } else if (banner) {
      setBanner(banner);
      setNewBannerImg(banner.image_url);
    }
  };
  const getAllBanner = async () => {
    let { data: banners, error } = await supabase
      .from("banners")
      .select("*,service_id(*),link(*)");
    if (error) {
      toast("Lỗi. Thử lại.");
      return;
    }
    if (banners && banners.length > 0) {
      console.log(banners);
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
  const updateBanner = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    if (!banners || !banner) {
      return;
    } else {
      let updateImage = banner.image_url; //default
      const link = event.target.link.value;

      if (newBannerImg) {
        updateImage = newBannerImg;
      }
      const updateBannerOption = {
        link: banner.link ? link : null,
        service_id: banner.service_id ? link : null,
        image_url: updateImage,
      };

      const { data, error } = await supabase
        .from("banners")
        .update(updateBannerOption)
        .eq("id", id)
        .select("*,service_id(*),link(*)")
        .single();
      if (error) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      } else {
        let index = banners.findIndex((item) => item.id == id);
        banners[index] = data;
        dispatch(bannersAction("banners", banners));
        toast.success(`Cập nhật banner thành công`);
        router.push("/dashboard/banners");
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (!id) return;
    fetchBannerById();
  }, [id]);
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
  return (
    <div className="px-4">
      {banner && services && oaPosts ? (
        <div className="flex flex-col gap-5">
          <div className="flex justify-center">
            <div className="sm:flex sm:justify-between sm:items-center w-2/3 ">
              <div className="text-2xl font-bold text-slate-800">Cập nhật banner ✨</div>
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
              <div className="block font-bold text-base mb-1 text-slate-600">
                {`Loại: ${banner.type === "OA" ? "OA" : "Dịch vụ"}`}
              </div>
              <form className="flex flex-col gap-5" onSubmit={updateBanner}>
                <SelectFormImg
                  name="link"
                  title="Link liên kết banner"
                  placeholder="Vui lòng chọn"
                  options={
                    banner.service_id
                      ? services.map((item) => {
                          return {
                            label: item.name,
                            value: item.id,
                            image: item.image,
                          };
                        })
                      : banner.link
                      ? oaPosts.map((item) => {
                          return {
                            label: item.title,
                            value: item.id,
                            image: item.thumb,
                          };
                        })
                      : []
                  }
                  defaultValue={
                    banner.service_id
                      ? {
                          label: banner.service_id.name,
                          value: banner.service_id.id,
                          image: banner.service_id.image,
                        }
                      : banner.link
                      ? {
                          label: banner.link.title,
                          value: banner.link.id,
                          image: banner.link.thumb,
                        }
                      : null
                  }
                />
                <InputImage
                  title={"Đổi hình ảnh cơ sở"}
                  required={true}
                  image={newBannerImg}
                  setImage={setNewBannerImg}
                />
                <div className="flex justify-end">
                  <SubmitBtn
                    type={isLoading ? "button" : "submit"}
                    content={isLoading ? "Đang cập nhật..." : "Cập nhật"}
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
    </div>
  );
}
export default UpdateBanner;
