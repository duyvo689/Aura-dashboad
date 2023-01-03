import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../services/supaBaseClient";
import SelectForm from "../Form/SelectForm";
import SubmitBtn from "../Form/SubmitBtn";
import TextArea from "../Form/TextArea";

interface Props {
  setOpenModal: any;
  setNewUpdateUser: any;
  userId: string;
  tags:
    | {
        id: string;
        name: string;
      }[]
    | null;
  group:
    | {
        id: string;
        name: string;
      }[]
    | null;
}
interface UserClassify {
  tags: {
    value: string;
    label: string;
  }[];
  customer_group: {
    value: string;
    label: string;
  }[];
}
const ModalUpdateTag = ({
  tags,
  group,
  userId,
  setOpenModal,
  setNewUpdateUser,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState<UserClassify | null>(null);
  const [selectedTag, setSelectedTags] = useState<any | null>(tags);
  const [selectedCustomerGroup, setSelectedCustomerGroup] = useState<any | null>(group);
  const updateTagUser = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(selectedTag);
    // console.log(selectedCustomerGroup);
    // setIsLoading(false);
    // console.log(e.target.description.value);
    const { data, error } = await supabase
      .from("users")
      .update({
        tags: selectedTag.map((item: any) => {
          return {
            id: item.value,
            name: item.label,
          };
        }),
        group: selectedCustomerGroup.map((item: any) => {
          return {
            id: item.value,
            name: item.label,
          };
        }),
      })
      .eq("id", userId)
      .select("*,status(*),details_status(*),interact_type(*),interact_result(*)")
      .single();
    if (data) {
      toast.success("Cập nhật thành công");
      setNewUpdateUser(data);
    } else {
      toast.error("Cập nhật thất bại. Thử lại");
    }
    console.log(data);
    setIsLoading(false);
    setOpenModal(false);
  };
  const getUserTags = async () => {
    const [{ data: customer_tags }, { data: customer_groups }] = await Promise.all([
      supabase.from("customer_tags").select("*"),
      supabase.from("customer_groups").select("*"),
    ]);

    if (customer_tags && customer_groups) {
      setTagOptions({
        tags: customer_tags.map((item) => {
          return { value: item.id, label: item.name };
        }),
        customer_group: customer_groups.map((group) => {
          return { value: group.id, label: group.name };
        }),
      });
    }
  };
  useEffect(() => {
    getUserTags();
  }, []);
  return (
    <div className="flex items-center">
      <div
        id="defaultModal"
        tabIndex={1}
        aria-hidden="true"
        className="left-0 top-0 flex text-black items-center bg-black/25 justify-center fixed w-full md:inset-0 min-w-screen min-h-screen"
        style={{ zIndex: 1000 }}
      >
        {tagOptions && (
          <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cập nhật thông tin người dùng
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="defaultModal"
                  onClick={() => {
                    setOpenModal(false);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <form onSubmit={updateTagUser}>
                <div className="p-4">
                  <SelectForm
                    name={"tag"}
                    title={"Tag"}
                    isMulti={true}
                    placeholder="Vui lòng chọn"
                    defaultValue={
                      tags
                        ? tags.map((item) => {
                            return {
                              label: item.name,
                              value: item.id,
                            };
                          })
                        : null
                    }
                    options={tagOptions.tags}
                    required={false}
                    myOnChange={(e: any) => setSelectedTags(e)}
                  />
                </div>
                <div className="p-4">
                  <SelectForm
                    name={"customer_group"}
                    title={"Nhóm khách hàng"}
                    placeholder="Vui lòng chọn"
                    defaultValue={
                      group
                        ? group.map((item) => {
                            return {
                              label: item.name,
                              value: item.id,
                            };
                          })
                        : null
                    }
                    options={tagOptions.customer_group}
                    required={false}
                    isMulti={true}
                    myOnChange={(e: any) => setSelectedCustomerGroup(e)}
                  />
                </div>
                <div className="p-4 space-y-6">
                  {/* <TextArea
                    title={"Mô tả"}
                    id={"description"}
                    name={"description"}
                    row={5}
                  /> */}
                </div>
                <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                  <SubmitBtn
                    type={isLoading ? "button" : "submit"}
                    content={isLoading ? "Đang cập nhật..." : "Cập nhật"}
                    size="md"
                  />
                  <button
                    data-modal-toggle="defaultModal"
                    type="button"
                    className=" text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={() => {
                      isLoading ? () => {} : setOpenModal(false);
                    }}
                  >
                    Huỷ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ModalUpdateTag;
