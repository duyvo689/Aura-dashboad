const Size = {
  sm: "w-20",
  md: "w-40",
  lg: "w-60",
};
interface Props {
  type: "button" | "submit" | "reset";
  content: string;
  size: "sm" | "md" | "lg";
}
const SubmitBtn = ({ type, content, size = "sm" }: Props) => {
  return (
    <button
      className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ${Size[size]}`}
      type={type}
    >
      {content}
    </button>
  );
};
export default SubmitBtn;
