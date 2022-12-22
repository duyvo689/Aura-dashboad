import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { bannersAction } from "../../../redux/actions/ReduxAction";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { Banner } from "../../../utils/types";
const UPLOADCARE_KEY = process.env.NEXT_PUBLIC_UPLOADCARE as string;
import SelectForm from "../../../components/Form/SelectForm";
import InputImage from "../../../components/Form/InputImage";
import SubmitBtn from "../../../components/Form/SubmitBtn";
import InputForm from "../../../components/Form/InputForm";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
const bannerType = [
  {
    value: "OA",
    label: "OA",
  },
  { value: "Link", label: "Link" },
  { value: "Dịch vụ", label: "Dịch vụ" },
];
const InputSelect = {
  title: "Loại banner",
  name: "type",
  required: true,
  placeholder: "Vui lòng chọn",
  options: bannerType,
};
const renderTypeBanner = (type: string) => {
  return (
    <InputForm
      title={`${type}(Nếu có)`}
      name="link"
      id="link"
      type="text"
      placeholder="Đường dẫn cho banner"
    />
  );
};
function CreateBanner() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const widgetApi = useRef<any>(null);
  const banners: Banner[] = useSelector((state: RootState) => state.banners);
  const [selectedType, setSelectedType] = useState(bannerType[0]);
  const router = useRouter();
  const dispatch = useDispatch();
  const getAllBanner = async () => {
    let { data: banners, error } = await supabase.from("banners").select("*");
    if (error) {
      toast(error.message);
      return;
    }
    if (banners && banners.length > 0) {
      dispatch(bannersAction("banners", banners));
    }
  };
  useEffect(() => {
    if (!banners) {
      getAllBanner();
    }
  }, [banners]);
  const addNewBanner = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    if (!banners) {
      return;
    }
    if (!bannerImage) {
      toast("Vui lòng chọn hình ảnh");
    } else {
      const link = event.target.elements.link.value;

      // const _urlImg = await uploadImageProduct(image, "banners");
      const { data, error } = await supabase
        .from("banners")
        .insert([{ link: link, image_url: bannerImage }])
        .select()
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
  console.log(selectedType);
  return (
    <>
      <Head>
        <title>Tạo mới banners</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
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
                defaultValue={bannerType[0]}
                placeholder={InputSelect.placeholder}
                options={InputSelect.options}
                required={InputSelect.required}
                myOnChange={(e: any) => {
                  setSelectedType(e);
                }}
              />

              {selectedType && renderTypeBanner(selectedType.value)}
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
      {/* <div className="px-4">
        <form className="space-y-8 divide-y divide-gray-200" onSubmit={addNewBanner}>
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Tạo banner
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Tạo banner cho Aura ID App. Thông tin sẽ được hiển thị trên Aura ID app.
                </p>
              </div>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Loại
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <Listbox value={selectedType}>
                    {({ open }) => (
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <div className="block w-full flex-1">
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                              <span className="flex items-center">
                                <span className="ml-3 block truncate">
                                  {selectedType.name}
                                </span>
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>

                            <Transition
                              show={open}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {bannerType.map((item, index: number) => (
                                  <Listbox.Option
                                    key={index}
                                    onClick={() => {
                                      setSelectedType({ name: item.name });
                                    }}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "text-white bg-indigo-600"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={item.name}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          <span
                                            className={classNames(
                                              selected ? "font-semibold" : "font-normal",
                                              "ml-3 block truncate"
                                            )}
                                          >
                                            {item.name}
                                          </span>
                                        </div>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active ? "text-white" : "text-indigo-600",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </div>
                      </div>
                    )}
                  </Listbox>
                </div>
              </div>
            </div>
            {selectedType && renderTypeBanner(selectedType.name)}

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 required"
              >
                Hình ảnh banner
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  {bannerImage ? (
                    <div className="h-24 relative">
                      <img
                        src={bannerImage}
                        className="h-full w-full rounded-lg  object-cover"
                      />

                      <div
                        className="absolute h-7 w-7 -top-4 -right-4 cursor-pointer"
                        onClick={() => setBannerImage(null)}
                      >
                        <XCircleIcon />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
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
                      
                      <Widget
                        ref={widgetApi}
                        publicKey={UPLOADCARE_KEY}
                        clearable
                        multiple={false}
                        onChange={(file) => {
                          if (file) {
                            setBannerImage(convertImg(file.uuid!));
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type={isLoading ? "button" : "submit"}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isLoading ? "Đang tạo..." : "Tạo mới"}
              </button>
            </div>
          </div>
        </form>
      </div> */}
    </>
  );
}
export default CreateBanner;
