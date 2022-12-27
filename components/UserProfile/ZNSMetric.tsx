//   - Số lượng ZNS được nhận.
//   - Số lượng mở tin nhắn.
//   - Tỷ lệ mở (%).
//   - Tỷ lệ mở (%).
const RenderMetricDetails = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1 p-4 first:pl-0">
      <div className="text-slate-400 text-xs font-semibold uppercase">{label}</div>
      <div className="text-base font-bold text-slate-600">{value}</div>
    </div>
  );
};
interface Props {
  znsReceived: number;
}
const ZNSMetric = ({ znsReceived }: Props) => {
  const values = [
    {
      label: "Số lượng ZNS được nhận",
      value: znsReceived.toString(),
    },
    {
      label: "Số lượng mở tin nhắn",
      value: "30",
    },
    {
      label: "Tỷ lệ mở (%)",
      value: "30",
    },
    {
      label: "Tỷ lệ click link",
      value: "30",
    },
  ];
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="uppercase text-sm text-slate-400 font-semibold">ZNS Metric</div>
      <div className="grid grid-cols-4 border-t border-slate-200  divide-x">
        {values.map((item, index) => {
          return (
            <RenderMetricDetails key={index} label={item.label} value={item.value} />
          );
        })}
      </div>
    </div>
  );
};
export default ZNSMetric;
