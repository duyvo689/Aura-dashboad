import { Doctor, Staff } from "../../utils/types";
interface STAFF {
  staffs: Staff[];
  type: string;
}

const staffRedux = (state = null, action: STAFF) => {
  switch (action.type) {
    case "staffs":
      return action.staffs;
    default:
      return state;
  }
};

export default staffRedux;
