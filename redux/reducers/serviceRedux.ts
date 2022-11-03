import { Service } from "../../utils/types";
interface SERVICE {
  services: Service[];
  type: string;
}

const ServiceRedux = (state = null, action: SERVICE) => {
  switch (action.type) {
    case "services":
      return action.services;
    default:
      return state;
  }
};

export default ServiceRedux;
