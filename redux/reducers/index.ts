import { combineReducers } from "redux";
import adminRedux from "./adminRedux";
import roleRedux from "./roleRedux";
import userRedux from "./userRedux";
const rootReducer = combineReducers({
  admin: adminRedux,
  roles: roleRedux,
  users: userRedux,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
