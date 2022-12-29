import moment from "moment";
import { useRef, useState } from "react";
import { CallData } from "../../utils/types";
import FormData from "form-data";
import {
  PhoneArrowUpRightIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { StorageAPI } from "../../api";
import { supabase } from "../../services/supaBaseClient";
import { toast } from "react-hot-toast";
interface Props {
  callData: CallData[];
}
interface SyncData {
  sync: boolean;
  record_file: string;
}
const CallDataItem = ({ item }: { item: CallData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncData, setSyncData] = useState<SyncData | null>(null);
  const fileForm = useRef<any>(null);
  const handlerOpenForm = (id: string) => {
    fileForm.current.setAttribute("data-id", id);
    fileForm.current.click();
  };
  const uploadToStorage = async (id: string, file: File) => {
    setIsLoading(true);
    const accessKey = await StorageAPI.getAccessKey();
    const asyncCallData = await StorageAPI.upload(accessKey, file);
    if (asyncCallData) {
      const { data, error } = await supabase
        .from("omi_calls")
        .update({ record_file: asyncCallData, sync: true })
        .eq("id", id)
        .select("*")
        .single();
      if (error) {
        toast.error("Đồng bộ lỗi. Thử lại");
      } else if (data) {
        console.log(data);
        setSyncData({
          record_file: data.record_file,
          sync: data.sync,
        });
        toast.success("Đồng bộ thành công");
      }
    }
    setIsLoading(false);
  };
  return (
    <div className="py-3">
      <div className="bg-slate-300 inline p-2 rounded-full text-base font-bold">
        Vào lúc: {moment(item.created_date).format("HH:MM")}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <img
              className="w-10 h-10 rounded-full"
              src={item.staff_id.avatar || "../images/default-avatar.png"}
            />
            <div className="text-base font-bold text-slate-600">
              Nhân viên{" "}
              <span className="font-extrabold text-black">{item.staff_id.name}</span> đã
              thực hiện cuộc gọi
            </div>
          </div>
          <div className="text-[#00b1ff] font-normal">{item.price} VND</div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <PhoneArrowUpRightIcon
              className={`w-6 h-6 ${
                item.disposition === "answered"
                  ? "fill-green-300 stroke-green-300"
                  : "fill-red-300 stroke-red-300"
              }`}
            />
            <div className="text-base font-bold text-slate-600">
              Gọi đi / {item.disposition === "answered" ? "Trả lời" : "Không trả lời"}
            </div>
          </div>
          <div className="text-base font-bold text-slate-600">{`${item.from_phone} -> ${item.customer_phone}`}</div>
        </div>
        {item.disposition === "answered" && (
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-2 text-base font-bold text-slate-600">
              <div className="flex gap-2">
                <div>File ghi âm</div>
              </div>
              <div>Thời lượng: {item.record_seconds}s</div>
              {syncData ? (
                <>
                  <div
                    className={`${syncData.sync ? "text-green-500" : "text-red-500"} `}
                  >
                    Đồng bộ: {syncData.sync ? "Đã đồng bộ" : "Chưa đồng bộ"}
                  </div>
                  <audio controls>
                    <source src={syncData.record_file} type="audio/ogg" />
                  </audio>
                </>
              ) : (
                <>
                  <div className={`${item.sync ? "text-green-500" : "text-red-500"} `}>
                    Đồng bộ: {item.sync ? "Đã đồng bộ" : "Chưa đồng bộ"}
                  </div>
                  <audio controls>
                    <source src={item.record_file} type="audio/ogg" />
                  </audio>
                </>
              )}
            </div>
            {syncData?.sync === true || item.sync === true ? null : (
              <div
                onClick={() => {
                  handlerOpenForm(item.id);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div> {isLoading ? "Đang đồng bộ..." : "Đồng bộ"}</div>
                <ArrowUpTrayIcon className="w-6 h-6" />
              </div>
            )}
            <a href={item.record_file}>
              <div className="flex items-center gap-2 cursor-pointer">
                <div>Download</div>

                <ArrowDownTrayIcon className="w-6 h-6" />
              </div>
            </a>
          </div>
        )}
        <form>
          <input
            ref={fileForm}
            hidden
            type="file"
            accept="audio/wav"
            onChange={(e: any) => {
              console.log(e.target.getAttribute("data-id"));
              if (e.target.files && e.target.files[0]) {
                uploadToStorage(e.target.getAttribute("data-id"), e.target.files[0]);
              }
            }}
          />
        </form>
      </div>
    </div>
  );
};
function CallDataInfo({ callData }: Props) {
  const [amount, setAmount] = useState(3);
  const filtered = callData.length > 0 ? callData.slice(0, amount) : [];
  return (
    <div className="flex flex-col gap-4">
      <div className="text-base font-bold text-slate-400">Lịch sử cuộc gọi</div>
      <div className="flex flex-col gap-4 divide-y">
        {filtered.length > 0 ? (
          filtered.map((item, index) => {
            return <CallDataItem key={index} item={item} />;
          })
        ) : (
          <div>Chưa có dữ liệu</div>
        )}
      </div>
      {amount < callData.length && (
        <div
          className="cursor-pointer text-indigo-600"
          onClick={() => {
            setAmount((preState) => preState + 3);
          }}
        >
          Hiển thị thêm
        </div>
      )}
    </div>
  );
}
export default CallDataInfo;
