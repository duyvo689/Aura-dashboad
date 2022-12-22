import { combineReducers } from "redux";
import adminRedux from "./adminRedux";
import roleRedux from "./roleRedux";
import userRedux from "./userRedux";
import bannerRedux from "./bannerRedux";
import clinicRedux from "./clinicRedux";
import serviceRedux from "./serviceRedux";
import categoryRedux from "./categoryRedux";
import paymentyRedux from "./paymentyRedux";
import customerRedux from "./customerRedux";
import couponRedux from "./couponRedux";
import customerStatusRedux from "./customerStatusRedux";
import doctorRedux from "./doctorRedux";
import oaPostRedux from "./oaPostRedux";
const rootReducer = combineReducers({
  admin: adminRedux,
  roles: roleRedux,
  users: userRedux,
  banners: bannerRedux,
  clinics: clinicRedux,
  services: serviceRedux,
  category: categoryRedux,
  payments: paymentyRedux,
  customers: customerRedux,
  coupons: couponRedux,
  customerStatus: customerStatusRedux,
  doctors: doctorRedux,
  oaPosts: oaPostRedux,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
