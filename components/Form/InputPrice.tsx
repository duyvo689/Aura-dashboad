import { NumericFormat } from "react-number-format";

interface Props {
  title: string;
  name: string;
  defaultValue?: string;
  type: "percent" | "price";
}
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
            defaultValue={defaultValue}
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
