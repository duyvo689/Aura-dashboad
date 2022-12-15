import { CustomerStatus } from "../../utils/types";
interface CUSTOMERSTATUS {
  customerStatus: CustomerStatus[];
  type: string;
}

const customerStatusRedux = (state = null, action: CUSTOMERSTATUS) => {
  switch (action.type) {
    case "customerStatus":
      return action.customerStatus;
    default:
      return state;
  }
};

export default customerStatusRedux;
