import moment from "moment";
import { timeSession } from "../../constants";
//16:00:00 to 16:00 Chiều
const session = ["MORNING", "AFTERNOON", "NIGHT"];
type ObjectKey = keyof typeof timeSession;
export const convertTime = (timeString: string) => {
  let result = "";
  session.forEach((el) => {
    if (
      moment(timeString, "HH:mm:ss").isSameOrAfter(
        moment(timeSession[el as ObjectKey].from, "HH:mm:ss")
      ) &&
      moment(timeString, "HH:mm:ss").isBefore(
        moment(timeSession[el as ObjectKey].to, "HH:mm:ss")
      )
    ) {
      result = `${timeString.slice(0, -3)} ${timeSession[el as ObjectKey].vn}`;
    }
  });
  return result;
};
