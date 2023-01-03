import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Rating = () => {
  const [isOpenRating, setIsOpenRating] = useState(false);
  return (
    <div className="w-full h-auto bg-white drop-shadow-md rounded-xl">
      <div
        onClick={() => {
          setIsOpenRating((preState) => !preState);
        }}
        className="flex items-center h-[48px] px-6  justify-between hover:bg-slate-200"
      >
        <div> Đánh giá</div>
        <div className="bg-slate-200 p-1 rounded-full w-6 h-6 cursor-pointer">
          {isOpenRating ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </div>
      </div>
    </div>
  );
};
export default Rating;
