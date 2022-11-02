import { User } from "../../utils/types";
interface USER {
  users: User[];
  type: string;
}

const UserRedux = (state = null, action: USER) => {
  switch (action.type) {
    case "users":
      return action.users;
    default:
      return state;
  }
};

export default UserRedux;
