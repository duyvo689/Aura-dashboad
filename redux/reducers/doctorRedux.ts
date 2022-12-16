import { Doctor } from "../../utils/types";
interface DOCTOR {
  doctors: Doctor[];
  type: string;
}

const adminRedux = (state = null, action: DOCTOR) => {
  switch (action.type) {
    case "doctors":
      return action.doctors;
    default:
      return state;
  }
};

export default adminRedux;
