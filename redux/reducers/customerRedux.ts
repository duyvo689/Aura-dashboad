import { Customer } from "../../utils/types";
interface CUSTOMER {
  customers: Customer[];
  type: string;
}

const adminRedux = (state = null, action: CUSTOMER) => {
  switch (action.type) {
    case "customers":
      return action.customers;
    default:
      return state;
  }
};

export default adminRedux;
