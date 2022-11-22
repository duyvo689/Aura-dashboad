import { combineReducers } from "redux";
import adminRedux from "./adminRedux";
import roleRedux from "./roleRedux";
import userRedux from "./userRedux";
import bannerRedux from "./bannerRedux";
import clinicRedux from "./clinicRedux";
import serviceRedux from "./serviceRedux";
import categoryRedux from "./categoryRedux"
import paymentyRedux from "./paymentyRedux";
import customerRedux from "./customerRedux";
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
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
