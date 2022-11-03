import { Clinic } from "../../utils/types";
interface CLINIC {
  clinics: Clinic[];
  type: string;
}

const adminRedux = (state = null, action: CLINIC) => {
  switch (action.type) {
    case "clinics":
      return action.clinics;
    default:
      return state;
  }
};

export default adminRedux;
