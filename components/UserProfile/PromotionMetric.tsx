import { CompareTwoDates } from "../../utils/funtions";
import { CouponUser } from "../../utils/types";

const RenderMetricDetails = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1 p-4 first:pl-0">
      <div className="text-slate-400 text-xs font-semibold uppercase">{label}</div>
      <div className="text-base font-bold text-slate-600">{value}</div>
    </div>
  );
};
interface Props {
  couponsOfUser: CouponUser[];
}
const PromotionMetrics = ({ couponsOfUser }: Props) => {
  const receivedCoupons = couponsOfUser.length;
  const usedCoupons = couponsOfUser.filter((item) => item.used).length;
  const validCoupons = couponsOfUser.filter((item) =>
    item.used === false && item.end_date
      ? CompareTwoDates(new Date(Date.now()), new Date(item.end_date))
      : false
  ).length;
  const values = [
    {
      label: "Số lượng coupon đã nhận",
      value: receivedCoupons,
    },
    {
      label: "Số lượng coupon đã dùng",
      value: usedCoupons,
    },
    {
      label: "Số lượng coupon còn hiệu lực",
      value: validCoupons,
    },
    {
      label: "Tỷ lệ sử dụng (%)",
      value:
        receivedCoupons === 0
          ? "0%"
          : `${Math.floor((usedCoupons / receivedCoupons) * 100)}%`,
    },
  ];
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="uppercase text-sm text-slate-400 font-semibold">
        Promotions Metric
      </div>
      <div className="grid grid-cols-4 border-t border-slate-200  divide-x">
        {values.map((item, index) => {
          return (
            <RenderMetricDetails
              key={index}
              label={item.label}
              value={item.value.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};
export default PromotionMetrics;
