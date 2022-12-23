interface Props {
  dataLength: number;
  filteredData: any[];
  currentPage: number;
  setNewPage: any;
}
const Pagination = ({ filteredData, dataLength, currentPage, setNewPage }: Props) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-slate-500 ">
        {`Hiển thị ${currentPage * 10} trên ${dataLength} kết quả`}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => {
            setNewPage((preState: number) => (preState <= 1 ? 1 : preState - 1));
          }}
          className={`btn bg-white border-slate-200 hover:border-slate-300 ${
            currentPage > 1 ? "text-indigo-500" : "text-slate-300 cursor-not-allowed"
          }`}
        >
          {`<- Trước`}
        </button>
        <button
          onClick={() => {
            setNewPage((preState: number) =>
              preState * 10 >= filteredData.length ? preState : preState + 1
            );
          }}
          className={`btn bg-white border-slate-200 hover:border-slate-300 ${
            currentPage * 10 < filteredData.length
              ? "text-indigo-500"
              : "text-slate-300 cursor-not-allowed"
          }`}
        >
          {`Sau ->`}
        </button>
      </div>
    </div>
  );
};
export default Pagination;
