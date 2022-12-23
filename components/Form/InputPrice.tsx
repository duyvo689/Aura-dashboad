import { NumericFormat } from "react-number-format";
const MAX_VAL = 100;
interface Props {
  title: string;
  name: string;
  defaultValue?: number | null;
  type: "percent" | "price";
}
const limitRangePercent = (inputObj: any) => {
  const { value } = inputObj;
  if (value <= MAX_VAL) return true;
  return false;
};
const limitRangePrice = (inputObj: any) => {
  const { floatValue } = inputObj;
  if (floatValue !== 0) return true;
  return false;
};
const InputPrice = ({ title, name, type, defaultValue }: Props) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-medium text-sm mb-1 text-slate-600 required"
      >
        {title}
      </label>
      {type === "percent" && (
        <div className="mt-1">
          <NumericFormat
            name={name}
            isAllowed={limitRangePercent}
            defaultValue={defaultValue}
            allowNegative={false}
            allowLeadingZeros
            className="form-input w-full"
            suffix={"%"}
          />
        </div>
      )}
      {type === "price" && (
        <div className="relative mt-1 rounded-md">
          <NumericFormat
            name={name}
            isAllowed={limitRangePrice}
            defaultValue={defaultValue}
            allowNegative={false}
            allowLeadingZeros
            className="form-input w-full"
            thousandSeparator=","
            suffix="đ"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-7">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              VND
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default InputPrice;
