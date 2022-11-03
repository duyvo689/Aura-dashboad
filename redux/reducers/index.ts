import { combineReducers } from "redux";
import adminRedux from "./adminRedux";
import roleRedux from "./roleRedux";
import userRedux from "./userRedux";
import bannerRedux from "./bannerRedux";
import clinicRedux from "./clinicRedux";
import serviceRedux from "./serviceRedux";
const rootReducer = combineReducers({
  admin: adminRedux,
  roles: roleRedux,
  users: userRedux,
  banners: bannerRedux,
  clinics: clinicRedux,
  services: serviceRedux,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
