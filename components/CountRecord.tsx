interface Props {
  title: string;
  amount: number;
}
function CountRecord({ amount, title }: Props) {
  return (
    <div className="font-bold px-5 py-4 flex items-center gap-1">
      <span className="text-slate-800">{title}</span>
      <span className="text-slate-400">({amount})</span>
    </div>
  );
}
export default CountRecord;
