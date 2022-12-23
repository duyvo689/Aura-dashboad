import VNProvinces from "../../constants/VNProvince";
import Select from "react-select";

interface Props {
  title: string;
  name: string;
  defaultValue?: {
    label: string;
    value: string;
    image: string;
  } | null;
  required?: boolean;
  placeholder?: string;
  options: {
    label: string;
    value: string;
    image: string;
  }[];
  myOnChange?: any;
}
const SelectFormImg = ({
  title,
  name,
  placeholder,
  options,
  required = false,
  myOnChange,
  defaultValue = null,
}: Props) => {
  return (
    <div>
      <label
        htmlFor={name}
        className={`block font-medium text-sm mb-1 text-slate-600  ${
          required ? "required" : ""
        }`}
      >
        {title}
      </label>
      <div className="mt-1">
        <Select
          id={name}
          name={name}
          placeholder={placeholder}
          options={options}
          defaultValue={defaultValue}
          onChange={myOnChange}
          formatOptionLabel={(options) => (
            <div className="flex gap-2 items-center">
              <img
                src={options.image}
                className="w-10 h-10 rounded-full"
                alt="country-image"
              />
              <span className="text-sm font-normal">{options.label}</span>
            </div>
          )}
        ></Select>
      </div>
    </div>
  );
};
export default SelectFormImg;
