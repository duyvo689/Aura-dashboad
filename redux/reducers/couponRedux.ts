import { Coupon } from "../../utils/types";
interface COUPON {
  coupons: Coupon[];
  type: string;
}

const adminRedux = (state = null, action: COUPON) => {
  switch (action.type) {
    case "coupons":
      return action.coupons;
    default:
      return state;
  }
};

export default adminRedux;
