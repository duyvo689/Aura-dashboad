interface Props {
  title: string;
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}
const InputForm = ({
  title,
  id,
  name,
  type,
  placeholder,
  defaultValue,
  required = false,
}: Props) => {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-medium text-sm mb-1 text-slate-600 ${
          required ? "required" : ""
        }`}
      >
        {title}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="form-input w-full"
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};
export default InputForm;