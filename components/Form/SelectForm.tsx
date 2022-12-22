import VNProvinces from "../../constants/VNProvince";
import Select from "react-select";

interface Props {
  title: string;
  name: string;
  defaultValue?: {
    label: string;
    value: string;
  } | null;
  required?: boolean;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  myOnChange?: any;
}
const SelectForm = ({
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
          defaultValue={defaultValue}
          placeholder={placeholder}
          options={options}
          onChange={myOnChange}
        ></Select>
      </div>
    </div>
  );
};
export default SelectForm;
