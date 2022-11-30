import { Payment } from "../../utils/types";
interface PAYMENT {
  payments: Payment[];
  type: string;
}

const adminRedux = (state = null, action: PAYMENT) => {
  switch (action.type) {
    case "payments":
      return action.payments;
    default:
      return state;
  }
};

export default adminRedux;
