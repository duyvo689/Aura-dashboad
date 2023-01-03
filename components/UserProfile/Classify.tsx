import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
type Tag =
  | {
      id: string;
      name: string;
    }[]
  | null;
interface Props {
  setOpenModalUpdateTag: any;
  tags: Tag;
  group: Tag;
}
function Classify({ tags, group, setOpenModalUpdateTag }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full h-auto bg-white drop-shadow-md rounded-xl">
      <div
        onClick={() => {
          setIsOpen((preState) => !preState);
        }}
        className="flex items-center h-[48px] px-6  justify-between hover:bg-slate-200"
      >
        <div> Phân loại</div>
        <div className="bg-slate-200 p-1 rounded-full w-6 h-6 cursor-pointer">
          {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </div>
      </div>
      <div
        className={`${
          isOpen ? "min-h-0 h-auto overflow-visible" : "h-0 overflow-hidden"
        } `}
        style={{ transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms" }}
      >
        <div className="flex flex-col gap-4 py-4 px-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-base font-bold">Tag</div>
              <div className="opacity-50">
                {tags === null || tags.length === 0
                  ? "Chưa có dữ liệu"
                  : tags.map((item) => item.name).join(",")}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-base font-bold">Nhóm khách hàng</div>
              <div className="opacity-50">
                {group === null || group.length === 0
                  ? "Chưa có dữ liệu"
                  : group.map((item) => item.name).join(",")}
              </div>
            </div>
            {/* <div className="flex flex-col gap-2">
              <div className="text-base font-bold">Mạng xã hội</div>
              <div className="opacity-50">
                {group === null
                  ? "Chưa có dữ liệu"
                  : group.map((item) => item.name).join(",")}
              </div>
            </div> */}
          </div>

          <div
            onClick={() => {
              setOpenModalUpdateTag(true);
            }}
            className="flex items-center cursor-pointer  gap-2 pt-4 border-t hover:text-green-700 hover:font-bold"
          >
            <div className="opacity-50">Chỉnh sửa</div>
            <div className="w-4 h-4">
              <PencilIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Classify;
