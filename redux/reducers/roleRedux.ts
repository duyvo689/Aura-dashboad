import { Role } from "../../utils/types";
interface ROLE {
  roles: Role[];
  type: string;
}

const RoleRedux = (state = null, action: ROLE) => {
  switch (action.type) {
    case "roles":
      return action.roles;
    default:
      return state;
  }
};

export default RoleRedux;
