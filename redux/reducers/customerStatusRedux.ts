import { CustomerStatus, CustomerStatusReturn } from "../../utils/types";
import _ from "lodash";
interface CUSTOMERSTATUS {
  customerStatus: CustomerStatus[];
  type: string;
}

const customerStatusRedux = (
  state = null,
  action: CUSTOMERSTATUS
): CustomerStatusReturn | null => {
  switch (action.type) {
    case "customerStatus":
      let grouped_data = _.groupBy(action.customerStatus, "type");

      return {
        group: {
          status: grouped_data?.status || [],
          details_status: grouped_data?.details_status || [],
          interact_type: grouped_data?.interact_type || [],
          interact_result: grouped_data?.interact_result || [],
        },
        data: action.customerStatus,
      };

    default:
      return state;
  }
};

export default customerStatusRedux;
