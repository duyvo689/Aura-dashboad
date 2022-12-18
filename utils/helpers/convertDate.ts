import moment from "moment";

export const dateAgo = (date: string): string => {
  const dateTimeStamp = new Date(date).getTime();
  const startOfDate = new Date(moment().startOf("day").format()).getTime(); //return timestamp
  const endOfDate = new Date(moment().endOf("day").format()).getTime(); //return timestamp
  if (dateTimeStamp <= endOfDate) {
    return "Hôm nay";
  }
  if (
    dateTimeStamp > startOfDate + 3600 * 1000 * 24 &&
    dateTimeStamp <= endOfDate + 3600 * 1000 * 24
  ) {
    return "Ngày mai";
  }
  return moment(date).format("DD/MM/YYYY");
};
export const convertISOtoDate = (isoString: string) => {
  return new Intl.DateTimeFormat(["ban", "id"]).format(new Date(isoString));
};
type ListDate = {
  [key: string]: string;
};
type objectKey = keyof ListDate;
export const convertDateToVN = (text: string) => {
  const listWord: ListDate = {
    Sunday: "Chủ nhật",
    Monday: "Thứ 2",
    Tuesday: "Thứ 3",
    Wednesday: "Thứ 4",
    Thursday: "Thứ 5",
    Friday: "Thứ 6",
    Saturday: "Thứ 7",
    Today: "Hôm nay",
    Tomorrow: "Ngày mai",
  };
  return listWord[text as objectKey];
};
