interface Props {
  title: string;
  id: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  row: number;
}
const TextArea = ({ title, id, name, defaultValue, row, required = false }: Props) => {
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
      <div className="mt-1">
        <textarea
          id={id}
          name={name}
          rows={row}
          required={required}
          className="form-input w-full"
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
};
export default TextArea;
