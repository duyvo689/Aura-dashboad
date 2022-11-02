import { combineReducers } from "redux";
import adminRedux from "./adminRedux";
import roleRedux from "./roleRedux";
const rootReducer = combineReducers({ admin: adminRedux, roles: roleRedux });
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
