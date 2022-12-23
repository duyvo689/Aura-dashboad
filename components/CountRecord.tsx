interface Props {
  title: string;
  amount: number;
}
function CountRecord({ amount, title }: Props) {
  return (
    <div className="font-bold px-5 py-4 flex items-center gap-1">
      <h2 className="text-slate-800">{title}</h2>
      <span className="text-slate-400">{amount}</span>
    </div>
  );
}
export default CountRecord;
